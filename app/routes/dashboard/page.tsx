import {createFileRoute} from '@tanstack/react-router';
import type { ReactElement, FC } from 'react';

function DashboardPage(): ReactElement<FC> {
    return (
        <div>
            <p>Hello world...</p>
        </div>
    );
}

export const Route = createFileRoute('/dashboard/page')({
    component: DashboardPage,
});