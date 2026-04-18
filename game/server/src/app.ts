import { WebSocketServer } from "ws";

const port = 8080;

const wss = new WebSocketServer({ port });

wss.on("connection", (ws) => {
  ws.on("error", console.error);
  ws.on("message", (data) => console.log(data.toString()));
});

setInterval(() => {
  for (const client of wss.clients) {
    if (client.readyState !== WebSocket.OPEN) continue;
    client.send("Hello there");
  }
}, 1000);

console.log(`Listening on port ${port}`);
