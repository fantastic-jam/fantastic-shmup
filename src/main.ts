import { Screen } from "love.graphics";

import { Scene } from "./engine/scene";
import { GameScene } from "./scenes/game";
import { config } from "./conf";

let scene: Scene;
let scale: number;
love.load = () => {
  love.graphics.setDefaultFilter("nearest", "nearest");
  // automatic scale
  scale = Math.min(
    love.graphics.getWidth() / config.screenWidth,
    love.graphics.getHeight() / config.screenHeight
  );
  scene = new GameScene();
};

love.update = (dt) => {
  scene?.update(dt);
};

love.draw = (screen?: Screen) => {
  love.graphics.push();
  love.graphics.scale(scale);
  scene?.draw(screen);
  love.graphics.pop();
};
