import { createFileRoute, Outlet } from '@tanstack/react-router';
import { IconChartBar, IconDashboard, IconFolder, IconListDetails, IconUsers } from '@tabler/icons-react';
import { SidebarMenuItem, SidebarMenuButton } from '@components/ui/sidebar';
import { DashBoardLayout } from '@layouts/dashboard';
import type { ReactElement, FC } from 'react';

export const Route = createFileRoute('/dashboard')({
  component: AppLayout
});

function AppLayout(): ReactElement<FC> {
  return (
    <DashBoardLayout>
      <DashBoardLayout.Sidebar>
        <SidebarMenuItem>
          <SidebarMenuButton>
            <IconDashboard />
            <span>Dashboard</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton>
            <IconListDetails />
            <span>Lifecycle</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton>
            <IconChartBar />
            <span>Analytics</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton>
            <IconFolder />
            <span>Projects</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton>
            <IconUsers />
            <span>Teams</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </DashBoardLayout.Sidebar>
      <DashBoardLayout.Window>
        <Outlet />
      </DashBoardLayout.Window>
    </DashBoardLayout>
  );
}
