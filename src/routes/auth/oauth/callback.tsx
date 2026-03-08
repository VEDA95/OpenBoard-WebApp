import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { exchangeOAuthCode } from '@lib/fetch/oauth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { ReactElement, FC } from 'react';

type OAuthCallbackSearch = {
  code?: string;
  state?: string;
  error?: string;
  error_description?: string;
};

export const Route = createFileRoute('/auth/oauth/callback')({
  component: OAuthCallbackPage,
  validateSearch: (search: Record<string, unknown>): OAuthCallbackSearch => {
    return {
      code: typeof search.code === 'string' ? search.code : undefined,
      state: typeof search.state === 'string' ? search.state : undefined,
      error: typeof search.error === 'string' ? search.error : undefined,
      error_description: typeof search.error_description === 'string' ? search.error_description : undefined,
    };
  },
});

function OAuthCallbackPage(): ReactElement<FC> {
  const navigate = useNavigate();
  const { code, state, error, error_description } = Route.useSearch();
  const [status, setStatus] = useState<'loading' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    async function handleCallback(): Promise<void> {
      // Check for OAuth error from provider
      if (error) {
        setStatus('error');
        setErrorMessage(error_description || error || 'OAuth authentication failed');
        return;
      }

      // Validate required params
      if (!code || !state) {
        setStatus('error');
        setErrorMessage('Missing authorization code or state parameter');
        return;
      }

      // Get provider ID and operation type from localStorage (stored before redirect)
      const providerId = localStorage.getItem('oauth_provider_id');
      const operation = localStorage.getItem('oauth_operation') || 'login';

      if (!providerId) {
        setStatus('error');
        setErrorMessage('OAuth session expired. Please try again.');
        return;
      }

      // Clear stored data
      localStorage.removeItem('oauth_provider_id');
      localStorage.removeItem('oauth_operation');

      try {
        const response = await exchangeOAuthCode(providerId, {
          code,
          state,
          redirect_url: `${window.location.origin}/auth/oauth/callback`,
          type: 'session'
        });

        if (response.status === 201) {
          // Session cookies are set, redirect based on operation
          if (operation === 'link') {
            await navigate({ to: '/dashboard/settings' });
          } else {
            await navigate({ to: '/dashboard' });
          }
        } else {
          const data = await response.json();
          setStatus('error');
          setErrorMessage(data.data?.message || 'Authentication failed');
        }
      } catch (err) {
        setStatus('error');
        setErrorMessage('Failed to complete authentication. Please try again.');
      }
    }

    handleCallback();
  }, [code, state, error, error_description, navigate]);

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">
            {status === 'loading' ? 'Authenticating...' : 'Authentication Failed'}
          </CardTitle>
          <CardDescription>
            {status === 'loading'
              ? 'Please wait while we complete your sign in.'
              : errorMessage
            }
          </CardDescription>
        </CardHeader>
        {status === 'error' && (
          <CardContent className="text-center">
            <a href="/auth/login" className="text-sm underline-offset-4 hover:underline">
              Return to login
            </a>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
