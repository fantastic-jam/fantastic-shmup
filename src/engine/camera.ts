import { Vector2 } from "./tools";

export class Camera {
  constructor(
    public pos: Vector2 = new Vector2(0, 0),
    public scale: number = 1,
    public speed: number = 200
  ) {}

  set() {
    love.graphics.push();
    love.graphics.scale(this.scale);
    love.graphics.translate(-this.pos.x, -this.pos.y);
  }

  unset() {
    love.graphics.pop();
  }
}
