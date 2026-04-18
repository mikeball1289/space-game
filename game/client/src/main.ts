import { Application, Assets, Sprite } from "pixi.js";
import { connect } from "./net/socket";
import { keyboard } from "./input/Keyboard";

(async () => {
  // Create a new application
  const app = new Application();
  keyboard.init();

  // Initialize the application
  await app.init({
    background: "#1099bb",
    canvasOptions: {
      autoDensity: true,
    },
    width: 1600,
    height: 900,
  });

  document.getElementById("pixi-container")!.appendChild(app.canvas);
  const texture = await Assets.load("/assets/bunny.png");

  const bunny = new Sprite(texture);
  bunny.anchor.set(0.5);
  bunny.position.set(app.screen.width / 2, app.screen.height / 2);
  app.stage.addChild(bunny);

  app.ticker.add((time) => {
    bunny.rotation += 0.1 * time.deltaTime;
    if (keyboard.isKeyDown("Space")) {
      console.log("spacebar held");
    }
  });

  connect();
})();
