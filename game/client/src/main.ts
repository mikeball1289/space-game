import { keyboard } from "./input/Keyboard";
import { mouse } from "./input/Mouse";

import "pixi.js/math-extras";
import { app } from "./root/app";
import { Sandbox } from "./scene/Sandbox";

async function main() {
  // Initialize the application
  await app.init({
    background: "#1099bb",
    canvasOptions: {
      autoDensity: true,
    },
    width: 1600,
    height: 900,
    resolution: window.devicePixelRatio || 1,
  });

  keyboard.init();
  mouse.init(app);

  document.getElementById("pixi-container")!.appendChild(app.canvas);

  const sandbox = new Sandbox();
  await sandbox.load();
  app.stage.addChild(sandbox);

  app.ticker.add((time) => {
    sandbox.tick(time);
  });
}

window.addEventListener("load", main, { once: true });
