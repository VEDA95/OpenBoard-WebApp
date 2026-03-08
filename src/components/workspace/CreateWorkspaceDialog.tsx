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
import { Textarea } from '@components/ui/textarea';
import { Checkbox } from '@components/ui/checkbox';
import { createWorkspace } from '@lib/fetch/workspaces';
import { QueryKeys } from '@lib/queries/queryKeys';
import { useKanbanStore } from '@lib/stores/kanban-store';
import type { CreateWorkspacePayload } from '@appTypes/board';

export function CreateWorkspaceDialog() {
  const queryClient = useQueryClient();
  const { modal, closeCreateWorkspace } = useKanbanStore();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(true);

  const createMutation = useMutation({
    mutationFn: (data: CreateWorkspacePayload) => createWorkspace(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.workspaces.all() });
      handleClose();
    },
  });

  function handleClose() {
    setName('');
    setDescription('');
    setIsPublic(true);
    closeCreateWorkspace();
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;

    createMutation.mutate({
      name: name.trim(),
      description: description.trim() || undefined,
      is_public: isPublic,
    });
  }

  return (
    <Dialog open={modal.createWorkspaceOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create Workspace</DialogTitle>
            <DialogDescription>
              Create a new workspace to organize your boards.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="My Workspace"
                autoFocus
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="A place for all my projects..."
                rows={3}
              />
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="is_public"
                checked={isPublic}
                onCheckedChange={(checked) => setIsPublic(checked === true)}
              />
              <Label htmlFor="is_public" className="cursor-pointer">
                Make this workspace public
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!name.trim() || createMutation.isPending}>
              {createMutation.isPending ? 'Creating...' : 'Create Workspace'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
