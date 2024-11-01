import { Actor } from "../../engine/actor";

export interface Weapon extends Pick<Actor, "update" | "draw"> {
  fire(): void;
}
