import { useWebSocketStatus } from '@/hooks/useWebSocket';
import { cn } from '@lib/utils/cn';

export function ConnectionStatus() {
  const status = useWebSocketStatus();

  const statusConfig = {
    connecting: {
      color: 'bg-yellow-500',
      text: 'Connecting...',
    },
    connected: {
      color: 'bg-green-500',
      text: 'Live',
    },
    disconnected: {
      color: 'bg-gray-400',
      text: 'Offline',
    },
    reconnecting: {
      color: 'bg-yellow-500',
      text: 'Reconnecting...',
    },
  };

  const config = statusConfig[status];

  return (
    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
      <span
        className={cn(
          'size-2 rounded-full',
          config.color,
          status === 'connecting' || status === 'reconnecting'
            ? 'animate-pulse'
            : ''
        )}
      />
      <span>{config.text}</span>
    </div>
  );
}
