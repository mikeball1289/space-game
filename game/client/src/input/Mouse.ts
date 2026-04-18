import { Application, Point, Renderer } from "pixi.js";

export const MouseButton = {
  LEFT: 0,
  MIDDLE: 1,
  RIGHT: 2,
} as const;

export type MouseButton = (typeof MouseButton)[keyof typeof MouseButton];

class Mouse {
  private position = new Point();
  private mouseButtons: Record<number, boolean> = {};

  init(app: Application<Renderer>) {
    document.addEventListener("mousemove", (event) => {
      const canvasBounds = app.canvas.getBoundingClientRect();
      const screenBounds = app.screen.getBounds();

      this.position.x =
        (event.clientX - canvasBounds.left) *
        (screenBounds.width / canvasBounds.width);

      this.position.y =
        (event.clientY - canvasBounds.top) *
        (screenBounds.height / canvasBounds.height);
    });

    document.addEventListener("mousedown", (event) => {
      this.mouseButtons[event.button] = true;
    });

    document.addEventListener("mouseup", (event) => {
      this.mouseButtons[event.button] = false;
    });

    window.addEventListener("contextmenu", (event) => {
      event.preventDefault();
    });
  }

  isButtonDown(button: MouseButton) {
    return Boolean(this.mouseButtons[button]);
  }

  getPosition(): Point {
    return this.position;
  }
}

export const mouse = new Mouse();
