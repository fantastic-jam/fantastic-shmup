import { Source } from "love.audio";
import { Ship } from "./actors/ship";
import "./conf";
import { SpriteEngine } from "./engine/sprite-engine";
import { Vector2 } from "./engine/tools";

import { Screen } from "love.graphics";
import { Joystick } from "love.joystick";
import { Enemy1 } from "./actors/enemies/enemy-1";
import { config } from "./conf";
import { Camera } from "./engine/camera";
import { Engine } from "./engine/engine";
import { Input } from "./engine/input/input";
import { StarField } from "./world/starfield";

let spriteEngine: SpriteEngine;
let starField: StarField;
let music: Source;
const enemyCount = 10;
let camera;

function newEnemy() {
  spriteEngine.addActor(
    new Enemy1(
      spriteEngine,
      new Vector2(
        config.screenWidth + love.math.random(config.screenWidth),
        love.math.random(config.screenHeight)
      )
    )
  );
}

love.load = () => {
  Input.init();
  love.graphics.setDefaultFilter("nearest", "nearest");
  Engine.load();
  camera = new Camera();
  starField = new StarField(camera, 200);
  spriteEngine = new SpriteEngine();
  for (let i = 0; i < enemyCount; i++) {
    newEnemy();
  }
  music = love.audio.newSource("assets/fantastic-shmup.ogg", "stream");
  music.setLooping(true);
  music.setVolume(0.2);
  music.play();
};

const ships = new Map<Joystick, Ship>();
love.update = (dt) => {
  for (const joystick of Input.getJoysticks()) {
    if (joystick.isGamepadDown("start") && ships.get(joystick) == null) {
      const ship = new Ship(spriteEngine, new Vector2(100, 100), joystick);
      spriteEngine.addActor(ship);
      ships.set(joystick, ship);
      ship.listen("killed", () => {
        const ship = ships.get(joystick);
        if (ship) {
          spriteEngine.removeActor(ship);
          ships.delete(joystick);
        }
      });
    }
    if (joystick.isGamepadDown("back")) {
      love.event.quit(0);
    }
  }
  starField.update(dt);
  spriteEngine.update(dt);
};

love.draw = (screen?: Screen) => {
  if (screen !== "bottom") {
    starField.draw(screen);
    spriteEngine.draw(screen);
  }
};
