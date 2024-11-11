import { Image } from "love.graphics";
import { CollisionLayer } from "../../../collisions";
import { config } from "../../../conf";
import { Actor, Damageable } from "../../../engine/actor";
import { BoxCollider2d } from "../../../engine/collision/box-collider2d";
import { Engine } from "../../../engine/engine";
import { SpriteEngine } from "../../../engine/sprite-engine";
import { AnimatedSprite } from "../../../engine/sprite/animated-sprite";
import { Rectangle, Vector2 } from "../../../engine/tools";
import { network } from "../../../scenes/network";

let image: Image;
Engine.preload(() => {
  image = love.graphics.newImage("assets/ship-missile.png");
});

export class Missile extends Actor {
  constructor(
    id: number,
    spriteEngine: SpriteEngine,
    pos: Vector2,
    parent: Actor
  ) {
    const animatedSprite = new AnimatedSprite(image, 16, 16, 0.05);
    const collider = new BoxCollider2d(
      new Rectangle(5, 5, 10, 6),
      [CollisionLayer.PLAYERS],
      [CollisionLayer.ENEMIES]
    );
    super(
      id,
      "Missile",
      spriteEngine,
      pos,
      200,
      animatedSprite,
      collider,
      parent
    );
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
        if (!network.isClient()) {
          (actor as unknown as Damageable).damage(this.parent, 100);
        }
        this.spriteEngine.removeActor(this);
      }
    }
  }
}
