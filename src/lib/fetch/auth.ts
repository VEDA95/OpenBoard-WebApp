import { publicClient } from './client';
import type { LoginPayload, RegisterUserPayload, ForgotPasswordPayload, PasswordResetPayload } from '@appTypes/auth';
import type { APIResponse } from '@appTypes/response';

export async function login(username: string, password: string, remember_me: boolean): Promise<Response> {
  const payload: LoginPayload = {
    type: 'session',
    username,
    password,
    remember_me
  };
  const response: Response = await publicClient.post('/auth/login', {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  return response;
}

export async function register(
  username: string,
  email: string,
  password: string,
  confirmPassword: string,
  firstName?: string,
  lastName?: string,
): Promise<APIResponse<{ message: string; }>> {
  let payload: RegisterUserPayload = {
    username,
    email,
    password,
    confirm_password: confirmPassword
  };

  if (firstName != null && firstName.length > 0) payload = { ...payload, first_name: firstName };
  if (lastName != null && lastName.length > 0) payload = { ...payload, last_name: lastName };

  const response: Response = await publicClient.post('/auth/register', {
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  return await response.json() as APIResponse<{ message: string; }>;
}

export async function forgotPasswordStart(email: string): Promise<APIResponse<{ message: string; }>> {
  const payload: ForgotPasswordPayload = { email };
  const response: Response = await publicClient.post('/auth/forgot_password/token', {
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  return await response.json() as APIResponse<{ message: string; }>;
}

export async function forgotPasswordReset(otp: string, password: string, confirmPassword: string): Promise<APIResponse<{ message: string; }>> {
  const payload: PasswordResetPayload = {
    otp,
    password,
    confirm_password: confirmPassword
  };
  const response: Response = await publicClient.post('/auth/forgot_password', {
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  return await response.json() as APIResponse<{ message: string; }>;
}
