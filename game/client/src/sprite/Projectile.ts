import { Bullet } from "@common/game/Bullet";
import { Sprite } from "pixi.js";
import { Sandbox } from "../scene/Sandbox";
import { ProjectileData } from "@common/types/NetObjects";

export class Projectile extends Bullet<Sprite> {
  constructor(
    id: string,
    scene: Sandbox,
    public own = false,
  ) {
    super(id, new Sprite(scene.pelletTexture));
    this.sprite.anchor.set(0.5);
  }

  deserialize(data: ProjectileData, client = false): void {
    if (this.own && !client) return;
    super.deserialize(data);
  }

  tick(dSeconds: number): void {
    super.tick(dSeconds);

    this.sprite.x = this.x;
    this.sprite.y = this.y;
  }
}
