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
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { Label } from '@components/ui/label';
import { Checkbox } from '@components/ui/checkbox';
import { createBoard } from '@lib/fetch/boards';
import { QueryKeys } from '@lib/queries/queryKeys';
import { useModalState } from '@lib/state/modal';
import type { CreateBoardPayload } from '@appTypes/board';

export function CreateBoardDialog() {
  const queryClient = useQueryClient();
  const { createBoardOpen, createBoardWorkspaceId, closeCreateBoard } = useModalState();
  const [name, setName] = useState('');
  const [isPublic, setIsPublic] = useState(true);

  const workspaceId = createBoardWorkspaceId;

  const createMutation = useMutation({
    mutationFn: (data: CreateBoardPayload) => createBoard(data),
    onSuccess: () => {
      if (workspaceId) {
        queryClient.invalidateQueries({ queryKey: QueryKeys.workspaces.detail(workspaceId) });
      }
      handleClose();
    },
  });

  function handleClose() {
    setName('');
    setIsPublic(true);
    closeCreateBoard();
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !workspaceId) return;

    createMutation.mutate({
      name: name.trim(),
      workspace: workspaceId,
      is_public: isPublic,
    });
  }

  return (
    <Dialog open={createBoardOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create Board</DialogTitle>
            <DialogDescription>
              Create a new board to organize your tasks.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="board-name">Name</Label>
              <Input
                id="board-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="My Board"
                autoFocus
              />
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="board_is_public"
                checked={isPublic}
                onCheckedChange={(checked) => setIsPublic(checked === true)}
              />
              <Label htmlFor="board_is_public" className="cursor-pointer">
                Make this board public
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!name.trim() || createMutation.isPending}>
              {createMutation.isPending ? 'Creating...' : 'Create Board'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
