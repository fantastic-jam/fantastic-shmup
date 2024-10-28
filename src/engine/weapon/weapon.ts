import { Actor } from "../actor"; // Adjust the import path as necessary
import { Projectile } from "./projectile"; // Adjust the import path as necessary
import { SpriteEngine } from "../sprite-engine";

export class Weapon extends Actor {
  cooldown: number;
  lastFired?: number;

  constructor(
    spriteEngine: SpriteEngine,
    x: number,
    y: number,
    cooldown: number = 1,
    parent?: Actor
  ) {
    super(spriteEngine, x, y, 0, null, parent);
    this.cooldown = cooldown;
  }

  fire() {
    if (
      !this.lastFired ||
      love.timer.getTime() > this.lastFired + this.cooldown
    ) {
      this.lastFired = love.timer.getTime();
      this.spriteEngine.addActor(
        new Projectile(this.spriteEngine, this.globalX(), this.globalY())
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
