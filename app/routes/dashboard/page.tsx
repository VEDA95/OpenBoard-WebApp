import {createFileRoute} from '@tanstack/react-router';
import { SectionCards } from '@/components/section-cards';
import { ChartAreaInteractive } from '@/components/chart-area-interactive';
import { DataTable } from '@/components/data-table';
import data from '@/routes/data.json';
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
    component: DashboardPage,
});