import { Vector2 } from "./tools";

export class Camera {
  public scale: number;
  constructor(
    public pos: Vector2 = new Vector2(0, 0),
    scale?: number,
    public speed = 200
  ) {
    if (scale == null) {
      this.scale = 1;
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
