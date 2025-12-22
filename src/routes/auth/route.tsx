import { createFileRoute, Outlet } from '@tanstack/react-router';
import { AuthLayout } from '@layouts/auth';
import type { ReactElement, FC } from 'react';

export const Route = createFileRoute('/auth')({
  component: AuthPageLayout,
});

function AuthPageLayout(): ReactElement<FC> {
  return (
    <AuthLayout>
      <Outlet />
    </AuthLayout>
  );
}
