import { publicClient, API_BASE } from './client';
import type { APICollectionResponse } from '@appTypes/response';
import type { OAuthProviderResponse } from '@appTypes/oauth';

export async function getEnabledProviders(headers?: Headers): Promise<APICollectionResponse<OAuthProviderResponse>> {
  const response: Response = await publicClient.get('/auth/oauth/providers/enabled', {
    credentials: 'include',
    headers: headers
  });

  return await response.json() as APICollectionResponse<OAuthProviderResponse>;
}

export function getOAuthAuthorizeUrl(providerId: string, redirectUrl: string): string {
  const encodedRedirectUrl = encodeURIComponent(redirectUrl);
  return `${API_BASE}/auth/oauth/authorize/${providerId}?redirect_url=${encodedRedirectUrl}`;
}

export function initiateOAuthFlow(providerId: string, redirectUrl: string): void {
  window.location.href = getOAuthAuthorizeUrl(providerId, redirectUrl);
}

export type OAuthTokenExchangePayload = {
  code: string;
  state: string;
  redirect_url: string;
  type: 'token' | 'session';
};

export async function exchangeOAuthCode(
  providerId: string,
  payload: OAuthTokenExchangePayload
): Promise<Response> {
  const response: Response = await publicClient.post(`/auth/oauth/callback/${providerId}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  return response;
}
