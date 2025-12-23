import { createFileRoute } from '@tanstack/react-router';
import { LoginForm } from '@components/login-form';
import type { ReactElement, FC } from 'react';

export const Route = createFileRoute('/auth/login')({ component: LoginPage });

function LoginPage(): ReactElement<FC> {
  return <LoginForm />;
}
