import type {
  AuthSettings,
  PublicAuthSettings,
  AuthSettingsResponse,
  PublicAuthSettingsResponse
} from '@appTypes/settings';
import type { OAuthProvider, OAuthProviderResponse } from '@appTypes/oauth';

export function parseAuthSettings(settings: AuthSettingsResponse): AuthSettings {
  return {
    updatedAt: settings.updated_at,
    allowPublicRegistration: settings.allow_public_registration,
    requireAdminApprovial: settings.require_admin_approvial,
    requireEmailVerfication: settings.require_email_verification,
    defaultUserRole: settings.default_user_role,
    allowUserInvitations: settings.allow_user_invitations,
    invitationOnlyMode: settings.invitation_only_mode,
    invitationExpiry: settings.invitation_expiry,
    sessionTimeout: settings.session_timeout,
    sessionIdleTimeout: settings.session_idle_timeout,
    rememberMeDuration: settings.remember_me_duration,
    registrationWelcomeEmail: settings.registration_welcome_email,
    maxLoginAttempts: settings.max_login_attempts,
    lockoutDuration: settings.lockout_duration,
    twoFactorAuthentication: settings.two_factor_authentication,
    twoFactorAuthRequired: settings.two_factor_authentication_required,
    enableOauth: settings.enable_oauth
  };
}

export function parsePublicAuthSettings(settings: PublicAuthSettingsResponse): PublicAuthSettings {
  return {
    allowPublicRegistration: settings.allow_public_registration,
    requireEmailVerfication: settings.require_email_verification,
    allowUserInvitations: settings.allow_user_invitations,
    invitationOnlyMode: settings.invite_only_mode,
    twoFactorAuthentication: settings.two_factor_authentication,
    twoFactorAuthRequired: settings.two_factor_authentication_required
  } as PublicAuthSettings;
}

export function parseOAuthProvider(provider: OAuthProviderResponse): OAuthProvider {
  return {
    id: provider.id,
    name: provider.name,
    clientId: provider.client_id,
    authUrl: provider.auth_url,
    loginUrl: provider.login_url,
    userInfoUrl: provider.userinfo_url,
    logoutUrl: provider.logout_url,
    usePkce: provider.use_pkce,
    defaultLoginMethod: provider.default_login_method,
    selfRegistrationEnabled: provider.self_registration_enabled,
    requiredEmailDomain: provider.required_email_domain
  };
}

export function parseOAuthProviders(providers: OAuthProviderResponse[]): OAuthProvider[] {
  return providers.map(parseOAuthProvider);
}
