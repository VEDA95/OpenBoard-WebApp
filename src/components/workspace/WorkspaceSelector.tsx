import { Link, useParams } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { IconFolder, IconChevronRight, IconPlus } from '@tabler/icons-react';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from '@components/ui/sidebar';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@components/ui/collapsible';
import { Skeleton } from '@components/ui/skeleton';
import { getWorkspaces } from '@lib/fetch/workspaces';
import { QueryKeys } from '@lib/queries/queryKeys';
import { useModalState } from '@lib/state/modal';
import { transformWorkspace } from '@appTypes/board';

export function WorkspaceSelector() {
  const { openCreateWorkspace } = useModalState();
  const params = useParams({ strict: false });
  const currentWorkspaceId = 'workspaceId' in params ? params.workspaceId : undefined;

  const { data: workspaces, isLoading } = useQuery({
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
      <SidebarGroup>
        <SidebarGroupLabel>Workspaces</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {[...Array(3)].map((_, i) => (
              <SidebarMenuItem key={i}>
                <Skeleton className="h-8 w-full" />
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    );
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Workspaces</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {workspaces?.map((workspace) => (
            <Collapsible
              key={workspace.id}
              defaultOpen={workspace.id === currentWorkspaceId}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    isActive={workspace.id === currentWorkspaceId}
                    tooltip={workspace.name}
                  >
                    <IconFolder className="size-4" />
                    <span className="truncate">{workspace.name}</span>
                    <IconChevronRight className="ml-auto size-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {workspace.boards?.map((board) => (
                      <SidebarMenuSubItem key={board.id}>
                        <SidebarMenuSubButton asChild>
                          <Link
                            to="/dashboard/workspaces/$workspaceId/boards/$boardId"
                            params={{ workspaceId: workspace.id, boardId: board.id }}
                          >
                            <span className="truncate">{board.name}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild>
                        <Link
                          to="/dashboard/workspaces/$workspaceId"
                          params={{ workspaceId: workspace.id }}
                        >
                          <span className="text-muted-foreground">View all boards</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          ))}
          <SidebarMenuItem>
            <SidebarMenuButton onClick={openCreateWorkspace}>
              <IconPlus className="size-4" />
              <span>New Workspace</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
