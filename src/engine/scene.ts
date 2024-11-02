import { Screen } from "love.graphics";

export interface Scene {
  update(dt: number): void;
  draw(screen?: Screen): void;
  unload(): void;
}
