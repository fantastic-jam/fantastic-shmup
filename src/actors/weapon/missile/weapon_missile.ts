import { Actor, idGenerator } from "../../../engine/actor";
import { SpriteEngine } from "../../../engine/sprite-engine";
import { Vector2 } from "../../../engine/tools";
import { multiplayer } from "../../../scenes/multiplayer";
import { Weapon } from "../weapon";
import { Missile } from "./missile";

export class WeaponMissile extends Actor implements Weapon {
  lastFired?: number = undefined;

  constructor(
    id: number,
    spriteEngine: SpriteEngine,
    pos: Vector2,
    public cooldown = 3,
    parent: Actor
  ) {
    super(
      id,
      "WeaponMissile",
      spriteEngine,
      pos,
      0,
      undefined,
      undefined,
      parent
    );
  }

  fire(): boolean {
    if (
      this.lastFired &&
      love.timer.getTime() <= this.lastFired + this.cooldown
    ) {
      return false;
    }
    this.lastFired = love.timer.getTime();
    if (!multiplayer.network?.isClient()) {
      this.spriteEngine.addActor(
        new Missile(
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
