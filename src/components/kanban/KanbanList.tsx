import { useMemo, useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { IconGripVertical, IconPlus, IconDotsVertical, IconTrash, IconEdit } from '@tabler/icons-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardContent } from '@components/ui/card';
import { Button } from '@components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@components/ui/dropdown-menu';
import { ScrollArea } from '@components/ui/scroll-area';
import { DeleteConfirmDialog } from '@components/ui/delete-confirm-dialog';
import { KanbanCard } from './KanbanCard';
import { CreateCardForm } from './CreateCardForm';
import { deleteList } from '@lib/fetch/lists';
import { QueryKeys } from '@lib/queries/queryKeys';
import { useKanbanStore } from '@lib/stores/kanban-store';
import type { List } from '@appTypes/board';
import { cn } from '@lib/utils/cn';

interface KanbanListProps {
  list: List;
  boardId: string;
  isDragging?: boolean;
  isOver?: boolean;
}

export function KanbanList({ list, boardId, isDragging, isOver }: KanbanListProps) {
  const queryClient = useQueryClient();
  const { modal, openCreateCard, closeCreateCard } = useKanbanStore();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({
    id: list.id,
    data: {
      type: 'list',
      list,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const cardIds = useMemo(
    () => list.cards?.map((card) => card.id) ?? [],
    [list.cards]
  );

  const sortedCards = useMemo(
    () => list.cards?.slice().sort((a, b) => a.position - b.position) ?? [],
    [list.cards]
  );

  const deleteMutation = useMutation({
    mutationFn: () => deleteList(list.id),
    onSuccess: () => {
      setDeleteDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: QueryKeys.lists.byBoard(boardId) });
    },
  });

  const isCreatingCard = modal.createCardListId === list.id;

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={cn(
        'w-72 flex-shrink-0 bg-muted/50 flex flex-col max-h-[calc(100vh-200px)]',
        (isDragging || isSortableDragging) && 'opacity-50',
        isOver && 'ring-2 ring-primary'
      )}
    >
      <CardHeader className="p-3 pb-2 flex-shrink-0">
        <div className="flex items-center gap-2">
          <button
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-1 hover:bg-accent rounded"
          >
            <IconGripVertical className="size-4 text-muted-foreground" />
          </button>
          <CardTitle className="text-sm font-medium flex-1 truncate">
            {list.name}
          </CardTitle>
          <span className="text-xs text-muted-foreground">
            {list.cards?.length ?? 0}
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="size-6">
                <IconDotsVertical className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem disabled>
                <IconEdit className="size-4 mr-2" />
                Edit List
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => setDeleteDialogOpen(true)}
              >
                <IconTrash className="size-4 mr-2" />
                Delete List
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DeleteConfirmDialog
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
            title="Delete List"
            description={`Are you sure you want to delete "${list.name}"? All cards in this list will also be deleted. This action cannot be undone.`}
            onConfirm={() => deleteMutation.mutate()}
            isDeleting={deleteMutation.isPending}
          />
        </div>
      </CardHeader>

      <CardContent className="p-2 pt-0 flex-1 overflow-hidden flex flex-col">
        <ScrollArea className="flex-1 -mx-2 px-2">
          <SortableContext items={cardIds} strategy={verticalListSortingStrategy}>
            <div className="space-y-2">
              {sortedCards.map((card) => (
                <KanbanCard key={card.id} card={card} />
              ))}
            </div>
          </SortableContext>
        </ScrollArea>

        <div className="mt-2 pt-2 border-t flex-shrink-0">
          {isCreatingCard ? (
            <CreateCardForm listId={list.id} boardId={boardId} onCancel={closeCreateCard} />
          ) : (
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-muted-foreground"
              onClick={() => openCreateCard(list.id)}
            >
              <IconPlus className="size-4 mr-2" />
              Add Card
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
