import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { IconChecklist, IconPlus, IconTrash } from '@tabler/icons-react';
import { Checkbox } from '@components/ui/checkbox';
import { Input } from '@components/ui/input';
import { Button } from '@components/ui/button';
import { Progress } from '@components/ui/progress';
import {
  getChecklistItemsByCard,
  createChecklistItem,
  updateChecklistItem,
  deleteChecklistItem,
} from '@lib/fetch/checklist-items';
import { QueryKeys } from '@lib/queries/queryKeys';
import { transformChecklistItem, type Card } from '@appTypes/board';
import { cn } from '@lib/utils/cn';

interface CardChecklistSectionProps {
  card: Card;
  boardId: string;
}

export function CardChecklistSection({ card, boardId }: CardChecklistSectionProps) {
  const queryClient = useQueryClient();
  const [newItemName, setNewItemName] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const { data: items } = useQuery({
    queryKey: QueryKeys.checklistItems.byCard(card.id),
    queryFn: async () => {
      const response = await getChecklistItemsByCard(card.id);
      if (response.code !== 200) {
        throw new Error(response.message ?? 'Failed to fetch checklist items');
      }
      return response.data?.map(transformChecklistItem).sort((a, b) => a.position - b.position) ?? [];
    },
  });

  const createMutation = useMutation({
    mutationFn: () =>
      createChecklistItem({
        name: newItemName.trim(),
        card_id: card.id,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.checklistItems.byCard(card.id) });
      queryClient.invalidateQueries({ queryKey: QueryKeys.cards.detail(card.id) });
      queryClient.invalidateQueries({ queryKey: QueryKeys.lists.byBoard(boardId) });
      setNewItemName('');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, isChecked }: { id: string; isChecked: boolean }) =>
      updateChecklistItem(id, { is_checked: isChecked }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.checklistItems.byCard(card.id) });
      queryClient.invalidateQueries({ queryKey: QueryKeys.cards.detail(card.id) });
      queryClient.invalidateQueries({ queryKey: QueryKeys.lists.byBoard(boardId) });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteChecklistItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.checklistItems.byCard(card.id) });
      queryClient.invalidateQueries({ queryKey: QueryKeys.cards.detail(card.id) });
      queryClient.invalidateQueries({ queryKey: QueryKeys.lists.byBoard(boardId) });
    },
  });

  function handleAddItem(e: React.FormEvent) {
    e.preventDefault();
    if (newItemName.trim()) {
      createMutation.mutate();
    }
  }

  const checkedCount = items?.filter((item) => item.isChecked).length ?? 0;
  const totalItems = items?.length ?? 0;
  const progress = totalItems > 0 ? (checkedCount / totalItems) * 100 : 0;

  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <IconChecklist className="size-5 text-muted-foreground" />
        <h3 className="font-medium">Checklist</h3>
        {totalItems > 0 && (
          <span className="text-sm text-muted-foreground">
            {checkedCount}/{totalItems}
          </span>
        )}
      </div>

      {totalItems > 0 && (
        <Progress value={progress} className="h-2 mb-3" />
      )}

      <div className="space-y-2">
        {items?.map((item) => (
          <div key={item.id} className="flex items-center gap-2 group">
            <Checkbox
              checked={item.isChecked}
              onCheckedChange={(checked) =>
                updateMutation.mutate({
                  id: item.id,
                  isChecked: checked === true,
                })
              }
            />
            <span
              className={cn(
                'flex-1 text-sm',
                item.isChecked && 'line-through text-muted-foreground'
              )}
            >
              {item.name}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="size-6 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => deleteMutation.mutate(item.id)}
            >
              <IconTrash className="size-3" />
            </Button>
          </div>
        ))}

        {isAdding ? (
          <form onSubmit={handleAddItem} className="flex items-center gap-2">
            <Input
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              placeholder="Add an item..."
              autoFocus
              className="flex-1"
            />
            <Button type="submit" size="sm" disabled={!newItemName.trim() || createMutation.isPending}>
              Add
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => {
                setIsAdding(false);
                setNewItemName('');
              }}
            >
              Cancel
            </Button>
          </form>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAdding(true)}
          >
            <IconPlus className="size-3 mr-1" />
            Add Item
          </Button>
        )}
      </div>
    </div>
  );
}
