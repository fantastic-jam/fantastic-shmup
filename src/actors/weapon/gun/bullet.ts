import { Image } from "love.graphics";
import { CollisionLayer } from "../../../collisions";
import { config } from "../../../conf";
import { Actor, Damageable } from "../../../engine/actor";
import { BoxCollider2d } from "../../../engine/collision/box-collider2d";
import { Engine } from "../../../engine/engine";
import { SpriteEngine } from "../../../engine/sprite-engine";
import { AnimatedSprite } from "../../../engine/sprite/animated-sprite";
import { Rectangle } from "../../../engine/geometry/rectangle";
import { Vector2 } from "../../../engine/geometry/vector2";
import { GameNetEventTypes, multiplayer } from "../../../scenes/multiplayer";

let image: Image;
Engine.preload(() => {
  image = love.graphics.newImage("assets/ship-bullet.png");
});

export interface DeserializedBullet {
  id: number;
  pos: Vector2;
  parentId: number | undefined;
}

export class Bullet extends Actor {
  constructor(
    id: number,
    spriteEngine: SpriteEngine,
    pos: Vector2,
    parent: Actor
  ) {
    const animatedSprite = new AnimatedSprite(image, 7, 7, 0.05);
    const collider = new BoxCollider2d(
      new Rectangle(0, 0, 7, 7),
      [CollisionLayer.PLAYERS],
      [CollisionLayer.ENEMIES]
    );
    super(
      id,
      "Bullet",
      spriteEngine,
      pos,
      200,
      animatedSprite,
      collider,
      parent
    );
    if (multiplayer.network?.isServer()) {
      multiplayer.network?.sendData(GameNetEventTypes.SyncActor, this.serialize());
    }
  }

  update(dt: number) {
    super.update(dt);
    this.pos.x += this.speed * dt;
    if (this.pos.x > config.screenWidth) {
      this.spriteEngine.removeActor(this);
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
          (actor as unknown as Damageable).damage(this.parent, 25);
          this.spriteEngine.removeActor(this);
          if (multiplayer.network?.isServer()) {
            multiplayer.network?.sendData(GameNetEventTypes.RemoveActor, this.id.toString());
          }
        }
      }
    }
  }

  serialize(): string {
    return [
      "Bullet",
      this.id,
      this.pos.x,
      this.pos.y,
      this.parent?.id ?? "",
    ].join("|");
  }
  deserialize(data: string | DeserializedBullet): void {
    const props = typeof data === "string" ? Bullet.deserialize(data) : data;
    this.id = props.id;
    this.pos = props.pos;
    if (this.parent?.id !== props.parentId) {
      this.parent = this.spriteEngine
        .getActors()
        .find((a) => a.id === props.parentId);
    }
  }
  static deserialize(data: string | string[]): DeserializedBullet {
    const arr = typeof data === "string" ? data.split("|") : data;
    let idx = 1;
    return {
      id: parseInt(arr[idx++]),
      pos: new Vector2(parseFloat(arr[idx++]), parseFloat(arr[idx++])),
      parentId: arr[idx] == null ? undefined : parseInt(arr[idx++]),
    };
  }
}
