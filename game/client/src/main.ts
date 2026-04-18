import { Application, Assets, Point, Sprite } from "pixi.js";
import { connect } from "./net/socket";
import { keyboard } from "./input/Keyboard";
import { mouse, MouseButton } from "./input/Mouse";
import {
  angleBetween,
  normalizeAngle,
  unitVectorFromAngle,
} from "./math/angle";

import "pixi.js/math-extras";

(async () => {
  // Create a new application
  const app = new Application();

  // Initialize the application
  await app.init({
    background: "#1099bb",
    canvasOptions: {
      autoDensity: true,
    },
    width: 1600,
    height: 900,
  });

  keyboard.init();
  mouse.init(app);

  document.getElementById("pixi-container")!.appendChild(app.canvas);
  const texture = await Assets.load("/assets/bunny.png");

  const bunny = new Sprite(texture);
  bunny.anchor.set(0.5);
  bunny.position.set(app.screen.width / 2, app.screen.height / 2);
  app.stage.addChild(bunny);

  const bunnyVelocity = new Point();

  const otherPlayers: Record<string, Sprite> = {};
  let myId: string | undefined = undefined;

  const ws = connect((data) => {
    const message = JSON.parse(data);

    if (message.type === "id") {
      myId = message.id;
      for (const playerId in message.players) {
        const playerSprite = new Sprite(texture);
        playerSprite.x = message.players[playerId].x;
        playerSprite.y = message.players[playerId].y;
        playerSprite.rotation = message.players[playerId].rotation;
        playerSprite.anchor.set(0.5);
        app.stage.addChild(playerSprite);
        otherPlayers[playerId] = playerSprite;
      }
    }

    if (message.type === "newPlayer") {
      const playerSprite = new Sprite(texture);
      playerSprite.x = 800;
      playerSprite.y = 450;
      playerSprite.anchor.set(0.5);
      app.stage.addChild(playerSprite);
      otherPlayers[message.id] = playerSprite;
    }

    if (message.type === "playerLeave") {
      app.stage.removeChild(otherPlayers[message.id]);
      otherPlayers[message.id].destroy();
      delete otherPlayers[message.id];
    }

    if (message.type === "players") {
      for (const playerId in message.players) {
        if (playerId === myId) continue;

        otherPlayers[playerId].x = message.players[playerId].x;
        otherPlayers[playerId].y = message.players[playerId].y;
        otherPlayers[playerId].rotation = message.players[playerId].rotation;
      }
    }
  });

  app.ticker.add((time) => {
    const mousePosition = mouse.getPosition();

    const rot = angleBetween(bunny.position, mousePosition);
    const rotationAmount = 0.1 * time.deltaTime;

    const drot = normalizeAngle(rot - bunny.rotation + Math.PI);

    if (Math.abs(drot - Math.PI) < rotationAmount) {
      bunny.rotation = rot;
    } else if (drot > Math.PI) {
      bunny.rotation += rotationAmount;
    } else {
      bunny.rotation -= rotationAmount;
    }

    if (mouse.isButtonDown(MouseButton.LEFT) || keyboard.isKeyDown("KeyW")) {
      const acceleration = unitVectorFromAngle(bunny.rotation).multiplyScalar(
        time.deltaTime * 0.25,
      );

      bunnyVelocity.add(acceleration, bunnyVelocity);
    }

    bunny.position.add(
      bunnyVelocity.multiplyScalar(time.deltaTime),
      bunny.position,
    );

    if (bunny.x < 0) {
      bunny.x = 0;
      bunnyVelocity.x *= -0.7;
    }

    if (bunny.x > app.screen.width) {
      bunny.x = app.screen.width;
      bunnyVelocity.x *= -0.7;
    }

    if (bunny.y < 0) {
      bunny.y = 0;
      bunnyVelocity.y *= -0.7;
    }

    if (bunny.y > app.screen.height) {
      bunny.y = app.screen.height;
      bunnyVelocity.y *= -0.7;
    }

    if (ws.readyState === ws.OPEN) {
      ws.send(
        JSON.stringify({
          type: "position",
          x: bunny.x,
          y: bunny.y,
          rotation: bunny.rotation,
        }),
      );
    }
  });
})();
