import { createFileRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { IconArrowLeft, IconLock, IconWorld } from '@tabler/icons-react';
import { Link } from '@tanstack/react-router';
import { Button } from '@components/ui/button';
import { BoardList } from '@components/board/BoardList';
import { getWorkspace } from '@lib/fetch/workspaces';
import { QueryKeys } from '@lib/queries/queryKeys';
import { transformWorkspace } from '@appTypes/board';

export const Route = createFileRoute('/dashboard/workspaces/$workspaceId/')({
  component: WorkspacePage,
});

function WorkspacePage() {
  const { workspaceId } = Route.useParams();

  const { data: workspace, isLoading, error } = useQuery({
    queryKey: QueryKeys.workspaces.detail(workspaceId),
    queryFn: async () => {
      const response = await getWorkspace(workspaceId);
      if (response.status !== 200) {
        throw new Error(response.message || 'Failed to fetch workspace');
      }
      return response.data ? transformWorkspace(response.data) : null;
    },
  });

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 w-48 bg-muted rounded mb-4" />
          <div className="h-4 w-96 bg-muted rounded" />
        </div>
      </div>
    );
  }

  if (error || !workspace) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Failed to load workspace</p>
          {error && <p className="text-sm text-destructive">{error.message}</p>}
          <Button asChild className="mt-4">
            <Link to="/dashboard">Back to Dashboard</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link to="/dashboard">
            <IconArrowLeft className="size-4 mr-2" />
            Back to Workspaces
          </Link>
        </Button>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">{workspace.name}</h1>
          {workspace.isPublic ? (
            <IconWorld className="size-5 text-muted-foreground" title="Public" />
          ) : (
            <IconLock className="size-5 text-muted-foreground" title="Private" />
          )}
        </div>
        {workspace.description && (
          <p className="text-muted-foreground mt-2">{workspace.description}</p>
        )}
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">Boards</h2>
        <BoardList workspaceId={workspaceId} />
      </div>
    </div>
  );
}
