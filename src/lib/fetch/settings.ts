import type { APIResponse } from '@appTypes/response';
import type { GeneralSettingsResponse, AuthSettingsResponse, EmailSettingsResponse } from '@appTypes/settings';

export async function GETGeneralSettings(): Promise<APIResponse<GeneralSettingsResponse>> {
  const response: Response = await fetch('http://localhost:8080/api/settings/general', {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  return await response.json() as APIResponse<GeneralSettingsResponse>;
}

export async function GETAuthSettings(): Promise<APIResponse<AuthSettingsResponse>> {
  const response: Response = await fetch('http://localhost:8080/api/settings/auth', {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  return await response.json() as APIResponse<AuthSettingsResponse>;
}

export async function GETEmailSettings(): Promise<APIResponse<EmailSettingsResponse>> {
  const response: Response = await fetch('http://localhost:8080/api/settings/email', {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  return await response.json() as APIResponse<EmailSettingsResponse>;
}
