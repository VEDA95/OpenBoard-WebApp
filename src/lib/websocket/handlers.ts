import type { QueryClient } from '@tanstack/react-query';
import { QueryKeys } from '@lib/queries/queryKeys';
import { WebSocketEvents, type WebSocketMessage } from './types';

interface EventData {
  board_id?: string;
  list_id?: string;
  card_id?: string;
  [key: string]: unknown;
}

export function createWebSocketEventHandler(queryClient: QueryClient) {
  return function handleWebSocketEvent(message: WebSocketMessage<EventData>) {
    const { type, data } = message;

    if (!data) return;

    switch (type) {
      // Board events
      case WebSocketEvents.BOARD_UPDATED:
        if (data.board_id) {
          queryClient.invalidateQueries({ queryKey: QueryKeys.boards.detail(data.board_id) });
        }
        break;

      case WebSocketEvents.BOARD_DELETED:
        if (data.board_id) {
          queryClient.invalidateQueries({ queryKey: QueryKeys.boards.all() });
        }
        break;

      // List events
      case WebSocketEvents.LIST_CREATED:
      case WebSocketEvents.LIST_UPDATED:
      case WebSocketEvents.LIST_DELETED:
      case WebSocketEvents.LIST_REORDERED:
        if (data.board_id) {
          queryClient.invalidateQueries({ queryKey: QueryKeys.lists.byBoard(data.board_id) });
        }
        break;

      // Card events
      case WebSocketEvents.CARD_CREATED:
      case WebSocketEvents.CARD_UPDATED:
      case WebSocketEvents.CARD_DELETED:
      case WebSocketEvents.CARD_MOVED:
        if (data.board_id) {
          queryClient.invalidateQueries({ queryKey: QueryKeys.lists.byBoard(data.board_id) });
        }
        if (data.card_id) {
          queryClient.invalidateQueries({ queryKey: QueryKeys.cards.detail(data.card_id) });
        }
        break;

      // Comment events
      case WebSocketEvents.COMMENT_CREATED:
      case WebSocketEvents.COMMENT_UPDATED:
      case WebSocketEvents.COMMENT_DELETED:
        if (data.card_id) {
          queryClient.invalidateQueries({ queryKey: QueryKeys.comments.byCard(data.card_id) });
          queryClient.invalidateQueries({ queryKey: QueryKeys.cards.detail(data.card_id) });
        }
        break;

      // Label events
      case WebSocketEvents.LABEL_CREATED:
      case WebSocketEvents.LABEL_UPDATED:
      case WebSocketEvents.LABEL_DELETED:
        if (data.board_id) {
          queryClient.invalidateQueries({ queryKey: QueryKeys.labels.byBoard(data.board_id) });
          queryClient.invalidateQueries({ queryKey: QueryKeys.lists.byBoard(data.board_id) });
        }
        break;

      // Checklist item events
      case WebSocketEvents.CHECKLIST_ITEM_CREATED:
      case WebSocketEvents.CHECKLIST_ITEM_UPDATED:
      case WebSocketEvents.CHECKLIST_ITEM_DELETED:
        if (data.card_id) {
          queryClient.invalidateQueries({ queryKey: QueryKeys.checklistItems.byCard(data.card_id) });
          queryClient.invalidateQueries({ queryKey: QueryKeys.cards.detail(data.card_id) });
        }
        break;

      default:
        // Unknown event type, ignore
        break;
    }
  };
}
