import { Image } from "love.graphics";
import { CollisionLayer } from "../../collisions";
import { config } from "../../conf";
import { Actor, Damageable } from "../../engine/actor";
import { BoxCollider2d } from "../../engine/collision/box-collider2d";
import { Engine } from "../../engine/engine";
import { Rectangle } from "../../engine/geometry/rectangle";
import { Vector2 } from "../../engine/geometry/vector2";
import { SpriteEngine } from "../../engine/sprite-engine";
import { AnimatedSprite } from "../../engine/sprite/animated-sprite";
import { GameNetEventTypes, multiplayer } from "../../scenes/multiplayer";
import { Ship } from "../ship";

let image: Image;
Engine.preload(() => {
  image = love.graphics.newImage("assets/ship-bullet.png");
});

export interface DeserializedEnemyBullet {
  id: number;
  pos: Vector2;
  dir: Vector2;
}

export class EnemyBullet extends Actor {
  private dir: Vector2 = Vector2.zero();

  constructor(id: number, spriteEngine: SpriteEngine, pos: Vector2) {
    const animatedSprite = new AnimatedSprite(image, 7, 7, 0.05);
    const collider = new BoxCollider2d(
      new Rectangle(0, 4, 10, 8),
      [CollisionLayer.ENEMIES],
      [CollisionLayer.PLAYERS]
    );

    super(id, "EnemyBullet", spriteEngine, pos, 100, animatedSprite, collider);
    this.dir = this.pos
      .sub(Vector2.of({ x: 0, y: love.math.random(config.screenHeight) }))
      .normalize();
  }

  isInvincible(): boolean {
    return false;
  }

  update(dt: number) {
    super.update(dt);

    this.pos = this.pos.add(this.dir.multiply(this.speed * dt));

    // check collisions
    if (!multiplayer.network?.isClient()) {
      this.handleOutOfBounds();
      this.handleCollisionWithDamageable();
    }
  }

  /**
   * Handles out of bounds behavior.
   */
  private handleOutOfBounds() {
    if (
      this.pos.x < 0 - 8 ||
      this.pos.y < 0 - 8 ||
      //this.pos.x > config.screenWidth ||
      this.pos.y > config.screenHeight
    ) {
      this.respawn();
    }
  }

  /**
   * Handles collision with damageable actors.
   */
  private handleCollisionWithDamageable() {
    for (const actor of this.spriteEngine.getActors()) {
      if (
        actor.collider &&
        (actor as unknown as Damageable).isInvincible &&
        !(actor as unknown as Damageable).isInvincible() &&
        (actor as unknown as Damageable).damage &&
        this.collider?.collides(actor.collider)
      ) {
        (actor as unknown as Damageable).damage(this.parent, 1);
        this.respawn();
        if (multiplayer.network?.isServer()) {
          multiplayer.network?.sendData(
            GameNetEventTypes.RemoveActor,
            this.id.toString()
          );
        }
      }
    }
  }

  /**
   *
   * @returns The direction vector to a random ship.
   */
  private dirTowardsRandomShip(): Vector2 {
    const ships = this.spriteEngine
      .getActors()
      .filter(
        (actor) => actor instanceof Ship && actor.isInvincible() === false
      ) as Ship[];
    if (ships.length > 0) {
      const target = ships[love.math.random(0, ships.length - 1)];
      return target.pos.sub(this.pos).normalize();
    } else {
      // move towards random position at x = 0
      const randomPosition = Vector2.of({
        x: 0,
        y: love.math.random(0, config.screenHeight),
      });
      return randomPosition.sub(this.pos).normalize();
    }
  }

  respawn() {
    this.pos.x = config.screenWidth + love.math.random(config.screenWidth);
    this.pos.y = love.math.random(config.screenHeight);
    this.dir = this.dirTowardsRandomShip();
    if (multiplayer.network?.isServer()) {
      multiplayer.network?.sendData(
        GameNetEventTypes.SyncActor,
        this.serialize()
      );
    }
  }

  draw() {
    love.graphics.setColor(1, 0, 0.4, 0.8);
    super.draw();
    love.graphics.setColor(1, 1, 1, 1);
  }

  serialize(): string {
    return [
      "Enemy1",
      this.id,
      this.pos.x,
      this.pos.y,
      this.dir?.x ?? 0,
      this.dir?.y ?? 0,
    ].join("|");
  }

  deserialize(data: string | string[] | DeserializedEnemyBullet): void {
    const parts =
      typeof data === "string" || Array.isArray(data)
        ? EnemyBullet.deserialize(data)
        : data;
    this.id = parts.id;
    this.pos = parts.pos;
    this.dir = parts.dir;
  }

  static deserialize(data: string | string[]): DeserializedEnemyBullet {
    const parts = typeof data === "string" ? data.split("|") : data;
    let idx = 1;
    return {
      id: parseInt(parts[idx++]),
      pos: new Vector2(parseFloat(parts[idx++]), parseFloat(parts[idx++])),
      dir: new Vector2(parseFloat(parts[idx++]), parseFloat(parts[idx++])),
    };
  }
}
