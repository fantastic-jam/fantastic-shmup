import { SpriteEngine } from "./sprite-engine";
import { Sprite } from "./sprite/sprite";
import { Vector2 } from "./tools";

export class Actor {
  constructor(
    public spriteEngine: SpriteEngine,
    public pos: Vector2 = new Vector2(0, 0),
    public speed: number = 200,
    public sprite: Sprite,
    public parent?: Actor
  ) {}

  update(dt: number) {
    this.sprite.update(dt);
  }

  /**
   * @deprecated
   */
  globalX(): number {
    return this.pos.x + (this.parent ? this.parent.pos.x : 0);
  }

  /**
   * @deprecated
   */
  globalY(): number {
    return this.pos.y + (this.parent ? this.parent.pos.y : 0);
  }

  globalPos(): Vector2 {
    return this.parent ? this.pos.add(this.parent.pos) : this.pos;
  }

  draw() {
    this.sprite.draw(this.globalX(), this.globalY());
  }

  // translate() {
  //     love.graphics.push();
  //     love.graphics.translate(this.x, this.y);
  // }

  // endTranslate() {
  //     love.graphics.pop();
  // }
}
