import { Assets, Texture, Ticker } from "pixi.js";
import { Scene } from "./Scene";
import { BunnyPlayer } from "../sprite/BunnyPlayer";
import { app } from "../root/app";
import { connect, WSHandle } from "../net/socket";
import { ControllerPlayer } from "../sprite/ControllerPlayer";
import { GameMessage } from "@common/types/net-objects";

export class Sandbox extends Scene {
  private bunnyTexture!: Texture;
  private player!: ControllerPlayer;
  private playerId: string | undefined;
  private ws!: WSHandle;

  otherPlayers: Record<string, BunnyPlayer> = {};

  async load() {
    this.bunnyTexture = await Assets.load<Texture>("/assets/bunny.png");
    this.player = new ControllerPlayer(this.bunnyTexture);

    this.player.position.set(app.screen.width / 2, app.screen.height / 2);
    this.addChild(this.player);

    this.ws = connect((data) => this.onMessage(data));
  }

  onMessage({ type, payload }: GameMessage) {
    if (type === "welcome") {
      this.playerId = payload.id;
      for (const playerId in payload.players) {
        const playerSprite = new BunnyPlayer(this.bunnyTexture);
        const playerData = payload.players[playerId];
        if (!playerData) continue;
        playerSprite.deserialize(playerData);
        app.stage.addChild(playerSprite);
        this.otherPlayers[playerId] = playerSprite;
      }
    }

    if (type === "new_player") {
      const playerSprite = new BunnyPlayer(this.bunnyTexture);
      playerSprite.deserialize(payload.data);
      app.stage.addChild(playerSprite);
      this.otherPlayers[payload.id] = playerSprite;
    }

    if (type === "player_leave") {
      const playerSprite = this.otherPlayers[payload.id];
      delete this.otherPlayers[payload.id];
      if (!playerSprite) return;
      app.stage.removeChild(playerSprite);
      playerSprite.destroy();
    }

    if (type === "tick") {
      for (const [playerId, playerData] of Object.entries(payload)) {
        console.log(playerId, playerData);
        if (playerId === this.playerId || !this.otherPlayers[playerId]) continue;

        this.otherPlayers[playerId].deserialize(playerData);
      }
    }
  }

  tick(time: Ticker) {
    this.player.tick(time);
    for (const otherPlayer of Object.values(this.otherPlayers)) {
      otherPlayer.tick(time);
    }

    this.ws.send({
      type: "update_player",
      payload: this.player.serialize(),
    });
  }
}
