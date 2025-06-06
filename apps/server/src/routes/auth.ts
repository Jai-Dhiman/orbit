import { Hono } from "hono";
import type { Bindings } from "../types";
import { z } from "zod";
import { createD1Client } from "../db";
import * as schema from "../db/schema";
import { nanoid } from "nanoid";
import { eq, and } from "drizzle-orm";
import { sign } from "hono/jwt";
import { authMiddleware } from "../middleware/auth";
import { 
  exchangeGoogleCodeForTokens, 
  getGoogleUserInfo, 
  exchangeAppleCodeForTokens, 
  parseAppleIdToken, 
  normalizeOAuthUserInfo 
} from "../utils/oauth";

const router = new Hono<{
  Bindings: Bindings;
}>();

const oauthCallbackSchema = z.object({
  code: z.string(),
  state: z.string().optional(),
  provider: z.enum(['google', 'apple']),
  redirect_uri: z.string().url(),
});

const refreshTokenSchema = z.object({
  refresh_token: z.string(),
});

const REFRESH_TOKEN_EXPIRATION_SECONDS = 60 * 60 * 24 * 7; // 7 days in seconds

async function generateJwtToken(userId: string, email: string | undefined, env: Bindings): Promise<{accessToken: string, refreshToken: string, accessTokenExpiresAt: number}> {
    if (!env.JWT_SECRET) {
        console.error("JWT_SECRET is not defined in environment variables.");
        throw new Error("JWT_SECRET not configured");
    }

    const now = Math.floor(Date.now() / 1000);
    const accessTokenPayload = {
        sub: userId,
        email: email,
        iat: now,
        exp: now + (15 * 60), // 15 minutes from now
    };
    const accessToken = await sign(accessTokenPayload, env.JWT_SECRET);
    const accessTokenExpiresAt = accessTokenPayload.exp * 1000; // convert to milliseconds for client

    // For refresh tokens, we often use opaque strings stored in KV with an expiry.
    const refreshToken = nanoid(64); // Generate a strong random string

    if (env.ARDEN_REFRESH_TOKEN_KV) {
        await env.ARDEN_REFRESH_TOKEN_KV.put(`rt_${refreshToken}`, userId, { 
            expirationTtl: REFRESH_TOKEN_EXPIRATION_SECONDS 
        });
    } else {
        console.warn("ARDEN_REFRESH_TOKEN_KV is not available. Refresh token will not be stored.");
    }

    return { accessToken, refreshToken, accessTokenExpiresAt };
}

// Enhanced type safety for auth responses
const AuthResponseSchema = z.object({
  session: z.object({
    access_token: z.string(),
    refresh_token: z.string(),
    expires_at: z.number(),
  }),
  user: z.object({
    id: z.string(),
    email: z.string().nullable(),
    name: z.string().nullable(),
    picture: z.string().nullable(),
  }),
  profileExists: z.boolean(),
  isNewUser: z.boolean().optional(),
});

// OAuth callback route for Google and Apple
router.post("/oauth/callback", async (c) => {
  try {
    const body = await c.req.json();
    const validation = oauthCallbackSchema.safeParse(body);

    if (!validation.success) {
      return c.json(
        {
          error: "Invalid input",
          details: validation.error.errors,
          code: "auth/invalid-input",
        },
        400
      );
    }

    const { code, provider, redirect_uri } = validation.data;
    const db = createD1Client(c.env);

    let oauthUserInfo: any;
    let tokens: any;

    if (provider === 'google') {
      tokens = await exchangeGoogleCodeForTokens(code, redirect_uri, c.env);
      const googleUserInfo = await getGoogleUserInfo(tokens.access_token);
      oauthUserInfo = normalizeOAuthUserInfo(googleUserInfo, 'google');
    } else if (provider === 'apple') {
      tokens = await exchangeAppleCodeForTokens(code, redirect_uri, c.env);
      const appleUserInfo = parseAppleIdToken(tokens.id_token);
      oauthUserInfo = normalizeOAuthUserInfo(appleUserInfo, 'apple');
    } else {
      return c.json({ error: "Unsupported provider", code: "auth/unsupported-provider" }, 400);
    }

    // Check if user already exists with this OAuth account
    const existingOAuthAccount = await db.select()
      .from(schema.oauthAccounts)
      .where(
        and(
          eq(schema.oauthAccounts.provider, provider),
          eq(schema.oauthAccounts.providerAccountId, oauthUserInfo.id)
        )
      )
      .get();

    let userId: string;
    let isNewUser = false;

    if (existingOAuthAccount) {
      // User exists, update tokens
      userId = existingOAuthAccount.userId;
      
      await db.update(schema.oauthAccounts)
        .set({
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token,
          idToken: tokens.id_token,
          expiresAt: tokens.expires_in ? Math.floor(Date.now() / 1000) + tokens.expires_in : null,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(schema.oauthAccounts.id, existingOAuthAccount.id));

      // Update user info if available
      if (oauthUserInfo.email || oauthUserInfo.name || oauthUserInfo.picture) {
        await db.update(schema.users)
          .set({
            email: oauthUserInfo.email || undefined,
            name: oauthUserInfo.name || undefined,
            picture: oauthUserInfo.picture || undefined,
            updatedAt: new Date().toISOString(),
          })
          .where(eq(schema.users.id, userId));
      }
    } else {
      // Check if user exists by email (to link accounts)
      let existingUser = null;
      if (oauthUserInfo.email) {
        existingUser = await db.select()
          .from(schema.users)
          .where(eq(schema.users.email, oauthUserInfo.email))
          .get();
      }

      if (existingUser) {
        userId = existingUser.id;
      } else {
        // Create new user
        userId = nanoid();
        isNewUser = true;

        await db.insert(schema.users).values({
          id: userId,
          email: oauthUserInfo.email || null,
          name: oauthUserInfo.name || null,
          picture: oauthUserInfo.picture || null,
          emailVerified: 1, // OAuth providers verify emails
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }

      // Create OAuth account record
      await db.insert(schema.oauthAccounts).values({
        id: nanoid(),
        userId,
        provider,
        providerAccountId: oauthUserInfo.id,
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        idToken: tokens.id_token,
        expiresAt: tokens.expires_in ? Math.floor(Date.now() / 1000) + tokens.expires_in : null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    // Generate JWT tokens
    const { accessToken, refreshToken, accessTokenExpiresAt } = await generateJwtToken(
      userId, 
      oauthUserInfo.email, 
      c.env
    );

    // Check if profile exists
    let profileExists = false;
    try {
      const existingProfile = await db.select({ id: schema.profile.id })
        .from(schema.profile)
        .where(eq(schema.profile.userId, userId))
        .get();
      
      if (existingProfile) {
        profileExists = true;
      }

      // Log activity
      await db.insert(schema.userActivity).values({
        id: nanoid(),
        userId,
        eventType: isNewUser ? "register" : "login",
        metadata: JSON.stringify({ provider, oauth_user_id: oauthUserInfo.id }),
        createdAt: new Date().toISOString(),
      });
    } catch (dbError) {
      console.error("Error during profile check or activity logging:", dbError);
    }

    return c.json({
      session: {
        access_token: accessToken,
        refresh_token: refreshToken,
        expires_at: accessTokenExpiresAt,
      },
      user: {
        id: userId,
        email: oauthUserInfo.email,
        name: oauthUserInfo.name,
        picture: oauthUserInfo.picture,
      },
      profileExists,
      isNewUser,
    });
  } catch (error) {
    console.error("OAuth callback error:", error);
    return c.json({ 
      error: "Authentication failed", 
      code: "auth/oauth-error",
      details: error instanceof Error ? error.message : "Unknown error"
    }, 500);
  }
});

// Get OAuth authorization URLs
router.get("/oauth/:provider/url", async (c) => {
  const provider = c.req.param("provider");
  const redirectUri = c.req.query("redirect_uri");
  const state = c.req.query("state");

  if (!redirectUri) {
    return c.json({ error: "redirect_uri is required", code: "auth/missing-redirect-uri" }, 400);
  }

  if (provider === "google") {
    const params = new URLSearchParams({
      client_id: c.env.GOOGLE_CLIENT_ID,
      redirect_uri: redirectUri,
      response_type: "code",
      scope: "openid email profile",
      access_type: "offline",
      prompt: "consent",
      ...(state && { state }),
    });

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
    return c.json({ url: authUrl });
  }
  
  if (provider === "apple") {
    const params = new URLSearchParams({
      client_id: c.env.APPLE_CLIENT_ID,
      redirect_uri: redirectUri,
      response_type: "code",
      scope: "name email",
      response_mode: "form_post",
      ...(state && { state }),
    });

    const authUrl = `https://appleid.apple.com/auth/authorize?${params}`;
    return c.json({ url: authUrl });
  }
  
  return c.json({ error: "Unsupported provider", code: "auth/unsupported-provider" }, 400);
});

router.post("/refresh", async (c) => {
  try {
    const body = await c.req.json();
    const validation = refreshTokenSchema.safeParse(body);

    if (!validation.success) {
      return c.json(
        {
          error: "Invalid input",
          code: "auth/invalid-input",
        },
        400
      );
    }
    
    const { refresh_token } = validation.data;

    if (!c.env.ARDEN_REFRESH_TOKEN_KV) {
        return c.json({ error: "Token refresh capability not configured.", code: "auth/kv-not-configured"}, 500);
    }

    const storedUserId = await c.env.ARDEN_REFRESH_TOKEN_KV.get(`rt_${refresh_token}`);
    if (!storedUserId) {
        return c.json({ error: "Invalid or expired refresh token", code: "auth/invalid-refresh-token" }, 401);
    }

    // Invalidate the used refresh token immediately to prevent reuse
    await c.env.ARDEN_REFRESH_TOKEN_KV.delete(`rt_${refresh_token}`);

    const db = createD1Client(c.env);
    const user = await db.select().from(schema.users).where(eq(schema.users.id, storedUserId)).get();

    if (!user) {
        return c.json({ error: "User not found for refresh token", code: "auth/user-not-found" }, 401);
    }

    // Generate new pair of tokens
    const { accessToken: newAccessToken, refreshToken: newRefreshToken, accessTokenExpiresAt: newAccessTokenExpiresAt } = await generateJwtToken(user.id, user.email || undefined, c.env);

    // Check profile existence
    let profileExists = false;
    try {
      const existingProfile = await db.select({ id: schema.profile.id })
        .from(schema.profile)
        .where(eq(schema.profile.userId, user.id))
        .get();
      if (existingProfile) {
        profileExists = true;
      }
    } catch (dbProfileError) {
      console.error("Error checking profile during token refresh:", dbProfileError);
    }

    return c.json({
      session: {
         access_token: newAccessToken,
         refresh_token: newRefreshToken,
         expires_at: newAccessTokenExpiresAt,
      },
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        picture: user.picture,
      },
      profileExists
    });
  } catch (error) {
    console.error("Token refresh error:", error);
    return c.json({ error: "Failed to refresh token", code: "auth/server-error" }, 500);
  }
});

router.post("/logout", async (c) => {
    const body = await c.req.json().catch(() => ({}));
    const refreshTokenToInvalidate = body.refresh_token;

    if (refreshTokenToInvalidate && c.env.ARDEN_REFRESH_TOKEN_KV) {
        await c.env.ARDEN_REFRESH_TOKEN_KV.delete(`rt_${refreshTokenToInvalidate}`);
    }

    return c.json({ success: true, message: "Logged out successfully." });
});

// Get current user info
router.get("/me", authMiddleware, async (c) => {
  const user = c.get("user");
  const db = createD1Client(c.env);
  
  // Get full user data from database
  const userData = await db.select().from(schema.users).where(eq(schema.users.id, user.id)).get();
  
  if (!userData) {
    return c.json({ error: "User not found", code: "auth/user-not-found" }, 404);
  }

  let profileExists = false;
  try {
    const existingProfile = await db.select().from(schema.profile).where(eq(schema.profile.userId, user.id)).get();
    profileExists = Boolean(existingProfile);
  } catch (e) {
    console.error("Error checking profile existence in /auth/me:", e);
  }
  
  return c.json({ 
    id: userData.id, 
    email: userData.email, 
    name: userData.name,
    picture: userData.picture,
    profileExists 
  });
});

// Unlink OAuth account
router.delete("/oauth/:provider", authMiddleware, async (c) => {
  const provider = c.req.param("provider");
  const user = c.get("user");
  const db = createD1Client(c.env);

  if (!['google', 'apple'].includes(provider)) {
    return c.json({ error: "Unsupported provider", code: "auth/unsupported-provider" }, 400);
  }

  // Check if user has multiple OAuth accounts before allowing unlink
  const oauthAccounts = await db.select()
    .from(schema.oauthAccounts)
    .where(eq(schema.oauthAccounts.userId, user.id));

  if (oauthAccounts.length <= 1) {
    return c.json({ 
      error: "Cannot unlink the last authentication method", 
      code: "auth/last-auth-method" 
    }, 400);
  }

  // Delete the OAuth account
  await db.delete(schema.oauthAccounts)
    .where(
      and(
        eq(schema.oauthAccounts.userId, user.id),
        eq(schema.oauthAccounts.provider, provider)
      )
    );

  return c.json({ success: true, message: `${provider} account unlinked successfully.` });
});

export default router;
