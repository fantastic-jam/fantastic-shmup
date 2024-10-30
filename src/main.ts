import { Source } from "love.audio";
import "./conf";
import { SpriteEngine } from "./engine/sprite-engine";
import { Vector2 } from "./engine/tools";
import { Ship } from "./ship";

import { Enemy1 } from "./actors/enemies/enemy-1";
import { StarField } from "./world/starfield";
import { config } from "./conf";
import { Camera } from "./engine/camera";
import { Screen } from "love.graphics";

let spriteEngine: SpriteEngine;
let starField: StarField;
let music: Source;
let enemyCount = 10;
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
  love.graphics.setDefaultFilter("nearest", "nearest");
  camera = new Camera();
  starField = new StarField(camera, 200);
  spriteEngine = new SpriteEngine();
  spriteEngine.addActor(new Ship(spriteEngine, new Vector2(100, 100)));
  for (let i = 0; i < enemyCount; i++) {
    newEnemy();
  }
  music = love.audio.newSource("assets/fantastic-shmup.ogg", "stream");
  music.setLooping(true);
  music.setVolume(0.2);
  music.play();
};

love.update = (dt) => {
  starField.update(dt);
  spriteEngine.update(dt);
};


love.draw = (screen?: Screen) => {
  if (screen !== "bottom") {
    starField.draw(screen);
    spriteEngine.draw(screen);
  }
};
