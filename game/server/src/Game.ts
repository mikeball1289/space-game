import type { Bullet } from "@common/game/Bullet";
import { GAME_HEIGHT, GAME_WIDTH } from "@common/game/constants";
import { Spaceship } from "@common/game/Spaceship";
import type { GameState, Players, Projectiles } from "@common/types/NetObjects";

export class Game {
  players: Record<string, Spaceship> = {};
  projectiles: Record<string, Bullet> = {};

  gameState: GameState = {
    players: {},
    projectiles: {},
  };

  tick(dSeconds: number) {
    const playerData: Players = {};
    const projectileData: Projectiles = {};

    for (const [id, player] of Object.entries(this.players)) {
      player.tick(dSeconds);
      playerData[id] = player.serialize();
    }

    for (const projectile of Object.values(this.projectiles)) {
      projectile.tick(dSeconds);
      projectileData[projectile.id] = projectile.serialize();
    }

    this.gameState.players = playerData;
    this.gameState.projectiles = projectileData;
  }

  addPlayer(id: string) {
    const newPlayer = new Spaceship(undefined);
    newPlayer.x = GAME_WIDTH / 2 + Math.random() * 400 - 200;
    newPlayer.y = GAME_HEIGHT / 2 + Math.random() * 400 - 200;
    this.players[id] = newPlayer;
    this.gameState.players[id] = newPlayer.serialize();
    return newPlayer;
  }
}
