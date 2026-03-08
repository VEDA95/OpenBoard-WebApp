import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { IconMessage, IconTrash } from '@tabler/icons-react';
import { Textarea } from '@components/ui/textarea';
import { Button } from '@components/ui/button';
import { Avatar, AvatarFallback } from '@components/ui/avatar';
import { getCommentsByCard, createComment, deleteComment } from '@lib/fetch/comments';
import { QueryKeys } from '@lib/queries/queryKeys';
import { transformComment, type Card } from '@appTypes/board';

interface CardCommentsSectionProps {
  card: Card;
  boardId: string;
}

export function CardCommentsSection({ card, boardId }: CardCommentsSectionProps) {
  const queryClient = useQueryClient();
  const [newComment, setNewComment] = useState('');

  const { data: comments } = useQuery({
    queryKey: QueryKeys.comments.byCard(card.id),
    queryFn: async () => {
      const response = await getCommentsByCard(card.id);
      if (response.status !== 200) {
        throw new Error(response.message || 'Failed to fetch comments');
      }
      return response.data?.map(transformComment).sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ) ?? [];
    },
  });

  const createMutation = useMutation({
    mutationFn: () =>
      createComment({
        comment: newComment.trim(),
        card_id: card.id,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.comments.byCard(card.id) });
      queryClient.invalidateQueries({ queryKey: QueryKeys.cards.detail(card.id) });
      queryClient.invalidateQueries({ queryKey: QueryKeys.lists.byBoard(boardId) });
      setNewComment('');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteComment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.comments.byCard(card.id) });
      queryClient.invalidateQueries({ queryKey: QueryKeys.cards.detail(card.id) });
      queryClient.invalidateQueries({ queryKey: QueryKeys.lists.byBoard(boardId) });
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (newComment.trim()) {
      createMutation.mutate();
    }
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <IconMessage className="size-5 text-muted-foreground" />
        <h3 className="font-medium">Comments</h3>
        {comments && comments.length > 0 && (
          <span className="text-sm text-muted-foreground">
            ({comments.length})
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="mb-4">
        <Textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          rows={3}
          className="mb-2"
        />
        <Button
          type="submit"
          size="sm"
          disabled={!newComment.trim() || createMutation.isPending}
        >
          {createMutation.isPending ? 'Posting...' : 'Post Comment'}
        </Button>
      </form>

      <div className="space-y-4">
        {comments?.map((comment) => (
          <div key={comment.id} className="flex gap-3 group">
            <Avatar className="size-8 flex-shrink-0">
              <AvatarFallback className="text-xs">U</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium">User</span>
                <span className="text-xs text-muted-foreground">
                  {formatRelativeTime(comment.createdAt)}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-6 opacity-0 group-hover:opacity-100 transition-opacity ml-auto"
                  onClick={() => deleteMutation.mutate(comment.id)}
                >
                  <IconTrash className="size-3" />
                </Button>
              </div>
              <p className="text-sm whitespace-pre-wrap">{comment.comment}</p>
            </div>
          </div>
        ))}

        {(!comments || comments.length === 0) && (
          <p className="text-sm text-muted-foreground text-center py-4">
            No comments yet
          </p>
        )}
      </div>
    </div>
  );
}

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSeconds < 60) {
    return 'just now';
  } else if (diffMinutes < 60) {
    return `${diffMinutes}m ago`;
  } else if (diffHours < 24) {
    return `${diffHours}h ago`;
  } else if (diffDays < 7) {
    return `${diffDays}d ago`;
  } else {
    return date.toLocaleDateString();
  }
}
