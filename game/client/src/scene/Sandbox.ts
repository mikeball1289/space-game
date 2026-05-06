import { Assets, Texture, Ticker } from "pixi.js";
import { Scene } from "./Scene";
import { NetworkPlayer } from "../sprite/NetworkPlayer";
import { app } from "../root/app";
import { connect, WSHandle } from "../net/socket";
import { ControllerPlayer } from "../sprite/ControllerPlayer";
import { GameMessage, ProjectileData } from "@common/types/NetObjects";
import { Vec2 } from "@common/math/vector";
import { Projectile } from "../sprite/Projectile";

export class Sandbox extends Scene {
  public bunnyTexture!: Texture;
  public pelletTexture!: Texture;
  private player!: ControllerPlayer;
  private playerId: string | undefined;
  private ws!: WSHandle;

  otherPlayers: Record<string, NetworkPlayer> = {};
  projectiles: Record<string, Projectile> = {};

  async load() {
    this.bunnyTexture = await Assets.load({ src: "/assets/spaceship3.svg", data: { resolution: 5 } });

    this.pelletTexture = await Assets.load<Texture>("/assets/pellet.png");
    this.player = new ControllerPlayer(this);

    this.player.sprite.position.set(app.screen.width / 2, app.screen.height / 2);

    this.addChild(this.player.sprite);

    this.ws = connect((data) => this.onMessage(data));
  }

  onMessage({ type, payload }: GameMessage) {
    if (type === "welcome") {
      this.playerId = payload.id;
      for (const playerId in payload.gameState.players) {
        const playerData = payload.gameState.players[playerId];
        if (!playerData) continue;

        if (playerId === this.playerId) {
          this.player.deserialize(playerData);
        } else {
          const player = new NetworkPlayer(this);
          player.deserialize(playerData);
          this.addChild(player.sprite);
          this.otherPlayers[playerId] = player;
        }
      }
    }

    if (type === "new_player") {
      const player = new NetworkPlayer(this);
      player.deserialize(payload.data);
      this.addChild(player.sprite);
      this.otherPlayers[payload.id] = player;
    }

    if (type === "player_leave") {
      const player = this.otherPlayers[payload.id];
      delete this.otherPlayers[payload.id];
      if (!player) return;
      this.removeChild(player.sprite);
      player.sprite.destroy();
    }

    if (type === "tick") {
      for (const [playerId, playerData] of Object.entries(payload.players)) {
        if (playerId === this.playerId || !this.otherPlayers[playerId]) continue;

        this.otherPlayers[playerId].deserialize(playerData);
      }

      for (const projectile of Object.values(payload.projectiles)) {
        const p = this.projectiles[projectile.id];
        if (p) {
          p.deserialize(projectile);
        } else {
          const newProjectile = new Projectile(projectile.id, this);
          newProjectile.deserialize(projectile);
          this.projectiles[projectile.id] = newProjectile;
          this.addChild(newProjectile.sprite);
        }
      }

      for (const [projectileId, projectile] of Object.entries(this.projectiles)) {
        if (!payload.projectiles[projectileId] && !projectile.own) {
          this.removeChild(projectile.sprite);
          projectile.sprite.destroy();
          delete this.projectiles[projectileId];
        }
      }
    }

    if (type === "sync") {
      this.player.deserialize(payload);
    }
  }

  tick(time: Ticker) {
    const dSeconds = time.deltaMS / 1000;
    this.player.tick(dSeconds);
    for (const otherPlayer of Object.values(this.otherPlayers)) {
      otherPlayer.tick(dSeconds);
    }

    for (const projectile of Object.values(this.projectiles)) {
      projectile.tick(dSeconds);
    }

    this.ws.send({
      type: "update_player",
      payload: this.player.serialize(),
    });
  }

  spawnProjectile(position: Vec2, velocity: Vec2) {
    const projectileData: ProjectileData = {
      id: crypto.randomUUID(),
      x: position.x,
      y: position.y,
      vx: velocity.x,
      vy: velocity.y,
    };
    const newProjectile = new Projectile(projectileData.id, this, true);
    newProjectile.deserialize(projectileData, true);
    this.projectiles[projectileData.id] = newProjectile;
    this.addChild(newProjectile.sprite);

    this.ws.send({
      type: "shoot",
      payload: projectileData,
    });
  }
}
