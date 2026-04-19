export function connect(onMessage: (data: string) => void) {
  const ws = new WebSocket("ws://localhost:8080");
  ws.onerror = console.error;
  ws.onmessage = (data: MessageEvent<string>) => onMessage(data.data);
  return ws;
}
