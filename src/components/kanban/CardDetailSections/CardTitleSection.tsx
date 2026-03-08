import { useState, useRef, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Input } from '@components/ui/input';
import { updateCard } from '@lib/fetch/cards';
import { QueryKeys } from '@lib/queries/queryKeys';
import type { Card } from '@appTypes/board';

interface CardTitleSectionProps {
  card: Card;
  boardId: string;
}

export function CardTitleSection({ card, boardId }: CardTitleSectionProps) {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(card.name);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTitle(card.name);
  }, [card.name]);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  const updateMutation = useMutation({
    mutationFn: (name: string) => updateCard(card.id, { name }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.cards.detail(card.id) });
      queryClient.invalidateQueries({ queryKey: QueryKeys.lists.byBoard(boardId) });
    },
  });

  function handleSave() {
    if (title.trim() && title.trim() !== card.name) {
      updateMutation.mutate(title.trim());
    } else {
      setTitle(card.name);
    }
    setIsEditing(false);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setTitle(card.name);
      setIsEditing(false);
    }
  }

  if (isEditing) {
    return (
      <Input
        ref={inputRef}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        className="text-xl font-semibold h-auto py-1"
      />
    );
  }

  return (
    <h2
      className="text-xl font-semibold cursor-pointer hover:bg-accent/50 rounded px-2 py-1 -mx-2"
      onClick={() => setIsEditing(true)}
    >
      {card.name}
    </h2>
  );
}
