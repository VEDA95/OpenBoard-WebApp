// WebSocket event types matching backend constants
export const WebSocketEvents = {
  BOARD_UPDATED: 'board.updated',
  BOARD_DELETED: 'board.deleted',

  LIST_CREATED: 'list.created',
  LIST_UPDATED: 'list.updated',
  LIST_DELETED: 'list.deleted',
  LIST_REORDERED: 'list.reordered',

  CARD_CREATED: 'card.created',
  CARD_UPDATED: 'card.updated',
  CARD_DELETED: 'card.deleted',
  CARD_MOVED: 'card.moved',

  COMMENT_CREATED: 'comment.created',
  COMMENT_UPDATED: 'comment.updated',
  COMMENT_DELETED: 'comment.deleted',

  LABEL_CREATED: 'label.created',
  LABEL_UPDATED: 'label.updated',
  LABEL_DELETED: 'label.deleted',

  CHECKLIST_ITEM_CREATED: 'checklist.item.created',
  CHECKLIST_ITEM_UPDATED: 'checklist.item.updated',
  CHECKLIST_ITEM_DELETED: 'checklist.item.deleted',
} as const;

export type WebSocketEventType = typeof WebSocketEvents[keyof typeof WebSocketEvents];

export interface WebSocketMessage<T = unknown> {
  type: string;
  message?: string;
  data?: T;
}

export interface AuthMessage {
  access_token: string;
}

export interface SubscribeMessage {
  type: 'subscribe' | 'unsubscribe';
  topic: string;
}

export type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'reconnecting';

export function boardTopic(boardId: string): string {
  return `board:${boardId}`;
}
