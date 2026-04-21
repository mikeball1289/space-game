import { Point, Ticker } from "pixi.js";
import { GameSprite } from "./GameSprite";

export class InertialSprite extends GameSprite {
  velocity = new Point();

  tick(time: Ticker): void {
    this.position.add(this.velocity.multiplyScalar(time.deltaTime), this.position);
  }
}
