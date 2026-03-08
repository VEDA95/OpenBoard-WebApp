import { useEffect } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { RegistrationForm } from '@components/register-form';
import { useAuthPageContext } from '@components/auth';
import type { ReactElement, FC } from 'react';
import type { AuthPageContextType } from '@appTypes/auth';

export const Route = createFileRoute('/auth/register')({
  component: RouteComponent
});

function RouteComponent(): ReactElement<FC> {
  const navigate = useNavigate();
  const authContext: AuthPageContextType = useAuthPageContext();

  useEffect((): void => {
    if (!authContext.authSettings.allowPublicRegistration) (async (): Promise<void> => await navigate({ to: '/auth/login' }))();
  }, []);

  return <RegistrationForm />;
}
