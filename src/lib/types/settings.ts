import type { FileUpload } from '@appTypes/upload';

export type GeneralSettings = {
  updatedAt: Date | null;
  appName: string;
  appURL: string;
  appLogo: FileUpload | null;
  appFavicon: FileUpload | null;
  appDescription: string | null;
  showAnnouncementBanner: boolean;
  announcementMessage: string | null;
  announcementType: 'info' | 'success' | 'warning' | 'critical';
  defaultLanguage: string;
  defaultTimezone: string;
  defaultItemsPerPage: number;
  maxFileSize: number;
};

export type AuthSettings = {
  updatedAt?: Date | null;
  allowPublicRegistration: boolean;
  requireEmailVerfication: boolean;
  requireAdminApprovial?: boolean;
  defaultUserRole?: string;
  registrationWelcomeEmail?: boolean;
  allowUserInvitations: boolean;
  invitationOnlyMode: boolean;
  invitationExpiry?: number;
  sessionTimeout?: number;
  sessionIdleTimeout?: number;
  rememberMeDuration?: number;
  maxLoginAttempts?: number;
  lockoutDuration?: number;
  twoFactorAuthentication: boolean;
  twoFactorAuthRequired: boolean;
  enableOauth?: boolean;
};

export type EmailSettings = {
  updatedAt: Date | null;
  emailProvider: 'smtp' | 'mailgun' | 'sendgrid' | 'ses' | 'postmark';
  emailEnabled: boolean;
  emailFromAddress: string | null;
  emailFromName: string | null;
  SMTPHost: string | null;
  SMTPPort: number
  SMTPUsername: string | null;
  SMTPPassword: string | null;
  SMTPEncryption: 'tls' | 'ssl' | 'none';
  SMTPAuthMethod: 'plain' | 'login' | 'cram-md5' | 'noauth';
  SMTPVerifySSL: boolean;
  sendGridAPIKey: string | null;
  mailgunAPIKey: string | null;
  mailgunDomain: string | null;
  SESAccessKeyID: string | null;
  SESSecretAccessKey: string | null;
  SESRegion: string | null;
  postmarkServerToken: string | null;
  postmarkAccountToken: string | null;
  emailFooterText: string | null;
  enableEmailNotifications: boolean;
  sendPasswordResetEmail: boolean;
  notifyOnCardAssigned: boolean;
  notifyOnCardComment: boolean;
  notifyOnCardDue: boolean;
  notifyOnBoardInvite: boolean;
  notifyOnMention: boolean;
};

export type PublicGeneralSettings = {
  appName: string;
  appURL: string;
  appLogo: FileUpload | null;
  appFavicon: FileUpload | null;
  appDescription: string | null;
  showAnnouncementBanner: boolean;
  announcementMessage: string | null;
  announcementType: 'info' | 'success' | 'warning' | 'critical';
  defaultLanguage: string;
  defaultTimezone: string;
  defaultItemsPerPage: number;
  maxFileSize: number;
};

export type PublicAuthSettings = {
  allowPublicRegistration: boolean;
  requireEmailVerfication: boolean;
  allowUserInvitations: boolean;
  invitationOnlyMode: boolean;
  twoFactorAuthentication: boolean;
  twoFactorAuthRequired: boolean;
};

export type PublicEmailSettings = {
  emailEnabled: boolean;
  enableEmailNotifications: boolean;
  sendPasswordResetEmail: boolean;
  notifyOnCardAssigned: boolean;
  notifyOnCardComment: boolean;
  notifyOnCardDue: boolean;
  notifyOnBoardInvite: boolean;
  notifyOnMention: boolean;
};

export type GeneralSettingsResponse = {
  updated_at: Date | null;
  app_name: string;
  app_url: string;
  app_logo: FileUpload | null;
  app_favicon: FileUpload | null;
  app_description: string | null;
  show_announcement_banner: boolean;
  announcement_message: string | null;
  announcement_type: 'info' | 'success' | 'warning' | 'critical';
  default_language: string;
  default_timezone: string;
  default_items_per_page: number;
  max_file_size: number;
};

export type PublicGeneralSettingsResponse = {
  app_name: string;
  app_url: string;
  app_logo: FileUpload | null;
  app_favicon: FileUpload | null;
  app_description: string | null;
  show_announcement_banner: boolean;
  announcement_message: string | null;
  announcement_type: 'info' | 'success' | 'warning' | 'critical';
  default_language: string;
  default_timezone: string;
  default_items_per_page: number;
  max_file_size: number;
};

export type AuthSettingsResponse = {
  updated_at?: Date | null;
  allow_public_registration: boolean;
  require_email_verification: boolean;
  require_admin_approvial?: boolean;
  default_user_role?: string;
  registration_welcome_email?: boolean;
  allow_user_invitations: boolean;
  invitation_only_mode: boolean;
  invitation_expiry?: number;
  session_timeout?: number;
  session_idle_timeout?: number;
  remember_me_duration?: number;
  max_login_attempts?: number;
  lockout_duration?: number;
  two_factor_authentication: boolean;
  two_factor_authentication_required: boolean;
  enable_oauth?: boolean;
};

export type PublicAuthSettingsResponse = {
  allow_public_registration: boolean;
  require_email_verification: boolean;
  allow_user_invitations: boolean;
  invite_only_mode: boolean;
  two_factor_authentication: boolean;
  two_factor_authentication_required: boolean;
};

export type EmailSettingsResponse = {
  updated_at: Date | null;
  email_provider: 'smtp' | 'mailgun' | 'sendgrid' | 'ses' | 'postmark';
  email_enabled: boolean;
  email_from_address: string | null;
  email_from_name: string | null;
  smtp_host: string | null;
  smtp_port: number
  smtp_username: string | null;
  smtp_password: string | null;
  smtp_encryption: 'tls' | 'ssl' | 'none';
  smtp_auth_method: 'plain' | 'login' | 'cram-md5' | 'noauth';
  smtp_verify_ssl: boolean;
  sendgrid_api_key: string | null;
  mailgun_api_key: string | null;
  mailgun_domain: string | null;
  ses_access_key_id: string | null;
  ses_secret_access_key: string | null;
  ses_region: string | null;
  postmark_server_token: string | null;
  postmark_account_token: string | null;
  email_footer_text: string | null;
  enable_email_notifications: boolean;
  send_password_reset_email: boolean;
  notify_on_card_assigned: boolean;
  notify_on_card_comment: boolean;
  notify_on_card_due: boolean;
  notify_on_board_invite: boolean;
  notify_on_mention: boolean;
};

export type PublicEmailSettingsResponse = {
  email_enabled: boolean;
  enable_email_notifications: boolean;
  send_password_reset_email: boolean;
  notify_on_card_assigned: boolean;
  notify_on_card_comment: boolean;
  notify_on_card_due: boolean;
  notify_on_board_invite: boolean;
  notify_on_mention: boolean;
};
