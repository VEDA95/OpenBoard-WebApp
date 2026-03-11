import { createFileRoute, Outlet, Link, redirect } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { getRequestHeader } from '@tanstack/react-start/server';
import { IconDashboard } from '@tabler/icons-react';
import { SidebarMenuItem, SidebarMenuButton } from '@components/ui/sidebar';
import { DashBoardLayout } from '@layouts/dashboard';
import { ErrorBoundary } from '@components/ui/error-boundary';
import { WorkspaceSelector } from '@components/workspace/WorkspaceSelector';
import { CreateWorkspaceDialog } from '@components/workspace/CreateWorkspaceDialog';
import { CreateBoardDialog } from '@components/board/CreateBoardDialog';
import { useWebSocketConnection } from '@/hooks/useWebSocket';
import type { ReactElement, FC } from 'react';

const checkAuth = createServerFn({ method: 'GET' }).handler(async () => {
  const cookieHeader = getRequestHeader('Cookie');
  if (!cookieHeader || !cookieHeader.includes('open_board_session')) {
    throw redirect({ to: '/auth/login' });
  }
});

export const Route = createFileRoute('/dashboard')({
  beforeLoad: async () => await checkAuth(),
  component: AppLayout
});

function AppLayout(): ReactElement<FC> {
  useWebSocketConnection();

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
