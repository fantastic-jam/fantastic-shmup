import { Image } from "love.graphics";
import { config } from "../../conf";
import { Actor } from "../actor";
import { BoxCollider2d } from "../collision/box-collider2d";
import { Engine } from "../engine";
import { SpriteEngine } from "../sprite-engine";
import { AnimatedSprite } from "../sprite/animated-sprite";
import { Rectangle, Vector2 } from "../tools";

let image: Image;
Engine.preload(() => {
  image = love.graphics.newImage("assets/ship-bullet.png");
});

export class Projectile extends Actor {
  constructor(spriteEngine: SpriteEngine, pos: Vector2) {
    const animatedSprite = new AnimatedSprite(image, 16, 16, 0.05);
    const collider = new BoxCollider2d(new Rectangle(5, 5, 10, 6));
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
      if (!actor.collider || (actor as any)["kill"] == undefined) continue;
      if (this.collider?.collides(actor.collider)) {
        (actor as any)["kill"]();
        this.spriteEngine.removeActor(this);
      }
    }
  }
}
