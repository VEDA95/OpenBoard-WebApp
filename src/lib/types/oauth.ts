export type OAuthProvider = {
  id: string;
  name: string;
  clientId: string;
  authUrl: string;
  loginUrl: string;
  userInfoUrl: string;
  logoutUrl: string | null;
  usePkce: boolean;
  defaultLoginMethod: boolean;
  selfRegistrationEnabled: boolean;
  requiredEmailDomain: string | null;
};

export type OAuthProviderResponse = {
  id: string;
  name: string;
  client_id: string;
  auth_url: string;
  login_url: string;
  userinfo_url: string;
  logout_url: string | null;
  use_pkce: boolean;
  default_login_method: boolean;
  self_registration_enabled: boolean;
  required_email_domain: string | null;
};

export type OAuthProviderPublic = {
  id: string;
  name: string;
  defaultLoginMethod: boolean;
};

export type OAuthProviderPublicResponse = {
  id: string;
  name: string;
  default_login_method: boolean;
};
