import { useMemo, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  horizontalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { Link } from '@tanstack/react-router';
import { IconArrowLeft, IconPlus } from '@tabler/icons-react';
import { Button } from '@components/ui/button';
import { ScrollArea, ScrollBar } from '@components/ui/scroll-area';
import { Skeleton } from '@components/ui/skeleton';
import { KanbanList } from './KanbanList';
import { KanbanCard } from './KanbanCard';
import { CreateListForm } from './CreateListForm';
import { CardDetailModal } from './CardDetailModal';
import { ConnectionStatus } from '@components/ui/connection-status';
import { useBoardSubscription } from '@/hooks/useWebSocket';
import { getBoard } from '@lib/fetch/boards';
import { getListsByBoard } from '@lib/fetch/lists';
import { moveCard, updateCard } from '@lib/fetch/cards';
import { updateList } from '@lib/fetch/lists';
import { QueryKeys } from '@lib/queries/queryKeys';
import { useKanbanStore } from '@lib/stores/kanban-store';
import { transformBoard, transformList, type List, type Card } from '@appTypes/board';

interface BoardViewProps {
  boardId: string;
  workspaceId: string;
}

export function BoardView({ boardId, workspaceId }: BoardViewProps) {
  const queryClient = useQueryClient();
  const {
    drag,
    setActiveCard,
    setActiveList,
    setOverListId,
    resetDragState,
    modal,
    openCreateList,
    closeCreateList,
  } = useKanbanStore();

  // Subscribe to board WebSocket events
  useBoardSubscription(boardId);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor)
  );

  const { data: board, isLoading: boardLoading } = useQuery({
    queryKey: QueryKeys.boards.detail(boardId),
    queryFn: async () => {
      const response = await getBoard(boardId);
      if (response.status !== 200) {
        throw new Error(response.message || 'Failed to fetch board');
      }
      return response.data ? transformBoard(response.data) : null;
    },
  });

  const { data: lists, isLoading: listsLoading } = useQuery({
    queryKey: QueryKeys.lists.byBoard(boardId),
    queryFn: async () => {
      const response = await getListsByBoard(boardId);
      if (response.status !== 200) {
        throw new Error(response.message || 'Failed to fetch lists');
      }
      return response.data?.map(transformList).sort((a, b) => a.position - b.position) ?? [];
    },
  });

  const moveCardMutation = useMutation({
    mutationFn: async ({
      cardId,
      listId,
      position,
    }: {
      cardId: string;
      listId: string;
      position: number;
    }) => {
      const response = await moveCard(cardId, { list_id: listId, position });
      if (response.status !== 200) {
        throw new Error(response.message || 'Failed to move card');
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.lists.byBoard(boardId) });
    },
  });

  const reorderListMutation = useMutation({
    mutationFn: async ({ listId, position }: { listId: string; position: number }) => {
      const response = await updateList(listId, { position });
      if (response.status !== 200) {
        throw new Error(response.message || 'Failed to reorder list');
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.lists.byBoard(boardId) });
    },
  });

  const listIds = useMemo(() => lists?.map((list) => list.id) ?? [], [lists]);

  const findListByCardId = useCallback(
    (cardId: string): List | undefined => {
      return lists?.find((list) => list.cards?.some((card) => card.id === cardId));
    },
    [lists]
  );

  const findCardById = useCallback(
    (cardId: string): Card | undefined => {
      for (const list of lists ?? []) {
        const card = list.cards?.find((c) => c.id === cardId);
        if (card) return card;
      }
      return undefined;
    },
    [lists]
  );

  function handleDragStart(event: DragStartEvent) {
    const { active } = event;
    const activeId = active.id as string;

    // Check if dragging a card or a list
    if (active.data.current?.type === 'card') {
      const card = findCardById(activeId);
      if (card) {
        setActiveCard(card);
      }
    } else if (active.data.current?.type === 'list') {
      const list = lists?.find((l) => l.id === activeId);
      if (list) {
        setActiveList(list);
      }
    }
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (active.data.current?.type === 'card') {
      // Find which list the card is being dragged over
      let targetListId: string | null = null;

      if (over.data.current?.type === 'list') {
        targetListId = overId;
      } else if (over.data.current?.type === 'card') {
        const overList = findListByCardId(overId);
        targetListId = overList?.id ?? null;
      }

      setOverListId(targetListId);
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    resetDragState();

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (active.data.current?.type === 'list') {
      // Reordering lists
      if (activeId !== overId && lists) {
        const oldIndex = lists.findIndex((l) => l.id === activeId);
        const newIndex = lists.findIndex((l) => l.id === overId);

        if (oldIndex !== -1 && newIndex !== -1) {
          // Optimistic update
          const newLists = arrayMove(lists, oldIndex, newIndex);
          queryClient.setQueryData(QueryKeys.lists.byBoard(boardId), newLists);

          reorderListMutation.mutate({
            listId: activeId,
            position: newIndex,
          });
        }
      }
    } else if (active.data.current?.type === 'card') {
      // Moving cards
      let targetListId: string | null = null;
      let targetPosition = 0;

      if (over.data.current?.type === 'list') {
        targetListId = overId;
        const targetList = lists?.find((l) => l.id === overId);
        targetPosition = targetList?.cards?.length ?? 0;
      } else if (over.data.current?.type === 'card') {
        const overList = findListByCardId(overId);
        targetListId = overList?.id ?? null;

        if (overList?.cards) {
          const overIndex = overList.cards.findIndex((c) => c.id === overId);
          targetPosition = overIndex >= 0 ? overIndex : overList.cards.length;
        }
      }

      if (targetListId) {
        moveCardMutation.mutate({
          cardId: activeId,
          listId: targetListId,
          position: targetPosition,
        });
      }
    }
  }

  if (boardLoading || listsLoading) {
    return (
      <div className="p-6">
        <Skeleton className="h-8 w-48 mb-4" />
        <div className="flex gap-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-96 w-72 flex-shrink-0" />
          ))}
        </div>
      </div>
    );
  }

  if (!board) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Board not found</p>
          <Button asChild className="mt-4">
            <Link to="/dashboard/workspaces/$workspaceId" params={{ workspaceId }}>
              Back to Workspace
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b flex-shrink-0">
        <div className="flex items-center justify-between mb-2">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/dashboard/workspaces/$workspaceId" params={{ workspaceId }}>
              <IconArrowLeft className="size-4 mr-2" />
              Back to Boards
            </Link>
          </Button>
          <ConnectionStatus />
        </div>
        <h1 className="text-xl font-bold">{board.name}</h1>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 h-full">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
          >
            <div className="flex gap-4 items-start h-full">
              <SortableContext items={listIds} strategy={horizontalListSortingStrategy}>
                {lists?.map((list) => (
                  <KanbanList
                    key={list.id}
                    list={list}
                    boardId={boardId}
                    isOver={drag.overListId === list.id}
                  />
                ))}
              </SortableContext>

              {modal.createListOpen ? (
                <CreateListForm boardId={boardId} onCancel={closeCreateList} />
              ) : (
                <Button
                  variant="outline"
                  className="w-72 flex-shrink-0 h-auto py-3 justify-start"
                  onClick={openCreateList}
                >
                  <IconPlus className="size-4 mr-2" />
                  Add List
                </Button>
              )}
            </div>

            <DragOverlay>
              {drag.activeCard && (
                <KanbanCard card={drag.activeCard} isDragging />
              )}
              {drag.activeList && (
                <KanbanList
                  list={drag.activeList}
                  boardId={boardId}
                  isDragging
                />
              )}
            </DragOverlay>
          </DndContext>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      <CardDetailModal boardId={boardId} />
    </div>
  );
}
