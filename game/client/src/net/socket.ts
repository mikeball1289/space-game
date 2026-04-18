export function connect(onMessage: (data: string) => void) {
  const ws = new WebSocket("ws://10.0.0.22:8080");
  ws.onerror = console.error;
  ws.onmessage = (data: MessageEvent<string>) => onMessage(data.data);
  return ws;
}
