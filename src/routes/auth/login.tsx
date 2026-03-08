import { createFileRoute } from '@tanstack/react-router';
import { LoginForm } from '@components/login-form';
import { useAuthPageContext } from '@components/auth';
import type { ReactElement, FC } from 'react';
import type { AuthPageContextType } from '@appTypes/auth';

export const Route = createFileRoute('/auth/login')({ component: LoginPage });

function LoginPage(): ReactElement<FC> {
  const context: AuthPageContextType = useAuthPageContext();

  return (
    <LoginForm
      showRegisterLink={context.authSettings.allowPublicRegistration}
      oauthProviders={context.oauthProviders}
    />
  );
}
