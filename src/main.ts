import { Screen } from "love.graphics";

import { config } from "./conf";
import { Engine } from "./engine/engine";
import { Scene } from "./engine/scene";
import { GameScene } from "./scenes/game";
import { StartScreenScene } from "./scenes/start-screen/start-screen";
import { Input } from "./engine/input/input";

import * as urutora from "urutora";
import { GamepadButton, Joystick } from "love.joystick";
import { u } from "./gui";

function initGui(u: urutora.Urutora, scale: number) {
    u.setDimensions(0, 0, scale, scale);
  const proggyTiny = love.graphics.newFont(
    "/assets/fonts/proggy/ProggyTiny.ttf",
    16
  );
  u.setDefaultFont(proggyTiny);
  love.graphics.setFont(proggyTiny);

  love.mousepressed = (x: number, y: number, button: number) =>
    u.pressed(x, y, button);
  love.mousemoved = (x: number, y: number, dx: number, dy: number) =>
    u.moved(x, y, dx, dy);
  love.mousereleased = (x: number, y: number, _button: number) =>
    u.released(x, y);
  love.textinput = (text: string) => u.textinput(text);
  Input.keyboardEmitter.listen("keypressed", (event) => {
    const [k, scancode, isrepeat] = event.getSource();
    u.keypressed(k, scancode, isrepeat!);
  });
  love.wheelmoved = (x: number, y: number) => u.wheelmoved(x, y);
  love.gamepadpressed = ((cb) => {
    return function (j: Joystick, b: GamepadButton) {
      if (cb) {
        cb(j, b);
      }
    };
  })(love.gamepadpressed);
}

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
  initGui(u, scale);

  const startScreenScene = new StartScreenScene();
  startScreenScene.listen("start", (event) => {
    event.getSource().unload();
    const players = event.getSource().getPlayers();
    scene = new GameScene(players);
  });
  scene = startScreenScene;
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
