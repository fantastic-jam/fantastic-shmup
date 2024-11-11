import { Image } from "love.graphics";
import { CollisionLayer } from "../../../collisions";
import { config } from "../../../conf";
import { Actor, Damageable } from "../../../engine/actor";
import { BoxCollider2d } from "../../../engine/collision/box-collider2d";
import { Engine } from "../../../engine/engine";
import { SpriteEngine } from "../../../engine/sprite-engine";
import { AnimatedSprite } from "../../../engine/sprite/animated-sprite";
import { Rectangle, Vector2 } from "../../../engine/tools";
import { GameNetEventTypes, network } from "../../../scenes/network";

let image: Image;
Engine.preload(() => {
  image = love.graphics.newImage("assets/ship-missile.png");
});

export type DeserializedMissile = {
  id: number;
  pos: Vector2;
  parentId: number | undefined;
};

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
    if (network.isServer()) {
      network.sendData(GameNetEventTypes.SyncActor, this.serialize());
    }
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
          this.spriteEngine.removeActor(this);
          network.sendData(GameNetEventTypes.RemoveActor, this.id.toString());
        }
      }
    }
  }

  serialize(): string {
    return [
      "Missile",
      this.id,
      this.pos.x,
      this.pos.y,
      this.parent?.id ?? "",
    ].join("|");
  }
  deserialize(data: string | DeserializedMissile): void {
    const props = typeof data === "string" ? Missile.deserialize(data) : data;
    this.id = props.id;
    this.pos = props.pos;
    if (this.parent?.id !== props.parentId) {
      this.parent = this.spriteEngine
        .getActors()
        .find((a) => a.id === props.parentId);
    }
  }
  static deserialize(data: string | string[]): DeserializedMissile {
    const arr = typeof data === "string" ? data.split("|") : data;
    let idx = 1;
    return {
      id: parseInt(arr[idx++]),
      pos: new Vector2(parseFloat(arr[idx++]), parseFloat(arr[idx++])),
      parentId: arr[idx] == null ? undefined : parseInt(arr[idx++]),
    };
  }
}
