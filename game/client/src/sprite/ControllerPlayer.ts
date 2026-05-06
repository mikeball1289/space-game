import { unitVectorFromAngle } from "@common/math/angle";
import { keyboard } from "../input/Keyboard";
import { Sandbox } from "../scene/Sandbox";
import { Spaceship } from "@common/game/Spaceship";
import { Sprite } from "pixi.js";

const ROTATION_SPEED = 0.7;
const FORWARD_THRUST = 240;
const REVERSE_THRUST = 160;
const MAX_SPEED = 320;

export class ControllerPlayer extends Spaceship<Sprite> {
  weaponCooldown = 0;

  constructor(private scene: Sandbox) {
    const playerSprite = new Sprite(scene.bunnyTexture);
    super(playerSprite);
    playerSprite.anchor.set(0.5);
  }

  tick(dSeconds: number) {
    if (this.weaponCooldown > 0) {
      this.weaponCooldown -= dSeconds;
    }

    if (keyboard.isKeyDown("Space") && this.weaponCooldown <= 0) {
      this.weaponCooldown = 1;
      this.scene.spawnProjectile(this.position, this.velocity);
    }
    const rotationAmount = ROTATION_SPEED * (2 * Math.PI * dSeconds);

    if (keyboard.isKeyDown("KeyA") || keyboard.isKeyDown("ArrowLeft")) {
      this.rotation -= rotationAmount;
    }

    if (keyboard.isKeyDown("KeyD") || keyboard.isKeyDown("ArrowRight")) {
      this.rotation += rotationAmount;
    }

    if (keyboard.isKeyDown("KeyW") || keyboard.isKeyDown("ArrowUp")) {
      const acceleration = unitVectorFromAngle(this.rotation).multiplyScalar(dSeconds * FORWARD_THRUST);
      this.velocity.add(acceleration, this.velocity);
    }

    if (keyboard.isKeyDown("KeyS") || keyboard.isKeyDown("ArrowDown")) {
      const acceleration = unitVectorFromAngle(this.rotation).multiplyScalar(-dSeconds * REVERSE_THRUST);
      this.velocity.add(acceleration, this.velocity);
    }

    const speed = Math.sqrt(this.velocity.abs2);
    if (speed > MAX_SPEED) {
      this.velocity.multiplyScalar(MAX_SPEED / speed, this.velocity);
    }

    super.tick(dSeconds);

    this.sprite.x = this.x;
    this.sprite.y = this.y;
    this.sprite.rotation = this.rotation;
  }
}
