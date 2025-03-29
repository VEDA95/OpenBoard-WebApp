import {createFileRoute, Outlet, redirect} from '@tanstack/react-router';
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import type { ReactElement, FC } from 'react';

function DashboardPage(): ReactElement<FC> {
    return (
        <SidebarProvider className="fixed top-0 inset-0">
            <AppSidebar variant="inset" />
            <SidebarInset className="overflow-y-scroll">
                <SiteHeader />
                <div className="flex flex-1 flex-col">
                    <div className="@container/main flex flex-1 flex-col gap-2">
                        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                            <Outlet />
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}

export const Route = createFileRoute('/dashboard')({
    component: DashboardPage,
    beforeLoad: async ({location: {pathname}}): Promise<void> => {
        if (pathname === '/dashboard') throw redirect({to: '/dashboard/page'});
    }
});