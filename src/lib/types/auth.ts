import type { UserResponse } from '@appTypes/user';

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
