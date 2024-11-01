import { Image } from "love.graphics";
import { config } from "../../conf";
import { Actor } from "../actor";
import { Engine } from "../engine";
import { SpriteEngine } from "../sprite-engine";
import { AnimatedSprite } from "../sprite/animated-sprite";

let image: Image;
Engine.preload(() => {
  image = love.graphics.newImage("assets/ship-bullet.png");
});

export class Projectile extends Actor {
  constructor(spriteEngine: SpriteEngine, pos: Vector2) {
    const animatedSprite = new AnimatedSprite(image, 16, 16, 0.05);
    super(spriteEngine, pos, 200, animatedSprite);
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
        actor["kill"] &&
        Math.abs(this.pos.x - actor.pos.x) <= 20 &&
        Math.abs(this.pos.y - actor.pos.y) <= 20
      ) {
        actor["kill"]();
        this.spriteEngine.removeActor(this);
      }
    }
  }
}
