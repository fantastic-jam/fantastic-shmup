import { Screen } from "love.graphics";

import { config } from "./conf";
import { Engine } from "./engine/engine";
import { Scene } from "./engine/scene";
import { GameScene } from "./scenes/game";
import { MenuScene } from "./scenes/menu";

let scene: Scene;
let scale: number;
love.load = () => {
  love.graphics.setDefaultFilter("nearest", "nearest");
  // automatic scale
  scale = Math.min(
    love.graphics.getWidth() / config.screenWidth,
    love.graphics.getHeight() / config.screenHeight
  );
  Engine.load();

  const menuScene = new MenuScene();
  menuScene.listen("start", (event) => {
    event.getSource().unload();
    const players = event.getSource().getPlayers();
    scene = new GameScene(players);
  });
  scene = menuScene;
};

love.update = (dt) => {
  Engine.update(dt, (dt: number) => {
    scene?.update(dt);
  });
};

love.draw = (screen?: Screen) => {
  love.graphics.push();
  love.graphics.scale(scale);
  scene?.draw(screen);
  love.graphics.pop();
};
