import { Image } from "love.graphics";
import { config } from "../../conf";
import { Actor, Damageable } from "../../engine/actor";
import { BoxCollider2d } from "../../engine/collision/box-collider2d";
import { Engine } from "../../engine/engine";
import { SpriteEngine } from "../../engine/sprite-engine";
import { AnimatedSprite } from "../../engine/sprite/animated-sprite";
import { Rectangle, Vector2 } from "../../engine/tools";

let image: Image;
Engine.preload(() => {
  image = love.graphics.newImage("assets/enemy-1.png");
});

export class Enemy1 extends Actor implements Damageable {
  private maxHealth = 100;
  private health = this.maxHealth;
  private y = 0;
  private randCos = 0;
  constructor(spriteEngine: SpriteEngine, pos: Vector2) {
    const animatedSprite = new AnimatedSprite(image, 40, 32, 0.1);
    const collider = new BoxCollider2d(new Rectangle(0, 8, 20, 17));
    
    super("Enemy", spriteEngine, pos, 200, animatedSprite, collider);
    this.y = pos.y;
    this.randCos = love.math.random(0, 500);
  }

  private getDir(): Vector2 {
    return new Vector2(-1, 0);
  }

  update(dt: number) {
    super.update(dt);
    const dir = this.getDir();

    this.pos.x += dir.x * this.speed * dt;
    this.pos.y = this.y + (Math.cos((this.randCos + this.pos.x) / 100) * 40);

    if (this.pos.x < 0 - 40) {
      this.respawn();
    }

    // check collisions
    for (const actor of this.spriteEngine.getActors()) {
      if (
        actor.collider &&
        (actor as unknown as Damageable).damage &&
        actor.getType() === "Ship" &&
        this.collider?.collides(actor.collider)
      ) {
        (actor as unknown as Damageable).damage(this, 20);
        this.respawn();
      }
    }
  }

  respawn() {
    this.health = this.maxHealth;
    this.pos.x = config.screenWidth;
    this.pos.y = love.math.random(config.screenHeight);
    this.y = this.pos.y;
    this.randCos = love.math.random(0, 500);
  }

  kill() {
    this.respawn();
  }

  damage(_src: Actor | undefined, amount: number) {
    this.health = Math.max(this.health - amount, 0);
    if (this.health === 0) {
      this.kill();
    }
  }

  draw() {
    super.draw();
  }
}
