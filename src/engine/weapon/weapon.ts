import { Actor } from "../actor";
import { SpriteEngine } from "../sprite-engine";
import { Vector2 } from "../tools";
import { Projectile } from "./projectile";

export class Weapon extends Actor {
  lastFired?: number = undefined;

  constructor(
    spriteEngine: SpriteEngine,
    pos: Vector2,
    public cooldown: number = 1,
    parent?: Actor
  ) {
    super(spriteEngine, pos, 0, undefined, undefined, parent);
  }

  fire() {
    if (
      !this.lastFired ||
      love.timer.getTime() > this.lastFired + this.cooldown
    ) {
      this.lastFired = love.timer.getTime();
      this.spriteEngine.addActor(
        new Projectile(this.spriteEngine, Vector2.of(this.globalPos()))
      );
    }
  }

  update(dt: number) {}

  draw() {}
}
