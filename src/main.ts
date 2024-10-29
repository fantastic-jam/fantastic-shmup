import "./conf";
import { SpriteEngine } from "./engine/sprite-engine";
import { Vector2 } from "./engine/tools";
import { Ship } from "./ship";

import { StarField } from "./world/starfield";

let spriteEngine: SpriteEngine;
let starField: StarField;

love.load = () => {
  starField = new StarField(4, 300);
  spriteEngine = new SpriteEngine();
  spriteEngine.addActor(new Ship(spriteEngine, new Vector2(300, 200)));
};

love.update = (dt) => {
  starField.update(dt);
  spriteEngine.update(dt);
};

love.draw = () => {
  starField.draw();
  spriteEngine.draw();
};
