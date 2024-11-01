import { config } from "../conf";
import { Vector2 } from "./tools";

export class Camera {
  public scale: number;
  constructor(
    public pos: Vector2 = new Vector2(0, 0),
    scale?: number,
    public speed = 200
  ) {
    if (scale == null) {
      // automatic scale
      this.scale = Math.min(
        love.graphics.getWidth() / config.screenWidth,
        love.graphics.getHeight() / config.screenHeight
      );
    } else {
      this.scale = scale;
    }
  }

  set() {
    love.graphics.push();
    love.graphics.scale(this.scale);
    love.graphics.translate(-this.pos.x, -this.pos.y);
  }

  unset() {
    love.graphics.pop();
  }
}
