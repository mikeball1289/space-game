import type { Serial } from "../net/Serial";
import type { ProjectileData } from "../types/NetObjects";
import { InertialObject } from "./InertialObject";

export class Bullet<Graphics = undefined> extends InertialObject implements Serial<ProjectileData> {
  constructor(
    public id: string,
    public sprite: Graphics,
  ) {
    super();
  }

  serialize(): ProjectileData {
    return {
      id: this.id,
      x: this.x,
      y: this.y,
      vx: this.vx,
      vy: this.vy,
    };
  }

  deserialize(data: ProjectileData): void {
    this.id = data.id;
    this.x = data.x;
    this.y = data.y;
    this.vx = data.vx;
    this.vy = data.vy;
  }

  tick(dSeconds: number) {
    super.tick(dSeconds);
  }
}
