import { Spaceship } from "@common/game/Spaceship";
import { interpolateAngle } from "@common/math/angle";
import { Vec2 } from "@common/math/vector";
import { MS_PER_TICK, PlayerData } from "@common/types/NetObjects";
import { Sprite } from "pixi.js";
import { Sandbox } from "../scene/Sandbox";

export class NetworkPlayer extends Spaceship<Sprite> {
  private lastUpdatedAt = Date.now();
  private apos = new Vec2();
  private arot = 0;

  constructor(scene: Sandbox) {
    const playerSprite = new Sprite(scene.bunnyTexture);
    super(playerSprite);
    playerSprite.anchor.set(0.5);
  }

  deserialize(data: PlayerData): void {
    super.deserialize(data);
    this.lastUpdatedAt = Date.now();
    this.apos = Vec2.fromPoint(this.sprite.position);
    this.arot = this.sprite.rotation;
  }

  tick(dSeconds: number): void {
    super.tick(dSeconds);
    const dt = Date.now() - this.lastUpdatedAt;
    const interpolationAmount = Math.min((dt / MS_PER_TICK) * 2, 1);
    const pos = Vec2.interpolate(this.apos, this.position, interpolationAmount);
    this.sprite.x = pos.x;
    this.sprite.y = pos.y;
    this.sprite.rotation = interpolateAngle(this.arot, this.rotation, interpolationAmount);
  }
}
