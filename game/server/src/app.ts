import { WebSocketServer, WebSocket, type RawData } from "ws";
import { type GameMessage, type Players } from "@common/types/net-objects";

const port = 8080;

const players: Players = {};

class WebSocketWithId extends WebSocket {
  id = crypto.randomUUID();

  sendObject(data: GameMessage) {
    this.send(JSON.stringify(data));
  }

  parseMessage(message: string | RawData): GameMessage {
    // TODO: Should this have proper validation?
    return JSON.parse(message.toString());
  }
}

const wss = new WebSocketServer({ port, WebSocket: WebSocketWithId });

const broadcast = (message: GameMessage, deafen: string[] = []) => {
  for (const client of wss.clients) {
    if (client.readyState !== WebSocket.OPEN) continue;
    if (deafen.includes(client.id)) continue;
    client.sendObject(message);
  }
};

wss.on("connection", (ws: WebSocketWithId) => {
  ws.on("error", console.error);
  ws.on("message", (data) => {
    const message = ws.parseMessage(data);

    if (message.type === "update_player") {
      const playerData = players[ws.id];
      if (!playerData) return;
      Object.assign(playerData, message.payload);
    }
  });
  ws.on("close", () => {
    broadcast({ type: "player_leave", payload: { id: ws.id } });
    delete players[ws.id];
  });
  ws.sendObject({
    type: "welcome",
    payload: {
      id: ws.id,
      players,
    },
  });

  const newPlayerData = { x: 800, y: 450, rotation: 0, vx: 0, vy: 0 };
  players[ws.id] = newPlayerData;

  broadcast(
    {
      type: "new_player",
      payload: {
        id: ws.id,
        data: newPlayerData,
      },
    },
    [ws.id],
  );
});

setInterval(() => {
  broadcast({ type: "tick", payload: players });
}, 50);

console.log(`Listening on port ${port}`);
