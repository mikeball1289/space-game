import { mouse, MouseButton } from "../input/Mouse";
import { angleBetween, normalizeAngle, unitVectorFromAngle } from "@common/math/angle";
import { keyboard } from "../input/Keyboard";
import { Sandbox } from "../scene/Sandbox";
import { Spaceship } from "@common/game/Spaceship";
import { Sprite } from "pixi.js";

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

    if (mouse.isButtonDown(MouseButton.RIGHT) && this.weaponCooldown <= 0) {
      this.weaponCooldown = 1;
      this.scene.spawnProjectile(this.position, this.velocity);
    }

    const mousePosition = mouse.getPosition();

    const rotationAmount = 2 * Math.PI * dSeconds;
    const rot = angleBetween(this.position, mousePosition);
    const drot = normalizeAngle(rot - this.rotation + Math.PI);

    if (Math.abs(drot - Math.PI) < rotationAmount) {
      this.rotation = rot;
    } else if (drot > Math.PI) {
      this.rotation += rotationAmount;
    } else {
      this.rotation -= rotationAmount;
    }

    if (mouse.isButtonDown(MouseButton.LEFT) || keyboard.isKeyDown("KeyW")) {
      const acceleration = unitVectorFromAngle(this.rotation).multiplyScalar(dSeconds * 640);

      this.velocity.add(acceleration, this.velocity);
    }

    this.velocity.multiplyScalar(1 - 0.9 * dSeconds, this.velocity);

    super.tick(dSeconds);

    this.sprite.x = this.x;
    this.sprite.y = this.y;
    this.sprite.rotation = this.rotation;
  }
}
