import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { IconCalendar, IconMessage, IconCheckbox } from '@tabler/icons-react';
import { Card, CardContent } from '@components/ui/card';
import { Badge } from '@components/ui/badge';
import { useKanbanStore } from '@lib/stores/kanban-store';
import type { Card as CardType } from '@appTypes/board';
import { cn } from '@lib/utils/cn';

interface KanbanCardProps {
  card: CardType;
  isDragging?: boolean;
}

export function KanbanCard({ card, isDragging }: KanbanCardProps) {
  const navigate = useNavigate();
  const { openCardDetail } = useKanbanStore();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({
    id: card.id,
    data: {
      type: 'card',
      card,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const hasLabels = card.labels && card.labels.length > 0;
  const hasComments = card.comments && card.comments.length > 0;
  const hasChecklist = card.checklistItems && card.checklistItems.length > 0;
  const hasDueDate = card.dueDate !== null;

  const checkedCount = card.checklistItems?.filter((item) => item.isChecked).length ?? 0;
  const totalChecklistItems = card.checklistItems?.length ?? 0;

  const isOverdue = card.dueDate && new Date(card.dueDate) < new Date();

  function handleClick() {
    openCardDetail(card.id);
    // Also update the URL search param
    navigate({
      search: (prev: Record<string, string>) => ({ ...prev, card: card.id }),
      replace: true,
    });
  }

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={handleClick}
      className={cn(
        'cursor-pointer hover:ring-2 hover:ring-primary/50 transition-shadow',
        (isDragging || isSortableDragging) && 'opacity-50 shadow-lg',
        card.color && 'border-l-4',
      )}
      data-color={card.color}
    >
      <CardContent className="p-3">
        {hasLabels && (
          <div className="flex flex-wrap gap-1 mb-2">
            {card.labels?.slice(0, 3).map((label) => (
              <Badge
                key={label.id}
                variant="secondary"
                className="text-xs px-1.5 py-0"
                style={{ backgroundColor: label.color, color: getContrastColor(label.color) }}
              >
                {label.name}
              </Badge>
            ))}
            {card.labels && card.labels.length > 3 && (
              <Badge variant="secondary" className="text-xs px-1.5 py-0">
                +{card.labels.length - 3}
              </Badge>
            )}
          </div>
        )}

        <p className="text-sm font-medium">{card.name}</p>

        {card.description && (
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
            {card.description}
          </p>
        )}

        {(hasDueDate || hasComments || hasChecklist) && (
          <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
            {hasDueDate && (
              <div
                className={cn(
                  'flex items-center gap-1',
                  isOverdue && 'text-destructive'
                )}
              >
                <IconCalendar className="size-3" />
                <span>
                  {new Date(card.dueDate!).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </div>
            )}
            {hasComments && (
              <div className="flex items-center gap-1">
                <IconMessage className="size-3" />
                <span>{card.comments?.length}</span>
              </div>
            )}
            {hasChecklist && (
              <div
                className={cn(
                  'flex items-center gap-1',
                  checkedCount === totalChecklistItems && 'text-green-600'
                )}
              >
                <IconCheckbox className="size-3" />
                <span>
                  {checkedCount}/{totalChecklistItems}
                </span>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function getContrastColor(hexColor: string): string {
  // Remove # if present
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // Calculate relative luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  return luminance > 0.5 ? '#000000' : '#ffffff';
}
