import { useState, useRef, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { IconX } from '@tabler/icons-react';
import { Card, CardContent } from '@components/ui/card';
import { Input } from '@components/ui/input';
import { Button } from '@components/ui/button';
import { createList } from '@lib/fetch/lists';
import { QueryKeys } from '@lib/queries/queryKeys';
import type { CreateListPayload } from '@appTypes/board';

interface CreateListFormProps {
  boardId: string;
  onCancel: () => void;
}

export function CreateListForm({ boardId, onCancel }: CreateListFormProps) {
  const queryClient = useQueryClient();
  const [name, setName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const createMutation = useMutation({
    mutationFn: (data: CreateListPayload) => createList(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.lists.byBoard(boardId) });
      setName('');
      inputRef.current?.focus();
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;

    createMutation.mutate({
      name: name.trim(),
      board_id: boardId,
    });
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Escape') {
      onCancel();
    }
  }

  return (
    <Card className="w-72 flex-shrink-0 bg-muted/50">
      <CardContent className="p-3">
        <form onSubmit={handleSubmit}>
          <Input
            ref={inputRef}
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter list name..."
            className="mb-2"
          />
          <div className="flex items-center gap-2">
            <Button
              type="submit"
              size="sm"
              disabled={!name.trim() || createMutation.isPending}
            >
              {createMutation.isPending ? 'Adding...' : 'Add List'}
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
      </CardContent>
    </Card>
  );
}
