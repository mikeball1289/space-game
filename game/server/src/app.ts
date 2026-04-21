import { WebSocketServer, WebSocket } from "ws";

const port = 8080;

interface Player {
  x: number;
  y: number;
  rotation: number;
  vx: number;
  vy: number;
}

const players: Record<string, Player> = {};

class WebSocketWithId extends WebSocket {
  id = crypto.randomUUID();
}

const wss = new WebSocketServer({ port, WebSocket: WebSocketWithId });

const broadcast = (message: string, deafen: string[] = []) => {
  for (const client of wss.clients) {
    if (client.readyState !== WebSocket.OPEN) continue;
    if (deafen.includes(client.id)) continue;
    client.send(message);
  }
};

wss.on("connection", (ws: WebSocketWithId) => {
  ws.on("error", console.error);
  ws.on("message", (data) => {
    const message = JSON.parse(data.toString());

    if (message.type === "position") {
      const { type: _type, ...data } = message;
      Object.assign(players[ws.id], data);
    }
  });
  ws.on("close", () => {
    broadcast(JSON.stringify({ type: "playerLeave", id: ws.id }));
    delete players[ws.id];
  });
  ws.send(
    JSON.stringify({
      type: "id",
      id: ws.id,
      players,
    }),
  );

  players[ws.id] = { x: 800, y: 450, rotation: 0, vx: 0, vy: 0 };

  broadcast(
    JSON.stringify({
      type: "newPlayer",
      id: ws.id,
    }),
    [ws.id],
  );
});

setInterval(() => {
  broadcast(JSON.stringify({ type: "players", players }));
}, 50);

console.log(`Listening on port ${port}`);
