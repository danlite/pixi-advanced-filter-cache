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
  if (!window.localStorage.getItem("show-warning")) {
    alert("NOTE: Click the labels to toggle parameters.");
    window.localStorage.setItem("show-warning", "true");
  }

  // Create a new application
  const app = new Application();

  // Initialize the application
  await app.init({
    background: "#aaeeee",
    resizeTo: window,
    useBackBuffer: true,
    resolution: 2,
    autoDensity: true,
  });

  // Append the application canvas to the document body
  document.getElementById("pixi-container")!.appendChild(app.canvas);

  // BEGIN minimum working example
  const bunny = new Sprite(await Assets.load("/assets/bunny.png"));
  bunny.anchor.set(0.5);
  bunny.position.set(bunny.width, bunny.height);
  const container = new Container();
  const offset = new Point(25, 30);
  container.position.set(offset.x, offset.y);
  app.stage.addChild(container);

  const glow = new Graphics();
  glow.rect(0, 0, bunny.width * 2, bunny.height * 2);
  glow.fill({ color: 0xff0000 });

  container.addChild(bunny);
  container.addChild(glow);

  // The parameters that don't work together
  let blendMode: "overlay" | "add" = "overlay";
  let cacheAsTexture = true;
  let position: Point = offset;

  glow.blendMode = blendMode;
  container.cacheAsTexture(cacheAsTexture);
  container.position = position;
  // END minimum working example

  // For illustration purposes
  const outline = new Graphics();
  outline.rect(0, 0, bunny.width * 2, bunny.height * 2);
  outline.stroke({ color: 0x000000, width: 2 });
  container.addChild(outline);
  const backdrop = new Graphics();
  backdrop.rect(0, 0, bunny.width * 2, bunny.height * 2);
  backdrop.fill({ color: 0x00bb00 });
  container.addChildAt(backdrop, 0);

  // Add buttons and labels
  const errorText = new Text({
    text: "",
    style: {
      fill: 0xff0000,
    },
  });
  errorText.position.set(offset.x, offset.y + 400);
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
  cacheButton.position.set(offset.x, offset.y + 100);
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
  blendButton.position.set(offset.x, offset.y + 200);
  app.stage.addChild(blendButton);

  const positionButton = new Text({
    text: `position: ${position.x}, ${position.y}`,
  });
  positionButton.eventMode = "static";
  positionButton.on("pointerdown", () => {
    position = position.x === 0 ? offset : new Point(0, 0);
    container.position.set(position.x, position.y);
    positionButton.text = `position: ${position.x}, ${position.y}`;
    container.updateCacheTexture();
    updateErrorText();
  });
  positionButton.position.set(offset.x, offset.y + 300);
  app.stage.addChild(positionButton);
})();
