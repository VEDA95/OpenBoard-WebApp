import { createFileRoute, Outlet, Link } from '@tanstack/react-router';
import { IconDashboard } from '@tabler/icons-react';
import { SidebarMenuItem, SidebarMenuButton } from '@components/ui/sidebar';
import { DashBoardLayout } from '@layouts/dashboard';
import { ErrorBoundary } from '@components/ui/error-boundary';
import { WorkspaceSelector } from '@components/workspace/WorkspaceSelector';
import { CreateWorkspaceDialog } from '@components/workspace/CreateWorkspaceDialog';
import { CreateBoardDialog } from '@components/board/CreateBoardDialog';
import type { ReactElement, FC } from 'react';

export const Route = createFileRoute('/dashboard')({
  component: AppLayout
});

function AppLayout(): ReactElement<FC> {
  return (
    <DashBoardLayout>
      <DashBoardLayout.Sidebar>
        <SidebarMenuItem>
          <SidebarMenuButton asChild>
            <Link to="/dashboard">
              <IconDashboard />
              <span>Dashboard</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <WorkspaceSelector />
      </DashBoardLayout.Sidebar>
      <DashBoardLayout.Window>
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </DashBoardLayout.Window>
      <CreateWorkspaceDialog />
      <CreateBoardDialog />
    </DashBoardLayout>
  );
}
