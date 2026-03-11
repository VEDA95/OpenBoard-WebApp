import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { IconX, IconTrash } from '@tabler/icons-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@components/ui/dialog';
import { Button } from '@components/ui/button';
import { Skeleton } from '@components/ui/skeleton';
import { ScrollArea } from '@components/ui/scroll-area';
import { DeleteConfirmDialog } from '@components/ui/delete-confirm-dialog';
import { CardTitleSection } from './CardDetailSections/CardTitleSection';
import { CardDescriptionSection } from './CardDetailSections/CardDescriptionSection';
import { CardLabelsSection } from './CardDetailSections/CardLabelsSection';
import { CardChecklistSection } from './CardDetailSections/CardChecklistSection';
import { CardCommentsSection } from './CardDetailSections/CardCommentsSection';
import { CardDueDateSection } from './CardDetailSections/CardDueDateSection';
import { getCard, deleteCard } from '@lib/fetch/cards';
import { QueryKeys } from '@lib/queries/queryKeys';
import { useModalState } from '@lib/state/modal';
import { transformCard } from '@appTypes/board';

interface CardDetailModalProps {
  boardId: string;
}

export function CardDetailModal({ boardId }: CardDetailModalProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { cardDetailId, cardDetailOpen, closeCardDetail } = useModalState();
  const search = useSearch({ strict: false }) as { card?: string };
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const cardId = cardDetailId;

  // Sync URL search param → zustand (only reacts to URL changes, not zustand)
  useEffect(() => {
    if (search.card) {
      useModalState.getState().openCardDetail(search.card);
    }
  }, [search.card]);

  const { data: card, isLoading, error } = useQuery({
    queryKey: QueryKeys.cards.detail(cardId ?? ''),
    queryFn: async () => {
      if (!cardId) return null;
      const response = await getCard(cardId);
      if (response.code !== 200) {
        throw new Error(response.message ?? 'Failed to fetch card');
      }
      return response.data ? transformCard(response.data) : null;
    },
    enabled: !!cardId,
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteCard(cardId!),
    onSuccess: () => {
      setDeleteDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: QueryKeys.lists.byBoard(boardId) });
      handleClose();
    },
  });

  function handleClose() {
    closeCardDetail();
    navigate({
      search: (prev: Record<string, string>) => {
        const { card: _, ...rest } = prev;
        return rest;
      },
      replace: true,
    });
  }

  return (
    <Dialog open={cardDetailOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-0" showCloseButton={false}>
        <DialogHeader className="p-4 pb-0 flex-shrink-0">
          <div className="flex items-start justify-between gap-4">
            <DialogTitle className="sr-only">Card Details</DialogTitle>
            <div className="flex-1">
              {isLoading ? (
                <Skeleton className="h-8 w-3/4" />
              ) : card ? (
                <CardTitleSection card={card} boardId={boardId} />
              ) : (
                <span className="text-muted-foreground">Card not found</span>
              )}
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="size-8 text-muted-foreground hover:text-destructive"
                onClick={() => setDeleteDialogOpen(true)}
                disabled={deleteMutation.isPending}
              >
                <IconTrash className="size-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="size-8"
                onClick={handleClose}
              >
                <IconX className="size-4" />
              </Button>
              <DeleteConfirmDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                title="Delete Card"
                description={`Are you sure you want to delete "${card?.name || 'this card'}"? This action cannot be undone.`}
                onConfirm={() => deleteMutation.mutate()}
                isDeleting={deleteMutation.isPending}
              />
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 p-4 pt-3">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Failed to load card</p>
              <p className="text-sm text-destructive">{error.message}</p>
            </div>
          ) : card ? (
            <div className="space-y-6">
              <CardLabelsSection card={card} boardId={boardId} />
              <CardDueDateSection card={card} boardId={boardId} />
              <CardDescriptionSection card={card} boardId={boardId} />
              <CardChecklistSection card={card} boardId={boardId} />
              <CardCommentsSection card={card} boardId={boardId} />
            </div>
          ) : null}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
