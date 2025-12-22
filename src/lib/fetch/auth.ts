import type { APIResponse } from '@appTypes/response';
import type { LoginPayload, LoggedInResponse } from '@appTypes/auth';

export async function login(username: string, password: string, remember_me: boolean): Promise<Response> {
  const paylaod: LoginPayload = {
    type: 'session',
    username,
    password,
    remember_me
  };
  const response: Response = await fetch('http://localhost:8080/auth/login', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(paylaod)
  });

  return response;
}
