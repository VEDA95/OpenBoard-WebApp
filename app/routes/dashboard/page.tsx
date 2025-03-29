import {createFileRoute} from '@tanstack/react-router';
import { authMiddleware } from '@/lib/auth';
import { SectionCards } from '@/components/section-cards';
import { ChartAreaInteractive } from '@/components/chart-area-interactive';
import { DataTable } from '@/components/data-table';
import data from '@/dashboard/data.json';
import type { ReactElement, FC } from 'react';

function DashboardPage(): ReactElement<FC> {
    return (
        <>
            <SectionCards />
            <div className="px-4 lg:px-6">
                <ChartAreaInteractive />
            </div>
            <DataTable data={data} />
        </>
    );
}

export const Route = createFileRoute('/dashboard/page')({
    beforeLoad: authMiddleware,
    loader: ({context: {user}}) => user,
    component: DashboardPage,
});