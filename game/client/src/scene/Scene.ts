import { Container, Ticker } from "pixi.js";

export abstract class Scene extends Container {
  abstract load(): void | Promise<void>;
  abstract tick(time: Ticker): void;
}
