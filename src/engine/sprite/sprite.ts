import { Screen } from "love.graphics";
import { Vector2 } from "../geometry/vector2";

export interface Sprite {
  update(dt: number): void;
  draw(pos: Vector2, screen?: Screen): void;
  getWidth():number;
  getHeight():number;
}
