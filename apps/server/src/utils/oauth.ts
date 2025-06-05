import type { OAuthTokens, OAuthUserInfo, OAuthProvider, Bindings } from "../types";

export interface GoogleTokenResponse {
  access_token: string;
  refresh_token?: string;
  id_token: string;
  token_type: string;
  expires_in: number;
}

export interface GoogleUserInfo {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  locale: string;
}

export interface AppleTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
  id_token: string;
}

export interface AppleUserInfo {
  sub: string;
  email?: string;
  email_verified?: boolean;
  name?: {
    firstName?: string;
    lastName?: string;
  };
}

export async function exchangeGoogleCodeForTokens(
  code: string,
  redirectUri: string,
  env: Bindings
): Promise<GoogleTokenResponse> {
  const tokenUrl = "https://oauth2.googleapis.com/token";
  
  const response = await fetch(tokenUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      code,
      client_id: env.GOOGLE_CLIENT_ID,
      client_secret: env.GOOGLE_CLIENT_SECRET,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Google token exchange failed: ${error}`);
  }

  return response.json();
}

export async function getGoogleUserInfo(accessToken: string): Promise<GoogleUserInfo> {
  const response = await fetch(
    `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${accessToken}`
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to get Google user info: ${error}`);
  }

  return response.json();
}

export async function exchangeAppleCodeForTokens(
  code: string,
  redirectUri: string,
  env: Bindings
): Promise<AppleTokenResponse> {
  // For Apple Sign In, we need to create a client assertion JWT
  const clientAssertion = await createAppleClientAssertion(env);
  
  const tokenUrl = "https://appleid.apple.com/auth/token";
  
  const response = await fetch(tokenUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: env.APPLE_CLIENT_ID,
      client_assertion_type: "urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
      client_assertion: clientAssertion,
      code,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Apple token exchange failed: ${error}`);
  }

  return response.json();
}

export function parseAppleIdToken(idToken: string): AppleUserInfo {
  try {
    // Decode JWT payload without verification (Apple's public keys would be needed for full verification)
    const parts = idToken.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid JWT format');
    }
    
    const payload = JSON.parse(atob(parts[1]!));
    return payload as AppleUserInfo;
  } catch (error) {
    throw new Error(`Failed to parse Apple ID token: ${error}`);
  }
}

async function createAppleClientAssertion(env: Bindings): Promise<string> {
  // This is a simplified version - in production, you'd want proper JWT signing
  // For now, we'll create a basic assertion structure
  const header = {
    alg: "ES256",
    kid: env.APPLE_KEY_ID,
  };

  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iss: env.APPLE_TEAM_ID,
    iat: now,
    exp: now + 3600, // 1 hour
    aud: "https://appleid.apple.com",
    sub: env.APPLE_CLIENT_ID,
  };

  // Note: In production, you would properly sign this with your Apple private key
  // For now, this is a placeholder that shows the structure
  const encodedHeader = btoa(JSON.stringify(header));
  const encodedPayload = btoa(JSON.stringify(payload));
  
  // This would need proper ES256 signing with the Apple private key
  const signature = "placeholder_signature";
  
  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

export function normalizeOAuthUserInfo(
  userInfo: GoogleUserInfo | AppleUserInfo,
  provider: OAuthProvider
): OAuthUserInfo {
  if (provider === 'google') {
    const googleUser = userInfo as GoogleUserInfo;
    return {
      id: googleUser.id,
      email: googleUser.email,
      name: googleUser.name,
      picture: googleUser.picture,
      provider: 'google',
    };
  }
  
  const appleUser = userInfo as AppleUserInfo;
  return {
    id: appleUser.sub,
    email: appleUser.email || undefined,
    name: appleUser.name 
      ? `${appleUser.name.firstName || ''} ${appleUser.name.lastName || ''}`.trim() || undefined
      : undefined,
    provider: 'apple',
  };
} 