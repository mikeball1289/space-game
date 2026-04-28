import { Vec2 } from "../math/vector";
import { GameObject } from "./GameObject";

export abstract class InertialObject extends GameObject {
  public velocity = new Vec2();

  tick(dSeconds: number): void {
    this.position.add(this.velocity.multiplyScalar(dSeconds), this.position);
  }

  get vx() {
    return this.velocity.x;
  }

  set vx(value: number) {
    this.velocity.x = value;
  }

  get vy() {
    return this.velocity.y;
  }

  set vy(value: number) {
    this.velocity.y = value;
  }
}
