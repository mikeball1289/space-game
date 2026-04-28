import type { Serial } from "../net/Serial";
import type { PlayerData } from "../types/NetObjects";
import { GAME_HEIGHT, GAME_WIDTH } from "./constants";
import { InertialObject } from "./InertialObject";

export class Spaceship<Graphics = undefined> extends InertialObject implements Serial<PlayerData> {
  public rotation: number = 0;

  constructor(public sprite: Graphics) {
    super();
  }

  serialize(): PlayerData {
    return {
      x: this.x,
      y: this.y,
      rotation: this.rotation,
      vx: this.vx,
      vy: this.vy,
    };
  }

  deserialize(data: PlayerData): void {
    this.x = data.x;
    this.y = data.y;
    this.rotation = data.rotation;
    this.vx = data.vx;
    this.vy = data.vy;
  }

  tick(dSeconds: number) {
    super.tick(dSeconds);

    if (this.x < 0) {
      this.x = 0;
      this.velocity.x *= -0.7;
    }

    if (this.x > GAME_WIDTH) {
      this.x = GAME_WIDTH;
      this.velocity.x *= -0.7;
    }

    if (this.y < 0) {
      this.y = 0;
      this.velocity.y *= -0.7;
    }

    if (this.y > GAME_HEIGHT) {
      this.y = GAME_HEIGHT;
      this.velocity.y *= -0.7;
    }
  }
}
