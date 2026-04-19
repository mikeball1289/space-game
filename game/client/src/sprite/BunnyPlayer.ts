import { Point, Texture, Ticker } from "pixi.js";
import { GameSprite } from "./GameSprite";
import { mouse, MouseButton } from "../input/Mouse";
import {
  angleBetween,
  normalizeAngle,
  unitVectorFromAngle,
} from "../math/angle";
import { keyboard } from "../input/Keyboard";
import { app } from "../root/app";

export class BunnyPlayer extends GameSprite {
  velocity = new Point();

  constructor(playerTexture: Texture) {
    super(playerTexture);
    this.anchor.set(0.5);
  }

  tick(time: Ticker): void {
    const mousePosition = mouse.getPosition();

    const rot = angleBetween(this.position, mousePosition);
    const rotationAmount = 0.1 * time.deltaTime;

    const drot = normalizeAngle(rot - this.rotation + Math.PI);

    if (Math.abs(drot - Math.PI) < rotationAmount) {
      this.rotation = rot;
    } else if (drot > Math.PI) {
      this.rotation += rotationAmount;
    } else {
      this.rotation -= rotationAmount;
    }

    if (mouse.isButtonDown(MouseButton.LEFT) || keyboard.isKeyDown("KeyW")) {
      const acceleration = unitVectorFromAngle(this.rotation).multiplyScalar(
        time.deltaTime * 0.25,
      );

      this.velocity.add(acceleration, this.velocity);
    }

    this.position.add(
      this.velocity.multiplyScalar(time.deltaTime),
      this.position,
    );

    if (this.x < 0) {
      this.x = 0;
      this.velocity.x *= -0.7;
    }

    if (this.x > app.screen.width) {
      this.x = app.screen.width;
      this.velocity.x *= -0.7;
    }

    if (this.y < 0) {
      this.y = 0;
      this.velocity.y *= -0.7;
    }

    if (this.y > app.screen.height) {
      this.y = app.screen.height;
      this.velocity.y *= -0.7;
    }
  }
}
