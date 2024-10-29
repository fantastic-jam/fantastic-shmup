import { Actor } from "../actor"; // Adjust the import path as necessary
import { SpriteEngine } from "../sprite-engine";
import { AnimatedSprite } from "../sprite/animated-sprite";
import { Vector2 } from "../tools";

export class Projectile extends Actor {
  constructor(spriteEngine: SpriteEngine, pos: Vector2) {
    const image = love.graphics.newImage("assets/ship-bullet.png");
    const animatedSprite = new AnimatedSprite(image, 16, 16, 0.05);
    super(spriteEngine, pos, 1000, animatedSprite);
  }

  update(dt: number) {
    this.pos.x += this.speed * dt;
    if (this.pos.x > love.graphics.getWidth()) {
      this.spriteEngine.removeActor(this);
    }
  }
}
