import { useState, useRef, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { IconAlignLeft } from '@tabler/icons-react';
import { Textarea } from '@components/ui/textarea';
import { Button } from '@components/ui/button';
import { updateCard } from '@lib/fetch/cards';
import { QueryKeys } from '@lib/queries/queryKeys';
import type { Card } from '@appTypes/board';

interface CardDescriptionSectionProps {
  card: Card;
  boardId: string;
}

export function CardDescriptionSection({ card, boardId }: CardDescriptionSectionProps) {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [description, setDescription] = useState(card.description || '');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setDescription(card.description || '');
  }, [card.description]);

  useEffect(() => {
    if (isEditing) {
      textareaRef.current?.focus();
    }
  }, [isEditing]);

  const updateMutation = useMutation({
    mutationFn: (newDescription: string) =>
      updateCard(card.id, { description: newDescription || undefined }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.cards.detail(card.id) });
      queryClient.invalidateQueries({ queryKey: QueryKeys.lists.byBoard(boardId) });
    },
  });

  function handleSave() {
    if (description !== (card.description || '')) {
      updateMutation.mutate(description);
    }
    setIsEditing(false);
  }

  function handleCancel() {
    setDescription(card.description || '');
    setIsEditing(false);
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <IconAlignLeft className="size-5 text-muted-foreground" />
        <h3 className="font-medium">Description</h3>
      </div>

      {isEditing ? (
        <div className="space-y-2">
          <Textarea
            ref={textareaRef}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add a more detailed description..."
            rows={4}
          />
          <div className="flex items-center gap-2">
            <Button size="sm" onClick={handleSave} disabled={updateMutation.isPending}>
              {updateMutation.isPending ? 'Saving...' : 'Save'}
            </Button>
            <Button size="sm" variant="ghost" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div
          className="min-h-[80px] p-3 bg-muted/50 rounded-md cursor-pointer hover:bg-muted transition-colors"
          onClick={() => setIsEditing(true)}
        >
          {card.description ? (
            <p className="text-sm whitespace-pre-wrap">{card.description}</p>
          ) : (
            <p className="text-sm text-muted-foreground">
              Add a more detailed description...
            </p>
          )}
        </div>
      )}
    </div>
  );
}
