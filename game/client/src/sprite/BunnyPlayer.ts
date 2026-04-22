import { Point, Texture, Ticker } from "pixi.js";
import { app } from "../root/app";
import { InertialSprite } from "./InertialSprite";
import { Serial } from "../net/Serial";
import { PlayerData } from "@common/types/net-objects";

export class BunnyPlayer extends InertialSprite implements Serial<PlayerData> {
  velocity = new Point();

  constructor(playerTexture: Texture) {
    super(playerTexture);
    this.anchor.set(0.5);
  }

  serialize(): PlayerData {
    return {
      x: this.x,
      y: this.y,
      rotation: this.rotation,
      vx: this.velocity.x,
      vy: this.velocity.y,
    };
  }

  deserialize(data: PlayerData): void {
    this.x = data.x;
    this.y = data.y;
    this.rotation = data.rotation;
    this.velocity.x = data.vx;
    this.velocity.y = data.vy;
  }

  tick(time: Ticker): void {
    super.tick(time);

    if (this.x < 0) {
      this.x = 0;
      this.velocity.x *= -0.7;
    }

    if (this.x > app.screen.width) {
      this.x = app.screen.width;
      this.velocity.x *= -0.7;
    }

    if (this.y < 0) {
      this.y = 0;
      this.velocity.y *= -0.7;
    }

    if (this.y > app.screen.height) {
      this.y = app.screen.height;
      this.velocity.y *= -0.7;
    }
  }
}
