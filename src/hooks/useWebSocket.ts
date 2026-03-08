import { useEffect, useState, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { wsClient } from '@lib/websocket/client';
import { createWebSocketEventHandler } from '@lib/websocket/handlers';
import { boardTopic, type ConnectionStatus } from '@lib/websocket/types';

export function useWebSocket(accessToken: string | null) {
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<ConnectionStatus>('disconnected');

  useEffect(() => {
    if (!accessToken) {
      wsClient.disconnect();
      return;
    }

    // Set up event handler
    const handleEvent = createWebSocketEventHandler(queryClient);
    const unsubscribeMessage = wsClient.onMessage(handleEvent);
    const unsubscribeStatus = wsClient.onStatusChange(setStatus);

    // Connect
    wsClient.connect(accessToken);

    return () => {
      unsubscribeMessage();
      unsubscribeStatus();
    };
  }, [accessToken, queryClient]);

  return { status };
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
