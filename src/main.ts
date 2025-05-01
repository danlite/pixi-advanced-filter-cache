/*
    The following error is thrown when the cacheAsTexture is true and the blendMode is overlay:
    
    GL_INVALID_VALUE : glCopyTexSubImage2D: width < 0
*/

import {
  Application,
  Assets,
  Container,
  Graphics,
  Point,
  Sprite,
  Text,
} from "pixi.js";
import "pixi.js/advanced-blend-modes";

(async () => {
  // Create a new application
  const app = new Application();

  // Initialize the application
  await app.init({
    background: "#88dddd",
    resizeTo: window,
    useBackBuffer: true,
    resolution: 2,
    autoDensity: true,
  });

  // Append the application canvas to the document body
  document.getElementById("pixi-container")!.appendChild(app.canvas);

  const container = new Container();
  const containerX = 25;
  const containerY = 30;
  app.stage.addChild(container);

  // Load the bunny texture
  const texture = await Assets.load("/assets/bunny.png");

  // The layer with the blend mode
  const glow = new Graphics();
  glow.rect(0, 0, texture.width * 2, texture.height * 2);
  glow.fill({ color: 0xff0000 });
  glow.alpha = 1;
  container.addChild(glow);

  // Create a bunny Sprite
  const bunny = new Sprite(texture);
  bunny.position.set(container.width / 2, container.height / 2);
  container.addChildAt(bunny, 0);
  bunny.anchor.set(0.5);

  // The parameters that don't work together
  let blendMode: "overlay" | "add" = "overlay";
  let cacheAsTexture = true;
  let position: Point = new Point(containerX, containerY);

  glow.blendMode = blendMode;
  container.cacheAsTexture(cacheAsTexture);
  container.position = position;

  // Add buttons and labels
  const errorText = new Text({
    text: "",
    style: {
      fill: 0xff0000,
    },
  });
  errorText.position.set(containerX, containerY + 400);
  app.stage.addChild(errorText);

  function updateErrorText() {
    if (cacheAsTexture && blendMode === "overlay" && position.x !== 0) {
      errorText.text = [
        "advanced blend modes",
        "don't work in combination with",
        "cacheAsTexture(true)",
        "unless the position is (0, 0)",
      ].join("\n");
    } else {
      errorText.text = "";
    }
  }
  updateErrorText();

  const cacheButton = new Text({
    text: cacheAsTexture ? "cacheAsTexture(true)" : "cacheAsTexture(false)",
  });
  cacheButton.eventMode = "static";
  cacheButton.on("pointerdown", () => {
    cacheAsTexture = !cacheAsTexture;
    container.cacheAsTexture(cacheAsTexture);
    cacheButton.text = cacheAsTexture
      ? "cacheAsTexture(true)"
      : "cacheAsTexture(false)";
    updateErrorText();
  });
  cacheButton.position.set(containerX, containerY + 100);
  app.stage.addChild(cacheButton);

  const blendButton = new Text({
    text: blendMode,
  });
  blendButton.eventMode = "static";
  blendButton.on("pointerdown", () => {
    blendMode = blendMode === "overlay" ? "add" : "overlay";
    glow.blendMode = blendMode;
    container.updateCacheTexture();
    blendButton.text = blendMode;
    updateErrorText();
  });
  blendButton.position.set(containerX, containerY + 200);
  app.stage.addChild(blendButton);

  const positionButton = new Text({
    text: `position: ${position.x}, ${position.y}`,
  });
  positionButton.eventMode = "static";
  positionButton.on("pointerdown", () => {
    position = position.x === 0 ? new Point(25, 30) : new Point(0, 0);
    container.position.set(position.x, position.y);
    positionButton.text = `position: ${position.x}, ${position.y}`;
    container.updateCacheTexture();
    updateErrorText();
  });
  positionButton.position.set(containerX, containerY + 300);
  app.stage.addChild(positionButton);
})();
