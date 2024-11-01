import { Actor } from "../actor";
import { Vector2 } from "../tools";

export type ColliderType = "box";

export interface Collider2d {
  getParent(): Actor;
  setParent(parent: Actor): void;
  getPos(): Vector2;
  getType(): ColliderType;
  collides(collider: Collider2d): boolean;
  colliders(colliders: Collider2d[]): Collider2d[];
}
