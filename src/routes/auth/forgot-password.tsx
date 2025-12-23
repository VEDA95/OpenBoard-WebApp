import { createFileRoute } from '@tanstack/react-router';
import { GalleryVerticalEnd } from 'lucide-react';
import { ForgotPasswordForm } from '@components/forgot-password-form';
import type { ReactElement, FC } from 'react';

export const Route = createFileRoute('/auth/forgot-password')({
  component: ForgotPasswordPage
});

function ForgotPasswordPage(): ReactElement<FC> {
  return <ForgotPasswordForm />;
}
