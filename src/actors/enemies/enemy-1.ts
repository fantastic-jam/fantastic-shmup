import { Image } from "love.graphics";
import { config } from "../../conf";
import { Actor } from "../../engine/actor";
import { Engine } from "../../engine/engine";
import { SpriteEngine } from "../../engine/sprite-engine";
import { AnimatedSprite } from "../../engine/sprite/animated-sprite";

let image: Image;
Engine.preload(() => {
  image = love.graphics.newImage("assets/enemy-1.png");
});

export class Enemy1 extends Actor {
  constructor(spriteEngine: SpriteEngine, pos: Vector2) {
    const animatedSprite = new AnimatedSprite(image, 40, 32, 0.1);
    super(spriteEngine, pos, 200, animatedSprite);
  }

  private getDir(): Vector2 {
    return new Vector2(-1, 0);
  }

  update(dt: number) {
    super.update(dt);
    const dir = this.getDir();

    this.pos.x += dir.x * this.speed * dt;
    this.pos.y += dir.y * this.speed * dt;

    if (this.pos.x < 0 - 40) {
      this.respawn();
    }
  }

  respawn() {
    this.pos.x = config.screenWidth;
    this.pos.y = love.math.random(config.screenHeight);
  }

  kill() {
    this.respawn();
  }

  damage(src: Actor | undefined, damage: number) {
    this.kill();
  }

  draw() {
    super.draw();
  }
}
