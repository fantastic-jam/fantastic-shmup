import { Actor } from "../actor"; // Adjust the import path as necessary
import { SpriteEngine } from "../sprite-engine";
import { Vector2 } from "../tools";
import { Projectile } from "./projectile"; // Adjust the import path as necessary

export class Weapon extends Actor {
  lastFired?: number = undefined;

  constructor(
    spriteEngine: SpriteEngine,
    pos: Vector2,
    public cooldown: number = 1,
    parent?: Actor
  ) {
    super(spriteEngine, pos, 0, null, parent);
  }

  fire() {
    if (
      !this.lastFired ||
      love.timer.getTime() > this.lastFired + this.cooldown
    ) {
      this.lastFired = love.timer.getTime();
      this.spriteEngine.addActor(
        new Projectile(
          this.spriteEngine,
          new Vector2(this.globalX(), this.globalY())
        )
      );
    }
  }

  update(dt: number) {
    // Update logic
  }

  draw() {
    // Draw logic
  }
}
