import { Actor } from "../actor"; // Adjust the import path as necessary

export class Projectile extends Actor {
  constructor(spriteEngine: any, x: number, y: number) {
    super(spriteEngine, x, y, 0, null);
  }

  update(dt: number) {
    this.x += 20 * dt;
    if (this.x > love.graphics.getWidth()) {
      this.spriteEngine.removeActor(this);
    }
  }

  draw() {
    love.graphics.setColor(255, 0, 0);
    love.graphics.rectangle("fill", this.x, this.y, 1.5, 1.5);
    love.graphics.setColor(255, 255, 255);
  }
}
