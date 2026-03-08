import { createFileRoute } from '@tanstack/react-router';
import { BoardView } from '@components/kanban/BoardView';

export const Route = createFileRoute('/dashboard/workspaces/$workspaceId/boards/$boardId/')({
  component: BoardPage,
});

function BoardPage() {
  const { boardId, workspaceId } = Route.useParams();

  return <BoardView boardId={boardId} workspaceId={workspaceId} />;
}
