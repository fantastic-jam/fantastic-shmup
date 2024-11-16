/* eslint-disable @typescript-eslint/no-invalid-void-type */
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

declare module "love.keyboard" {
  interface TextInputOptions {
    /**
     * @description basic, numpad, and standard1
     * @default "basic"
     */
    type?: "basic" | "numpad" | "standard";
    /**
     * @description Makes text hidden after entry
     * @default false
     */
    password?: boolean;
    /**
     * @description Text to prompt for on input
     * @default "Enter String"
     */
    hint?: string;
    /**
     * @description Maximum length of the input string
     * @default 20
     */
    length?: number;
  }

  /**
   * Enables or disables the text input.
   * @param enable Whether to enable or disable text input.
   * @param options Options for the text input.
   */
  function setTextInput(this: void, enable: boolean, options?: TextInputOptions): void;
}
