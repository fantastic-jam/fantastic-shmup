import { Screen } from "love.graphics";
import { Collider2d } from "./collision/collider2d";
import { SpriteEngine } from "./sprite-engine";
import { Sprite } from "./sprite/sprite";
import { Vector2 } from "./tools";

export class Actor {
  constructor(
    public spriteEngine: SpriteEngine,
    public pos: Vector2 = new Vector2(0, 0),
    public speed: number = 200,
    public sprite?: Sprite,
    public collider?: Collider2d,
    public parent?: Actor
  ) {
    if (collider) {
      collider.setParent(this);
    }
  }

  update(dt: number) {
    this.sprite?.update(dt);
  }

  globalPos(): Vector2 {
    return this.parent ? this.pos.add(this.parent.pos) : this.pos;
  }

  draw(screen?: Screen) {
    this.sprite?.draw(this.pos, screen);
  }
}
