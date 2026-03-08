import { createFileRoute } from '@tanstack/react-router';
import { WorkspaceList } from '@components/workspace/WorkspaceList';
import type { ReactElement, FC } from 'react';

export const Route = createFileRoute('/dashboard/')({
  component: DashboardPage
});

function DashboardPage(): ReactElement<FC> {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Workspaces</h1>
        <p className="text-muted-foreground mt-1">
          Select a workspace to view its boards
        </p>
      </div>
      <WorkspaceList />
    </div>
  );
}
