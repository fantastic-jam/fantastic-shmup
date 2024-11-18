import { Image } from "love.graphics";
import { Vector2 } from "../geometry/vector2";
import { Sprite } from "./sprite";

export class SimpleSprite implements Sprite {
  constructor(private image: Image) {
    this.image = image;
  }
  getWidth(): number {
    return this.image.getWidth();
  }
  getHeight(): number {
    return this.image.getHeight();
  }

  draw(pos: Vector2) {
    love.graphics.draw(this.image, pos.x, pos.y);
  }

  update(): void {
    // do nothing
  }
}
