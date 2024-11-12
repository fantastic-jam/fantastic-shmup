import { Screen } from "love.graphics";

declare global {
  /**
   * @noSelf
   */
  interface Handlers {
    draw?: (screen?: Screen) => void;
  }
}

declare module "love" {
  /**
   * @noSelf 
   */
  function draw(screen?: Screen): void;
  const _console: "3DS" | "Switch" | "WiiU" | undefined;
}

declare module "love.graphics" {
  type Screen = "top" | "left" | "right" | "bottom";
  /**
   * This will return the 3D slider’s current value, which is in the range of zero to one.
   * Stereoscopic depth is only for Nintendo 3DS. This function will always return zero on Nintendo 2DS family systems or other consoles.
   */
  const getDepth: (() => number) | undefined;
}
