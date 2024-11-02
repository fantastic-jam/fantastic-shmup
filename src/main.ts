import { Screen } from "love.graphics";
import "./conf";

import { Scene } from "./engine/scene";
import { GameScene } from "./scenes/game";

let scene: Scene;
love.load = () => {
  love.graphics.setDefaultFilter("nearest", "nearest");
  scene = new GameScene();
};

love.update = (dt) => {
  scene?.update(dt);
};

love.draw = (screen?: Screen) => {
  scene?.draw(screen);
};
