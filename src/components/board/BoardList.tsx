import { Link } from '@tanstack/react-router';
import { IconLayoutKanban, IconPlus, IconLock, IconWorld } from '@tabler/icons-react';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card';
import { Button } from '@components/ui/button';
import { useModalState } from '@lib/state/modal';
import type { Board } from '@appTypes/board';

interface BoardListProps {
  workspaceId: string;
  boards: Board[];
}

export function BoardList({ workspaceId, boards }: BoardListProps) {
  const { openCreateBoard } = useModalState();

  if (boards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <IconLayoutKanban className="size-16 text-muted-foreground/50 mb-4" />
        <h3 className="text-lg font-medium mb-2">No boards yet</h3>
        <p className="text-muted-foreground mb-4">
          Create your first board to start organizing tasks
        </p>
        <Button onClick={() => openCreateBoard(workspaceId)}>
          <IconPlus className="size-4 mr-2" />
          Create Board
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {boards.map((board) => (
        <Link
          key={board.id}
          to="/dashboard/workspaces/$workspaceId/boards/$boardId"
          params={{ workspaceId, boardId: board.id }}
          className="block"
        >
          <Card className="h-full transition-colors hover:bg-accent/50 cursor-pointer">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <IconLayoutKanban className="size-5 text-primary" />
                  <CardTitle className="text-base">{board.name}</CardTitle>
                </div>
                {board.isPublic ? (
                  <IconWorld className="size-4 text-muted-foreground" title="Public" />
                ) : (
                  <IconLock className="size-4 text-muted-foreground" title="Private" />
                )}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {board.lists?.length ?? 0} list{(board.lists?.length ?? 0) !== 1 ? 's' : ''}
              </p>
            </CardContent>
          </Card>
        </Link>
      ))}
      <Card
        className="h-full border-dashed cursor-pointer transition-colors hover:bg-accent/50 flex items-center justify-center min-h-[120px]"
        onClick={() => openCreateBoard(workspaceId)}
      >
        <div className="flex flex-col items-center text-muted-foreground">
          <IconPlus className="size-8 mb-2" />
          <span>New Board</span>
        </div>
      </Card>
    </div>
  );
}
