export type Bindings = {
  DB: D1Database;
  CLOUDFLARE_ACCOUNT_ID: string;
  CLOUDFLARE_ACCOUNT_HASH: string;
  JWT_SECRET: string;
  ARDEN_REFRESH_TOKEN_KV: KVNamespace;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  APPLE_CLIENT_ID: string;
  APPLE_PRIVATE_KEY: string;
  APPLE_KEY_ID: string;
  APPLE_TEAM_ID: string;
};

export type Variables = {
  user: AppUser;
};

export type AppUser = {
  id: string;
  email?: string;
};

export type ContextType = {
  env: Bindings;
  user?: AppUser;
};

export type OAuthProvider = 'google' | 'apple';

export type OAuthTokens = {
  access_token: string;
  refresh_token?: string;
  id_token?: string;
  expires_in?: number;
};

export type OAuthUserInfo = {
  id: string;
  email?: string | undefined;
  name?: string | undefined;
  picture?: string | undefined;
  provider: OAuthProvider;
};
