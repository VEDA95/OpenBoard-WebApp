import type { UserResponse } from '@appTypes/user';
import type { AuthSettings, PublicAuthSettings } from '@appTypes/settings';
import type { OAuthProvider } from '@appTypes/oauth';

export type LoginPayload = {
  type: 'token' | 'session';
  username: string;
  password: string;
  remember_me: boolean;
};

export type LoggedInResponse = {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  refresh_expires_in: number;
  user: UserResponse;
};

export type RegisterUserPayload = {
  username: string;
  email: string;
  password: string;
  confirm_password: string;
  first_name?: string;
  last_name?: string;
};

export type ForgotPasswordPayload = {
  email: string;
};

export type PasswordResetOTPPayload = {
  otp: string;
};

export type PasswordResetPayload = PasswordResetOTPPayload & {
  password: string;
  confirm_password: string;
};

export type AuthPageContextType = {
  authSettings: AuthSettings | PublicAuthSettings;
  oauthProviders: OAuthProvider[];
};
