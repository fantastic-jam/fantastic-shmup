import { Image } from "love.graphics";
import { Sprite } from "./sprite";
import { Vector2 } from "../tools";

export class SimpleSprite implements Sprite {
  image: Image;

  constructor(image: Image) {
    this.image = image;
  }

  draw(pos: Vector2) {
    love.graphics.draw(this.image, pos.x, pos.y);
  }

  update(): void {}
}
