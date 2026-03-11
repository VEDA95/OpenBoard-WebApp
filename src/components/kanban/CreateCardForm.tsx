import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@components/ui/dialog';
import { Input } from '@components/ui/input';
import { Label } from '@components/ui/label';
import { Textarea } from '@components/ui/textarea';
import { Button } from '@components/ui/button';
import { createCard } from '@lib/fetch/cards';
import { QueryKeys } from '@lib/queries/queryKeys';
import type { CreateCardPayload } from '@appTypes/board';

interface CreateCardDialogProps {
  listId: string;
  boardId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateCardDialog({ listId, boardId, open, onOpenChange }: CreateCardDialogProps) {
  const queryClient = useQueryClient();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const createMutation = useMutation({
    mutationFn: (data: CreateCardPayload) => createCard(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.lists.byBoard(boardId) });
      handleClose();
    },
  });

  function handleClose() {
    setName('');
    setDescription('');
    onOpenChange(false);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;

    const payload: CreateCardPayload = {
      name: name.trim(),
      list_id: listId,
    };

    if (description.trim()) {
      payload.description = description.trim();
    }

    createMutation.mutate(payload);
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Card</DialogTitle>
            <DialogDescription>
              Add a new card to this list.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="card-name">Title</Label>
              <Input
                id="card-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Card title"
                autoFocus
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="card-description">Description (optional)</Label>
              <Textarea
                id="card-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add a description..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!name.trim() || createMutation.isPending}>
              {createMutation.isPending ? 'Adding...' : 'Add Card'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
