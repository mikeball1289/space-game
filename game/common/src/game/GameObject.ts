import { Vec2 } from "../math/vector";

export abstract class GameObject {
  public position = new Vec2();

  abstract tick(dSeconds: number): void;

  get x() {
    return this.position.x;
  }

  set x(value: number) {
    this.position.x = value;
  }

  get y() {
    return this.position.y;
  }

  set y(value: number) {
    this.position.y = value;
  }
}
