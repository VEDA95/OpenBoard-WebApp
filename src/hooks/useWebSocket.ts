import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { wsClient } from '@lib/websocket/client';
import { createWebSocketEventHandler } from '@lib/websocket/handlers';
import { boardTopic, type ConnectionStatus } from '@lib/websocket/types';

export function useWebSocketConnection() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const handleEvent = createWebSocketEventHandler(queryClient);
    const unsubscribeMessage = wsClient.onMessage(handleEvent);

    wsClient.connect();

    return () => {
      unsubscribeMessage();
      wsClient.disconnect();
    };
  }, [queryClient]);
}

export function useBoardSubscription(boardId: string | null) {
  useEffect(() => {
    if (!boardId) return;

    const topic = boardTopic(boardId);
    wsClient.subscribe(topic);

    return () => {
      wsClient.unsubscribe(topic);
    };
  }, [boardId]);
}

export function useWebSocketStatus() {
  const [status, setStatus] = useState<ConnectionStatus>(() => wsClient.getStatus());

  useEffect(() => {
    return wsClient.onStatusChange(setStatus);
  }, []);

  return status;
}
