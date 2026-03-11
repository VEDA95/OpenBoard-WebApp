import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { IconTag, IconPlus, IconX, IconCheck } from '@tabler/icons-react';
import { Badge } from '@components/ui/badge';
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@components/ui/popover';
import { getLabelsByBoard, createLabel } from '@lib/fetch/labels';
import { addLabelToCard, removeLabelFromCard } from '@lib/fetch/cards';
import { QueryKeys } from '@lib/queries/queryKeys';
import { transformLabel, type Card, type Label } from '@appTypes/board';
import { cn } from '@lib/utils/cn';

interface CardLabelsSectionProps {
  card: Card;
  boardId: string;
}

const PRESET_COLORS = [
  '#ef4444', // red
  '#f97316', // orange
  '#eab308', // yellow
  '#22c55e', // green
  '#06b6d4', // cyan
  '#3b82f6', // blue
  '#8b5cf6', // violet
  '#ec4899', // pink
];

export function CardLabelsSection({ card, boardId }: CardLabelsSectionProps) {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newLabelName, setNewLabelName] = useState('');
  const [newLabelColor, setNewLabelColor] = useState(PRESET_COLORS[0]);

  const { data: allLabels } = useQuery({
    queryKey: QueryKeys.labels.byBoard(boardId),
    queryFn: async () => {
      const response = await getLabelsByBoard(boardId);
      if (response.code !== 200) {
        throw new Error(response.message ?? 'Failed to fetch labels');
      }
      return response.data?.map(transformLabel) ?? [];
    },
  });

  const createLabelMutation = useMutation({
    mutationFn: () =>
      createLabel({
        name: newLabelName.trim(),
        color: newLabelColor,
        board_id: boardId,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.labels.byBoard(boardId) });
      setNewLabelName('');
      setIsCreating(false);
    },
  });

  const addLabelMutation = useMutation({
    mutationFn: (labelId: string) => addLabelToCard(card.id, labelId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.cards.detail(card.id) });
      queryClient.invalidateQueries({ queryKey: QueryKeys.lists.byBoard(boardId) });
    },
  });

  const removeLabelMutation = useMutation({
    mutationFn: (labelId: string) => removeLabelFromCard(card.id, labelId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.cards.detail(card.id) });
      queryClient.invalidateQueries({ queryKey: QueryKeys.lists.byBoard(boardId) });
    },
  });

  const cardLabelIds = new Set(card.labels?.map((l) => l.id) ?? []);

  function handleToggleLabel(label: Label) {
    if (cardLabelIds.has(label.id)) {
      removeLabelMutation.mutate(label.id);
    } else {
      addLabelMutation.mutate(label.id);
    }
  }

  function handleCreateLabel() {
    if (newLabelName.trim()) {
      createLabelMutation.mutate();
    }
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <IconTag className="size-5 text-muted-foreground" />
        <h3 className="font-medium">Labels</h3>
      </div>

      <div className="flex flex-wrap gap-2">
        {card.labels?.map((label) => (
          <Badge
            key={label.id}
            style={{
              backgroundColor: label.color,
              color: getContrastColor(label.color),
            }}
            className="gap-1"
          >
            {label.name}
            <button
              onClick={() => removeLabelMutation.mutate(label.id)}
              className="hover:opacity-70"
            >
              <IconX className="size-3" />
            </button>
          </Badge>
        ))}

        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-6">
              <IconPlus className="size-3 mr-1" />
              Add
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64" align="start">
            <div className="space-y-3">
              <h4 className="font-medium text-sm">Labels</h4>

              {!isCreating && (
                <div className="space-y-1">
                  {allLabels?.map((label) => (
                    <button
                      key={label.id}
                      onClick={() => handleToggleLabel(label)}
                      className={cn(
                        'w-full flex items-center gap-2 px-2 py-1.5 rounded text-left text-sm transition-colors',
                        'hover:bg-accent'
                      )}
                    >
                      <div
                        className="size-6 rounded"
                        style={{ backgroundColor: label.color }}
                      />
                      <span className="flex-1 truncate">{label.name}</span>
                      {cardLabelIds.has(label.id) && (
                        <IconCheck className="size-4 text-primary" />
                      )}
                    </button>
                  ))}
                </div>
              )}

              {isCreating ? (
                <div className="space-y-2">
                  <Input
                    value={newLabelName}
                    onChange={(e) => setNewLabelName(e.target.value)}
                    placeholder="Label name"
                    autoFocus
                  />
                  <div className="flex flex-wrap gap-1">
                    {PRESET_COLORS.map((color) => (
                      <button
                        key={color}
                        onClick={() => setNewLabelColor(color)}
                        className={cn(
                          'size-6 rounded border-2',
                          newLabelColor === color
                            ? 'border-foreground'
                            : 'border-transparent'
                        )}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={handleCreateLabel}
                      disabled={!newLabelName.trim() || createLabelMutation.isPending}
                    >
                      Create
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setIsCreating(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => setIsCreating(true)}
                >
                  <IconPlus className="size-3 mr-1" />
                  Create Label
                </Button>
              )}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}

function getContrastColor(hexColor: string): string {
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? '#000000' : '#ffffff';
}
