import { Actor } from "../../engine/actor";

export interface Weapon extends Pick<Actor, "update" | "draw"> {
  /**
   * Fires the weapon.
   * @returns Whether the weapon was fired.
   */
  fire(): boolean;
}
