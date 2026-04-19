import { Sprite, Ticker } from "pixi.js";

export abstract class GameSprite extends Sprite {
  abstract tick(time: Ticker): void;
}
