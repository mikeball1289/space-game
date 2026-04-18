export function connect() {
  const ws = new WebSocket("ws://localhost:8080");
  ws.onerror = console.error;
  ws.onopen = () => {
    console.log("socket connected");
    ws.send("a new client has connected");
  };
  ws.onmessage = (data: MessageEvent<unknown>) => console.log("got data", data);
}
