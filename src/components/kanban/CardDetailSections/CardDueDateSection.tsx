import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { IconCalendar, IconX } from '@tabler/icons-react';
import { Button } from '@components/ui/button';
import { Calendar } from '@components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@components/ui/popover';
import { updateCard } from '@lib/fetch/cards';
import { QueryKeys } from '@lib/queries/queryKeys';
import type { Card } from '@appTypes/board';
import { cn } from '@lib/utils/cn';

interface CardDueDateSectionProps {
  card: Card;
  boardId: string;
}

export function CardDueDateSection({ card, boardId }: CardDueDateSectionProps) {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);

  const updateMutation = useMutation({
    mutationFn: (dueDate: string | undefined) =>
      updateCard(card.id, { due_date: dueDate }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.cards.detail(card.id) });
      queryClient.invalidateQueries({ queryKey: QueryKeys.lists.byBoard(boardId) });
      setIsOpen(false);
    },
  });

  function handleDateSelect(date: Date | undefined) {
    if (date) {
      updateMutation.mutate(date.toISOString());
    }
  }

  function handleRemoveDueDate() {
    updateMutation.mutate(undefined);
  }

  const isOverdue = card.dueDate && new Date(card.dueDate) < new Date();
  const isDueSoon =
    card.dueDate &&
    !isOverdue &&
    new Date(card.dueDate).getTime() - new Date().getTime() < 24 * 60 * 60 * 1000;

  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <IconCalendar className="size-5 text-muted-foreground" />
        <h3 className="font-medium">Due Date</h3>
      </div>

      <div className="flex items-center gap-2">
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            {card.dueDate ? (
              <Button
                variant="outline"
                className={cn(
                  'justify-start font-normal',
                  isOverdue && 'border-destructive text-destructive',
                  isDueSoon && 'border-yellow-500 text-yellow-600'
                )}
              >
                <IconCalendar className="size-4 mr-2" />
                {new Date(card.dueDate).toLocaleDateString(undefined, {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
                {isOverdue && (
                  <span className="ml-2 text-xs bg-destructive text-destructive-foreground px-1.5 py-0.5 rounded">
                    Overdue
                  </span>
                )}
                {isDueSoon && !isOverdue && (
                  <span className="ml-2 text-xs bg-yellow-500 text-white px-1.5 py-0.5 rounded">
                    Due soon
                  </span>
                )}
              </Button>
            ) : (
              <Button variant="outline" className="justify-start text-muted-foreground">
                <IconCalendar className="size-4 mr-2" />
                Set due date
              </Button>
            )}
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={card.dueDate ? new Date(card.dueDate) : undefined}
              onSelect={handleDateSelect}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        {card.dueDate && (
          <Button
            variant="ghost"
            size="icon"
            className="size-8 text-muted-foreground hover:text-destructive"
            onClick={handleRemoveDueDate}
            disabled={updateMutation.isPending}
          >
            <IconX className="size-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
