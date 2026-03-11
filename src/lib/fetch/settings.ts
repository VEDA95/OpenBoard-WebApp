import { API_BASE } from './client';
import type { APIResponse } from '@appTypes/response';
import type {
  GeneralSettingsResponse,
  AuthSettingsResponse,
  EmailSettingsResponse,
  PublicGeneralSettingsResponse,
  PublicAuthSettingsResponse,
  PublicEmailSettingsResponse
} from '@appTypes/settings';

export async function GETGeneralSettings(publicSettings: boolean = false, headers?: Headers): Promise<APIResponse<GeneralSettingsResponse> | APIResponse<PublicGeneralSettingsResponse>> {
  let url: string = `${API_BASE}/api/settings/general`;

  if (publicSettings) url += '/public';

  const response: Response = await fetch(url, {
    method: 'GET',
    credentials: 'include',
    headers: headers
  });

  return await response.json() as APIResponse<GeneralSettingsResponse> | APIResponse<PublicGeneralSettingsResponse>;
}

export async function GETAuthSettings(publicSettings: boolean = false, headers?: Headers): Promise<APIResponse<AuthSettingsResponse> | APIResponse<PublicAuthSettingsResponse>> {
  let url: string = `${API_BASE}/api/settings/auth`;

  if (publicSettings) url += '/public';

  const response: Response = await fetch(url, {
    method: 'GET',
    credentials: 'include',
    headers: headers
  });

  return await response.json() as APIResponse<AuthSettingsResponse> | APIResponse<PublicAuthSettingsResponse>;
}

export async function GETEmailSettings(publicSettings: boolean = false, headers?: Headers): Promise<APIResponse<EmailSettingsResponse> | APIResponse<PublicEmailSettingsResponse>> {
  let url: string = `${API_BASE}/api/settings/email`;

  if (publicSettings) url += '/public';

  const response: Response = await fetch(url, {
    method: 'GET',
    credentials: 'include',
    headers: headers
  });

  return await response.json() as APIResponse<EmailSettingsResponse> | APIResponse<PublicEmailSettingsResponse>;
}
