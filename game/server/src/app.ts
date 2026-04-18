import { WebSocketServer, WebSocket, type ClientOptions } from "ws";

const port = 8080;
class WebSocketWithId extends WebSocket {
  id = crypto.randomUUID();
}

const wss = new WebSocketServer({ port, WebSocket: WebSocketWithId });

wss.on("connection", (ws: WebSocketWithId) => {
  ws.on("error", console.error);
  ws.on("message", (data) => console.log(data.toString()));
  ws.send(JSON.stringify({
    type: "id",
    id: ws.id,
  }))
});

setInterval(() => {
  for (const client of wss.clients) {
    if (client.readyState !== WebSocket.OPEN) continue;
    client.send("Hello there");
  }
}, 2000);

console.log(`Listening on port ${port}`);
