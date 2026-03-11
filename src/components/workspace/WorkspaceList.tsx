import { Link } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { IconFolder, IconPlus, IconLock, IconWorld } from '@tabler/icons-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@components/ui/card';
import { Button } from '@components/ui/button';
import { Skeleton } from '@components/ui/skeleton';
import { getWorkspaces } from '@lib/fetch/workspaces';
import { QueryKeys } from '@lib/queries/queryKeys';
import { useModalState } from '@lib/state/modal';
import { transformWorkspace } from '@appTypes/board';

export function WorkspaceList() {
  const { openCreateWorkspace } = useModalState();

  const { data, isLoading, error } = useQuery({
    queryKey: QueryKeys.workspaces.list(),
    queryFn: async () => {
      const response = await getWorkspaces();
      if (response.code !== 200) {
        throw new Error(response.message || 'Failed to fetch workspaces');
      }
      return response.data?.map(transformWorkspace) ?? [];
    },
  });

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2 mt-2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Failed to load workspaces</p>
        <p className="text-sm text-destructive">{error.message}</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <IconFolder className="size-16 text-muted-foreground/50 mb-4" />
        <h3 className="text-lg font-medium mb-2">No workspaces yet</h3>
        <p className="text-muted-foreground mb-4">
          Create your first workspace to get started
        </p>
        <Button onClick={openCreateWorkspace}>
          <IconPlus className="size-4 mr-2" />
          Create Workspace
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {data.map((workspace) => (
        <Link
          key={workspace.id}
          to="/dashboard/workspaces/$workspaceId"
          params={{ workspaceId: workspace.id }}
          className="block"
        >
          <Card className="h-full transition-colors hover:bg-accent/50 cursor-pointer">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <IconFolder className="size-5 text-primary" />
                  <CardTitle className="text-lg">{workspace.name}</CardTitle>
                </div>
                {workspace.isPublic ? (
                  <IconWorld className="size-4 text-muted-foreground" title="Public" />
                ) : (
                  <IconLock className="size-4 text-muted-foreground" title="Private" />
                )}
              </div>
              {workspace.description && (
                <CardDescription className="line-clamp-2">
                  {workspace.description}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {workspace.boards?.length ?? 0} board{(workspace.boards?.length ?? 0) !== 1 ? 's' : ''}
              </p>
            </CardContent>
          </Card>
        </Link>
      ))}
      <Card
        className="h-full border-dashed cursor-pointer transition-colors hover:bg-accent/50 flex items-center justify-center min-h-[160px]"
        onClick={openCreateWorkspace}
      >
        <div className="flex flex-col items-center text-muted-foreground">
          <IconPlus className="size-8 mb-2" />
          <span>New Workspace</span>
        </div>
      </Card>
    </div>
  );
}
