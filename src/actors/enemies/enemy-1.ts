import { Image } from "love.graphics";
import { CollisionLayer } from "../../collisions";
import { config } from "../../conf";
import { Actor, Damageable } from "../../engine/actor";
import { BoxCollider2d } from "../../engine/collision/box-collider2d";
import { Engine } from "../../engine/engine";
import { SpriteEngine } from "../../engine/sprite-engine";
import { AnimatedSprite } from "../../engine/sprite/animated-sprite";
import { Rectangle, Vector2 } from "../../engine/tools";
import { GameNetEventTypes, multiplayer } from "../../scenes/multiplayer";
import { Ship } from "../ship";

let image: Image;
Engine.preload(() => {
  image = love.graphics.newImage("assets/enemy-1.png");
});

export type DeserializedEnemy1 = {
  id: number;
  pos: Vector2;
  y: number;
  randCos: number;
};

export class Enemy1 extends Actor implements Damageable {
  private maxHealth = 100;
  private health = this.maxHealth;
  private y = 0;
  private randCos = 0;
  constructor(id: number, spriteEngine: SpriteEngine, pos: Vector2) {
    const animatedSprite = new AnimatedSprite(image, 40, 32, 0.1);
    const collider = new BoxCollider2d(
      new Rectangle(0, 8, 20, 17),
      [CollisionLayer.ENEMIES],
      [CollisionLayer.PLAYERS]
    );

    super(id, "Enemy", spriteEngine, pos, 130, animatedSprite, collider);
    this.y = pos.y;
    this.randCos = love.math.random(0, 500);
  }
  isInvincible(): boolean {
    return false;
  }

  private getDir(): Vector2 {
    return new Vector2(-1, 0);
  }

  update(dt: number) {
    super.update(dt);
    const dir = this.getDir();

    this.pos.x += dir.x * this.speed * dt;
    this.pos.y = this.y + Math.cos((this.randCos + this.pos.x) / 100) * 40;

    if (this.pos.x < 0 - 40) {
      this.respawn();
    }

    // check collisions
    if (!multiplayer.network?.isClient()) {
      for (const actor of this.spriteEngine.getActors()) {
        if (
          actor.collider &&
          (actor as unknown as Damageable).isInvincible &&
          !(actor as unknown as Damageable).isInvincible() &&
          (actor as unknown as Damageable).damage &&
          this.collider?.collides(actor.collider)
        ) {
          (actor as unknown as Damageable).damage(this.parent, 100);
          this.respawn();
          if (multiplayer.network?.isServer()) {
            multiplayer.network?.sendData(GameNetEventTypes.RemoveActor, this.id.toString());
          }
        }
      }
    }
  }

  respawn() {
    this.health = this.maxHealth;
    this.pos.x = config.screenWidth;
    this.pos.y = love.math.random(config.screenHeight);
    this.y = this.pos.y;
    this.randCos = love.math.random(0, 500);
    if (multiplayer.network?.isServer()) {
      multiplayer.network?.sendData(GameNetEventTypes.SyncActor, this.serialize());
    }
  }

  kill() {
    this.respawn();
  }

  damage(src: Actor | undefined, amount: number) {
    this.health = Math.max(this.health - amount, 0);
    if (this.health === 0) {
      if ((src as unknown as Ship).score != null) {
        (src as unknown as Ship).score += 100;
      }
      this.kill();
    }
  }

  draw() {
    super.draw();
  }

  serialize(): string {
    return [
      "Enemy1",
      this.id,
      this.pos.x,
      this.pos.y,
      this.y,
      this.randCos,
    ].join("|");
  }

  deserialize(data: string | string[] | DeserializedEnemy1): void {
    const parts =
      typeof data === "string" || Array.isArray(data)
        ? Enemy1.deserialize(data)
        : data;
    this.id = parts.id;
    this.pos = parts.pos;
    this.y = parts.y;
    this.randCos = parts.randCos;
  }

  static deserialize(data: string | string[]): DeserializedEnemy1 {
    const parts = typeof data === "string" ? data.split("|") : data;
    let idx = 1;
    return {
      id: parseInt(parts[idx++]),
      pos: new Vector2(parseFloat(parts[idx++]), parseFloat(parts[idx++])),
      y: parseInt(parts[idx++]),
      randCos: parseInt(parts[idx++]),
    };
  }
}
