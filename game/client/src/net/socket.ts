import { GameMessage } from "@common/types/NetObjects";

export type WSHandle = {
  send: (data: GameMessage) => void;
  close: () => void;
  isOpen: () => boolean;
};

export function connect(onMessage: (data: GameMessage) => void): WSHandle {
  const ws = new WebSocket("ws://localhost:8080");
  ws.onerror = console.error;
  ws.onmessage = (data: MessageEvent<string>) => {
    setTimeout(() => onMessage(JSON.parse(data.data)), 150);
  };

  return {
    isOpen: () => ws.readyState === ws.OPEN,
    send: (data) => {
      if (ws.readyState === ws.OPEN) {
        ws.send(JSON.stringify(data));
      }
    },
    close: () => ws.close(),
  };
}
