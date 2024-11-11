import { Actor, idGenerator } from "../../../engine/actor";
import { SpriteEngine } from "../../../engine/sprite-engine";
import { Vector2 } from "../../../engine/tools";
import { network } from "../../../scenes/network";
import { Weapon } from "../weapon";
import { Bullet } from "./bullet";

export class WeaponGun extends Actor implements Weapon {
  lastFired?: number = undefined;

  constructor(
    id: number,
    spriteEngine: SpriteEngine,
    pos: Vector2,
    public cooldown = 0.5,
    parent: Actor
  ) {
    super(id, "WeaponGun", spriteEngine, pos, 0, undefined, undefined, parent);
  }

  fire(): boolean {
    if (
      this.lastFired &&
      love.timer.getTime() <= this.lastFired + this.cooldown
    ) {
      return false;
    }
    this.lastFired = love.timer.getTime();
    if (!network.isClient()) {
      this.spriteEngine.addActor(
        new Bullet(
          idGenerator.next(),
          this.spriteEngine,
          Vector2.of(this.globalPos()),
          this.parent ?? this
        )
      );
    }
    return true;
  }
}
