import { Screen } from "love.graphics";
import { Collider2d } from "./collision/collider2d";
import { SpriteEngine } from "./sprite-engine";
import { Sprite } from "./sprite/sprite";
import { Vector2 } from "./tools";

export interface Damageable {
  isInvincible(): boolean;
  damage(src: Actor | undefined, amount: number): void;
}

export const idGenerator = {
  currentValue: 0,
  next() {
    return this.currentValue++;
  },
};

export class Actor {
  constructor(
    public id: number,
    private type: string,
    public spriteEngine: SpriteEngine,
    public pos: Vector2 = new Vector2(0, 0),
    public speed = 200,
    public sprite?: Sprite,
    public collider?: Collider2d,
    public parent?: Actor
  ) {
    if (collider) {
      collider.setParent(this);
    }
  }

  getType(): string {
    return this.type;
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

  serialize?(): string;
  deserialize?(data: string): void;
}
