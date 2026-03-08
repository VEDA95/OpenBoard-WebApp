import type { APICollectionResponse, APIResponse } from '@appTypes/response';
import type { OAuthProviderResponse } from '@appTypes/oauth';
import type { LoggedInResponse } from '@appTypes/auth';

const API_BASE_URL = 'http://localhost:8080';

export async function getEnabledProviders(headers?: Headers): Promise<APICollectionResponse<OAuthProviderResponse>> {
  const response: Response = await fetch(`${API_BASE_URL}/auth/oauth/providers/enabled`, {
    method: 'GET',
    credentials: 'include',
    headers: headers
  });

  return await response.json() as APICollectionResponse<OAuthProviderResponse>;
}

export function getOAuthAuthorizeUrl(providerId: string, redirectUrl: string): string {
  const encodedRedirectUrl = encodeURIComponent(redirectUrl);
  return `${API_BASE_URL}/auth/oauth/authorize/${providerId}?redirect_url=${encodedRedirectUrl}`;
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
  const response: Response = await fetch(`${API_BASE_URL}/auth/oauth/callback/${providerId}`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  return response;
}
