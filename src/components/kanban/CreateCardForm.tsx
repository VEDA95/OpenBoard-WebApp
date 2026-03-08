import { useState, useRef, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { IconX } from '@tabler/icons-react';
import { Textarea } from '@components/ui/textarea';
import { Button } from '@components/ui/button';
import { createCard } from '@lib/fetch/cards';
import { QueryKeys } from '@lib/queries/queryKeys';
import type { CreateCardPayload } from '@appTypes/board';

interface CreateCardFormProps {
  listId: string;
  boardId: string;
  onCancel: () => void;
}

export function CreateCardForm({ listId, boardId, onCancel }: CreateCardFormProps) {
  const queryClient = useQueryClient();
  const [name, setName] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const createMutation = useMutation({
    mutationFn: (data: CreateCardPayload) => createCard(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.lists.byBoard(boardId) });
      setName('');
      textareaRef.current?.focus();
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;

    createMutation.mutate({
      name: name.trim(),
      list_id: listId,
    });
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Escape') {
      onCancel();
    }
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Textarea
        ref={textareaRef}
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Enter card title..."
        className="mb-2 min-h-[60px] resize-none"
        rows={2}
      />
      <div className="flex items-center gap-2">
        <Button
          type="submit"
          size="sm"
          disabled={!name.trim() || createMutation.isPending}
        >
          {createMutation.isPending ? 'Adding...' : 'Add Card'}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-8"
          onClick={onCancel}
        >
          <IconX className="size-4" />
        </Button>
      </div>
    </form>
  );
}
