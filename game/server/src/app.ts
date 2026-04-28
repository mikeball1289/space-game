import { WebSocketServer, WebSocket, type RawData } from "ws";
import { MS_PER_TICK, type GameMessage, type PlayerData } from "@common/types/NetObjects";
import { Spaceship } from "@common/game/Spaceship";
import { Vec2 } from "@common/math/vector";
import { Game } from "./Game";
import { Bullet } from "@common/game/Bullet";

const _CLIENT_LENIENCE = MS_PER_TICK / 500;
const CLIENT_LENIENCE_2 = (MS_PER_TICK / 500) ** 2;
const port = 8080;

const game = new Game();

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

function playerMovementConflict(player: Spaceship, playerData: PlayerData) {
  const speedSquared = new Vec2(playerData.vx, playerData.vy).abs2;
  const dPosSquared = player.position.add(new Vec2(playerData.x, playerData.y).multiplyScalar(-1)).abs2;

  if (speedSquared * CLIENT_LENIENCE_2 < dPosSquared) return true;

  return false;
}

wss.on("connection", (ws: WebSocketWithId) => {
  ws.on("error", console.error);
  ws.on("message", (data) => {
    const message = ws.parseMessage(data);

    if (message.type === "update_player") {
      const playerData = game.players[ws.id];
      if (!playerData) return;
      if (playerMovementConflict(playerData, message.payload)) {
        ws.sendObject({
          type: "sync",
          payload: playerData.serialize(),
        });
      } else {
        playerData.deserialize(message.payload);
      }
    }

    if (message.type === "shoot") {
      const projectile = new Bullet(message.payload.id, undefined);
      projectile.deserialize(message.payload);
      game.projectiles[projectile.id] = projectile;
    }
  });
  ws.on("close", () => {
    broadcast({ type: "player_leave", payload: { id: ws.id } });
    delete game.players[ws.id];
  });

  const newPlayer = game.addPlayer(ws.id);

  ws.sendObject({
    type: "welcome",
    payload: {
      id: ws.id,
      gameState: game.gameState,
    },
  });

  broadcast(
    {
      type: "new_player",
      payload: {
        id: ws.id,
        data: newPlayer.serialize(),
      },
    },
    [ws.id],
  );
});

setInterval(() => {
  game.tick(MS_PER_TICK / 1000);

  broadcast({
    type: "tick",
    payload: game.gameState,
  });
}, MS_PER_TICK);

console.log(`Listening on port ${port}`);
