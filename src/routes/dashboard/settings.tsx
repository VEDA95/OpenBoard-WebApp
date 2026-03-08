import { createFileRoute } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { getRequestHeader } from '@tanstack/react-start/server';
import { getEnabledProviders } from '@lib/fetch/oauth';
import { parseOAuthProviders } from '@lib/utils/parse';
import { AccountLinking } from '@components/settings/AccountLinking';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { ReactElement, FC } from 'react';
import type { OAuthProvider } from '@appTypes/oauth';

type SettingsLoaderData = {
  oauthProviders: OAuthProvider[];
};

const fetchSettingsData = createServerFn({ method: 'GET' }).handler(async (): Promise<SettingsLoaderData> => {
  const cookieHeader: string | undefined = getRequestHeader('Cookie');
  const requestHeaders = new Headers();
  requestHeaders.append('Cookie', cookieHeader || '');

  const oauthProvidersResponse = await getEnabledProviders(requestHeaders);
  const oauthProviders = oauthProvidersResponse.data
    ? parseOAuthProviders(oauthProvidersResponse.data)
    : [];

  return { oauthProviders };
});

export const Route = createFileRoute('/dashboard/settings')({
  component: SettingsPage,
  loader: async (): Promise<SettingsLoaderData> => await fetchSettingsData()
});

function SettingsPage(): ReactElement<FC> {
  const { oauthProviders } = Route.useLoaderData();

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Linked Accounts</CardTitle>
          <CardDescription>
            Connect your account with external providers for easy sign-in.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AccountLinking providers={oauthProviders} />
        </CardContent>
      </Card>
    </div>
  );
}
