import { createFileRoute } from '@tanstack/react-router';
import type { ReactElement, FC } from 'react';

function Home(): ReactElement<FC> {
    return (
        <p className="text-red-900">Hello World!!!</p>
    );
}

export const Route = createFileRoute('/')({
    component: Home,
})
