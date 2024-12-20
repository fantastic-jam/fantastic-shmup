import { Screen } from "love.graphics";
import { Vector2 } from "../tools";

export interface Sprite {
  update(dt: number): void;
  draw(pos: Vector2, screen?: Screen): void;
  getWidth():number;
  getHeight():number;
}
