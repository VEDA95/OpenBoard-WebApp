import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { initiateOAuthFlow } from '@lib/fetch/oauth';
import type { ReactElement, FC } from 'react';
import type { OAuthProvider } from '@appTypes/oauth';

export interface AccountLinkingProps {
  providers: OAuthProvider[];
}

export function AccountLinking({ providers }: AccountLinkingProps): ReactElement<FC> {
  const [linking, setLinking] = useState<string | null>(null);

  const handleLinkAccount = (providerId: string): void => {
    setLinking(providerId);
    // Store provider ID and indicate this is a linking operation (not login)
    localStorage.setItem('oauth_provider_id', providerId);
    localStorage.setItem('oauth_operation', 'link');
    const callbackUrl = `${window.location.origin}/auth/oauth/callback`;
    initiateOAuthFlow(providerId, callbackUrl);
  };

  if (providers.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">
        No external authentication providers are currently enabled.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {providers.map((provider) => (
        <div key={provider.id} className="flex items-center justify-between py-2">
          <div>
            <p className="font-medium">{provider.name}</p>
            <p className="text-muted-foreground text-sm">Not connected</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleLinkAccount(provider.id)}
            disabled={linking === provider.id}
          >
            {linking === provider.id ? 'Connecting...' : 'Connect'}
          </Button>
        </div>
      ))}
    </div>
  );
}
