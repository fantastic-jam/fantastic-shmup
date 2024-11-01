import { Actor } from "../../../engine/actor";
import { SpriteEngine } from "../../../engine/sprite-engine";
import { Vector2 } from "../../../engine/tools";
import { Weapon } from "../weapon";
import { Bullet } from "./bullet";

export class WeaponGun extends Actor implements Weapon {
  lastFired?: number = undefined;

  constructor(
    spriteEngine: SpriteEngine,
    pos: Vector2,
    public cooldown = 0.5,
    parent?: Actor
  ) {
    super(spriteEngine, pos, 0, undefined, undefined, parent);
  }

  fire(): void {
    if (
      !this.lastFired ||
      love.timer.getTime() > this.lastFired + this.cooldown
    ) {
      this.lastFired = love.timer.getTime();
      this.spriteEngine.addActor(
        new Bullet(this.spriteEngine, Vector2.of(this.globalPos()))
      );
    }
  }
}
