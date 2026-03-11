import type {
  WebSocketMessage,
  SubscribeMessage,
  ConnectionStatus,
} from './types';

type MessageHandler = (message: WebSocketMessage) => void;
type StatusHandler = (status: ConnectionStatus) => void;

export class WebSocketClient {
  private ws: WebSocket | null = null;
  private url: string;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private messageHandlers: Set<MessageHandler> = new Set();
  private statusHandlers: Set<StatusHandler> = new Set();
  private subscribedTopics: Set<string> = new Set();
  private status: ConnectionStatus = 'disconnected';
  private reconnectTimeout: ReturnType<typeof setTimeout> | null = null;

  constructor(url: string = 'ws://localhost:8080/ws') {
    this.url = url;
  }

  private setStatus(status: ConnectionStatus) {
    this.status = status;
    this.statusHandlers.forEach((handler) => handler(status));
  }

  getStatus(): ConnectionStatus {
    return this.status;
  }

  connect() {
    if (this.ws?.readyState === WebSocket.OPEN) {
      return;
    }

    this.setStatus('connecting');

    try {
      this.ws = new WebSocket(this.url);

      this.ws.onopen = () => {
        this.reconnectAttempts = 0;
        this.setStatus('connected');
        this.resubscribeToTopics();
      };

      this.ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          this.handleMessage(message);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      this.ws.onclose = () => {
        this.setStatus('disconnected');
        this.attemptReconnect();
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      this.setStatus('disconnected');
    }
  }

  private handleMessage(message: WebSocketMessage) {
    // Handle auth messages from session checker
    if (message.type === 'auth') {
      if (!message.message?.includes('successful')) {
        console.error('WebSocket auth expired:', message.message);
        this.setStatus('disconnected');
      }
      return;
    }

    // Handle subscribe/unsubscribe confirmations
    if (message.type === 'subscribe' || message.type === 'unsubscribe') {
      return;
    }

    // Forward other messages to handlers
    this.messageHandlers.forEach((handler) => handler(message));
  }

  private attemptReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log('Max reconnect attempts reached');
      return;
    }

    this.setStatus('reconnecting');
    this.reconnectAttempts++;

    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);

    this.reconnectTimeout = setTimeout(() => {
      console.log(`Attempting to reconnect (attempt ${this.reconnectAttempts})`);
      this.connect();
    }, delay);
  }

  private resubscribeToTopics() {
    this.subscribedTopics.forEach((topic) => {
      this.sendSubscribe(topic);
    });
  }

  private sendSubscribe(topic: string) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;

    const message: SubscribeMessage = {
      type: 'subscribe',
      topic,
    };
    this.ws.send(JSON.stringify(message));
  }

  private sendUnsubscribe(topic: string) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;

    const message: SubscribeMessage = {
      type: 'unsubscribe',
      topic,
    };
    this.ws.send(JSON.stringify(message));
  }

  subscribe(topic: string) {
    this.subscribedTopics.add(topic);
    if (this.status === 'connected') {
      this.sendSubscribe(topic);
    }
  }

  unsubscribe(topic: string) {
    this.subscribedTopics.delete(topic);
    if (this.status === 'connected') {
      this.sendUnsubscribe(topic);
    }
  }

  onMessage(handler: MessageHandler): () => void {
    this.messageHandlers.add(handler);
    return () => {
      this.messageHandlers.delete(handler);
    };
  }

  onStatusChange(handler: StatusHandler): () => void {
    this.statusHandlers.add(handler);
    // Immediately call with current status
    handler(this.status);
    return () => {
      this.statusHandlers.delete(handler);
    };
  }

  disconnect() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }

    this.subscribedTopics.clear();
    this.reconnectAttempts = 0;
    this.setStatus('disconnected');
  }
}

// Singleton instance
export const wsClient = new WebSocketClient();
