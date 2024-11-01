import { Image } from "love.graphics";
import { config } from "../../../conf";
import { Actor, Damageable } from "../../../engine/actor";
import { BoxCollider2d } from "../../../engine/collision/box-collider2d";
import { Engine } from "../../../engine/engine";
import { SpriteEngine } from "../../../engine/sprite-engine";
import { AnimatedSprite } from "../../../engine/sprite/animated-sprite";
import { Rectangle, Vector2 } from "../../../engine/tools";

let image: Image;
Engine.preload(() => {
  image = love.graphics.newImage("assets/ship-bullet.png");
});

export class Bullet extends Actor {
  constructor(spriteEngine: SpriteEngine, pos: Vector2) {
    const animatedSprite = new AnimatedSprite(image, 7, 7, 0.05);
    const collider = new BoxCollider2d(new Rectangle(0, 0, 7, 7));
    super(spriteEngine, pos, 200, animatedSprite, collider);
  }

  update(dt: number) {
    super.update(dt);
    this.pos.x += this.speed * dt;
    if (this.pos.x > config.screenWidth) {
      this.spriteEngine.removeActor(this);
    }

    // check collisions
    for (const actor of this.spriteEngine.getActors()) {
      if (
        actor.collider &&
        (actor as unknown as Damageable).damage &&
        this.collider?.collides(actor.collider)
      ) {
        (actor as unknown as Damageable).damage(this, 20);
        this.spriteEngine.removeActor(this);
      }
    }
  }
}
