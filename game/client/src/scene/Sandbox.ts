import { Assets, Sprite, Texture, Ticker } from "pixi.js";
import { Scene } from "./Scene";
import { BunnyPlayer } from "../sprite/BunnyPlayer";
import { app } from "../root/app";
import { connect } from "../net/socket";

export class Sandbox extends Scene {
  private bunnyTexture!: Texture;
  private player!: BunnyPlayer;
  private playerId: string | undefined;
  private ws!: WebSocket;

  otherPlayers: Record<string, Sprite> = {};

  async load() {
    this.bunnyTexture = await Assets.load<Texture>("/assets/bunny.png");
    this.player = new BunnyPlayer(this.bunnyTexture);

    this.player.position.set(app.screen.width / 2, app.screen.height / 2);
    this.addChild(this.player);

    this.ws = connect((data) => this.onMessage(JSON.parse(data)));
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onMessage(message: any) {
    if (message.type === "id") {
      this.playerId = message.id;
      for (const playerId in message.players) {
        const playerSprite = new Sprite(this.bunnyTexture);
        playerSprite.x = message.players[playerId].x;
        playerSprite.y = message.players[playerId].y;
        playerSprite.rotation = message.players[playerId].rotation;
        playerSprite.anchor.set(0.5);
        app.stage.addChild(playerSprite);
        this.otherPlayers[playerId] = playerSprite;
      }
    }

    if (message.type === "newPlayer") {
      const playerSprite = new Sprite(this.bunnyTexture);
      playerSprite.x = 800;
      playerSprite.y = 450;
      playerSprite.anchor.set(0.5);
      app.stage.addChild(playerSprite);
      this.otherPlayers[message.id] = playerSprite;
    }

    if (message.type === "playerLeave") {
      app.stage.removeChild(this.otherPlayers[message.id]);
      this.otherPlayers[message.id].destroy();
      delete this.otherPlayers[message.id];
    }

    if (message.type === "players") {
      for (const playerId in message.players) {
        if (playerId === this.playerId || !this.otherPlayers[playerId])
          continue;

        this.otherPlayers[playerId].x = message.players[playerId].x;
        this.otherPlayers[playerId].y = message.players[playerId].y;
        this.otherPlayers[playerId].rotation =
          message.players[playerId].rotation;
      }
    }
  }

  tick(time: Ticker) {
    this.player.tick(time);

    if (this.ws.readyState === this.ws.OPEN) {
      this.ws.send(
        JSON.stringify({
          type: "position",
          x: this.player.x,
          y: this.player.y,
          rotation: this.player.rotation,
        }),
      );
    }
  }
}
