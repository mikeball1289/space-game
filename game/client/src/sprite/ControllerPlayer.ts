import { Ticker } from "pixi.js";
import { BunnyPlayer } from "./BunnyPlayer";
import { mouse, MouseButton } from "../input/Mouse";
import { angleBetween, normalizeAngle, unitVectorFromAngle } from "../math/angle";
import { keyboard } from "../input/Keyboard";

export class ControllerPlayer extends BunnyPlayer {
  tick(time: Ticker) {
    const mousePosition = mouse.getPosition();

    const rotationAmount = 0.1 * time.deltaTime;
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
      const acceleration = unitVectorFromAngle(this.rotation).multiplyScalar(time.deltaTime * 0.25);

      this.velocity.add(acceleration, this.velocity);
    }

    super.tick(time);
  }
}
