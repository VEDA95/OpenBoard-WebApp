import { createFileRoute, Outlet } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { getRequestHeader } from '@tanstack/react-start/server';
import { AuthLayout } from '@layouts/auth';
import { AuthPageProvider } from '@components/auth';
import { GETAuthSettings } from '@lib/fetch/settings';
import { getEnabledProviders } from '@lib/fetch/oauth';
import { parseAuthSettings, parsePublicAuthSettings, parseOAuthProviders } from '@lib/utils/parse';
import type { ReactElement, FC } from 'react';
import type { APIResponse, APICollectionResponse } from '@appTypes/response';
import type { AuthSettings, PublicAuthSettings, AuthSettingsResponse, PublicAuthSettingsResponse } from '@appTypes/settings';
import type { OAuthProvider, OAuthProviderResponse } from '@appTypes/oauth';

type AuthPageLoaderData = {
  authSettings: AuthSettings | PublicAuthSettings;
  oauthProviders: OAuthProvider[];
};

const fetchAuthSettingsFunc = createServerFn({ method: 'GET' }).handler(async (): Promise<AuthPageLoaderData> => {
  const cookieHeader: string | undefined = getRequestHeader('Cookie');
  const isPublic: boolean = cookieHeader == null || !cookieHeader.includes('open_board_session');
  const requestHeaders = new Headers();

  requestHeaders.append('Cookie', cookieHeader || '');

  const [authSettingsResponse, oauthProvidersResponse] = await Promise.all([
    GETAuthSettings(
      cookieHeader == null || !cookieHeader.includes('open_board_session'),
      requestHeaders
    ),
    getEnabledProviders(requestHeaders)
  ]);

  const authSettings = isPublic
    ? parsePublicAuthSettings((authSettingsResponse as APIResponse<PublicAuthSettingsResponse>).data as PublicAuthSettingsResponse)
    : parseAuthSettings((authSettingsResponse as APIResponse<AuthSettingsResponse>).data as AuthSettingsResponse);

  const oauthProviders = oauthProvidersResponse.data
    ? parseOAuthProviders(oauthProvidersResponse.data)
    : [];

  return { authSettings, oauthProviders };
});

export const Route = createFileRoute('/auth')({
  component: AuthPageLayout,
  loader: async (): Promise<AuthPageLoaderData> => await fetchAuthSettingsFunc()
});

function AuthPageLayout(): ReactElement<FC> {
  const { authSettings, oauthProviders } = Route.useLoaderData();

  return (
    <AuthPageProvider context={{ authSettings, oauthProviders }}>
      <AuthLayout>
        <Outlet />
      </AuthLayout>
    </AuthPageProvider>
  );
}
