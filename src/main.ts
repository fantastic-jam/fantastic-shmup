import "./conf";
import { SpriteEngine } from "./engine/sprite-engine";
import { Ship } from "./ship";

import { StarField } from "./world/starfield";

let spriteEngine: SpriteEngine;
let starField: StarField;

love.load = () => {
  starField = new StarField(8);
  spriteEngine = new SpriteEngine(0, 0);
  spriteEngine.addActor(new Ship(spriteEngine, 300, 200));
};

love.update = (dt) => {
  starField.update(dt);
  spriteEngine.update(dt);
};

love.draw = () => {
  starField.draw();
  spriteEngine.draw();
};
