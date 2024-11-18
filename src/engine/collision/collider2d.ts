import { Actor } from "../actor";
import { Vector2 } from "../geometry/vector2";

export type ColliderType = "box";

export interface Collider2d {
  getParent(): Actor;
  setParent(parent: Actor): void;
  getPos(): Vector2;
  getType(): ColliderType;
  collides(collider: Collider2d): boolean;
  colliders(colliders: Collider2d[]): Collider2d[];

  /**
   * get layers this collider is on
   */
  getCollisionLayers(): readonly number[];

  /**
   * get the layers this colliders checks collisions with
   */
  getCollisionMask(): readonly number[];
}
