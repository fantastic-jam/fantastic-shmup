import { Actor } from "../actor";
import { Rectangle } from "../geometry/rectangle";
import { Vector2 } from "../geometry/vector2";
import { Collider2d } from "./collider2d";

function collides(a: Rectangle, b: Rectangle): boolean {
  return (
    (a.x - b.x >= 0 ? a.x - b.x <= b.w : b.x - a.x <= a.w) &&
    (a.y - b.y >= 0 ? a.y - b.y <= b.h : b.y - a.y <= a.h)
  );
}

export class BoxCollider2d implements Collider2d {
  private parent?: Actor;
  constructor(
    private readonly box: Rectangle,
    private readonly collisionLayers: readonly number[],
    private readonly collisionMask: readonly number[]
  ) {
    this.collisionLayers = collisionLayers;
    this.collisionMask = collisionMask;
  }

  getParent(): Actor {
    if (!this.parent) {
      throw new Error("No parent set");
    }
    return this.parent;
  }

  setParent(parent: Actor) {
    this.parent = parent;
  }

  getPos(): Vector2 {
    return this.getParent().pos.add(Vector2.of(this.box));
  }

  getType(): "box" {
    return "box";
  }

  getCollisionLayers(): readonly number[] {
    return this.collisionLayers;
  }
  getCollisionMask(): readonly number[] {
    return this.collisionMask;
  }

  collides(collider: Collider2d): boolean {
    if (
      !collider
        .getCollisionLayers()
        .some((layer) => this.getCollisionMask().includes(layer))
    ) {
      return false;
    }
    if (collider.getType() !== "box") {
      throw new Error(`Incompatible collider : ${collider.getType()}`);
    }
    const colliderRec = {
      ...(collider as BoxCollider2d).box,
      ...collider.getPos(),
    };
    const thisRec = { ...this.box, ...this.getPos() };
    return collides(thisRec, colliderRec);
  }
  colliders(colliders: Collider2d[]): Collider2d[] {
    return colliders.filter((c) => this.collides(c));
  }
}
