import { createFileRoute } from '@tanstack/react-router';
import type { ReactElement, FC } from 'react';

export const Route = createFileRoute('/dashboard/')({
  component: DashabordPage
});

function DashabordPage(): ReactElement<FC> {
  return <p>Hello world!</p>;
}
