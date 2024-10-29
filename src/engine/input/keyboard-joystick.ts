import { Types } from "love";
import {
  GamepadAxis,
  GamepadButton,
  Joystick,
  JoystickHat,
  JoystickInputType,
} from "love.joystick";
import { Scancode } from "love.keyboard";

export class KeyboardJoystick implements Joystick {
  private static mapping: Record<GamepadButton, Scancode> = {
    a: "space",
    b: "g",
    back: "space",
    dpdown: "down",
    dpleft: "left",
    dpright: "right",
    dpup: "up",
    guide: "f1",
    leftshoulder: "q",
    leftstick: "z",
    rightshoulder: "e",
    rightstick: "c",
    start: "return",
    x: "t",
    y: "f",
  };
  getAxes(): LuaMultiReturn<number[]> {
    throw new Error("Method not implemented.");
  }
  getAxis(axis: number): number {
    throw new Error("Method not implemented.");
  }
  getAxisCount(): number {
    throw new Error("Method not implemented.");
  }
  getButtonCount(): number {
    throw new Error("Method not implemented.");
  }
  getDeviceInfo(): LuaMultiReturn<
    [vendorID: number, productID: number, productVersion: number]
  > {
    throw new Error("Method not implemented.");
  }
  getGUID(): string {
    return "{cf6b8ee3-dec9-4122-93cc-e7b1ca46b008}";
  }
  getGamepadMappingString(): string | undefined {
    throw new Error("Method not implemented.");
  }
  getGamepadAxis(axis: GamepadAxis): number {
    let result = 0;
    switch (axis) {
      case "leftx":
        result += love.keyboard.isScancodeDown("a") ? -1 : 0;
        result += love.keyboard.isScancodeDown("d") ? 1 : 0;
        break;
      case "lefty":
        result += love.keyboard.isScancodeDown("w") ? 1 : 0;
        result += love.keyboard.isScancodeDown("s") ? -1 : 0;
        break;
      case "rightx":
        result += love.keyboard.isScancodeDown("k") ? -1 : 0;
        result += love.keyboard.isScancodeDown(";") ? 1 : 0;
        break;
      case "righty":
        result += love.keyboard.isScancodeDown("o") ? 1 : 0;
        result += love.keyboard.isScancodeDown("l") ? -1 : 0;
        break;
      case "triggerright":
        result += love.keyboard.isScancodeDown("1") ? 1 : 0;
        break;
      case "triggerright":
        result += love.keyboard.isScancodeDown("3") ? 1 : 0;
        break;
    }
    return result;
  }
  getGamepadMapping(
    axisOrButton: GamepadAxis | GamepadButton
  ): LuaMultiReturn<
    [
      inputType: JoystickInputType,
      inputIndex: number,
      hatDirection?: JoystickHat
    ]
  > {
    throw new Error("Method not implemented.");
  }
  getHat(hat: number): JoystickHat {
    throw new Error("Method not implemented.");
  }
  getHatCount(): number {
    return 0;
  }
  getID(): LuaMultiReturn<[id: number, instanceId?: number]> {
    throw new Error("Method not implemented.");
  }
  getName(): string {
    return "keyboard";
  }
  getVibration(): LuaMultiReturn<[left: number, right: number]> {
    throw new Error("Method not implemented.");
  }
  isConnected(): boolean {
    throw new Error("Method not implemented.");
  }
  isDown(...vararg: Array<number>): boolean {
    throw new Error("Method not implemented.");
  }
  isGamepad(): boolean {
    return false;
  }
  isGamepadDown(...vararg: Array<GamepadButton>): boolean {
    return vararg.some((button) =>
      love.keyboard.isScancodeDown(KeyboardJoystick.mapping[button])
    );
  }
  isVibrationSupported(): boolean {
    throw new Error("Method not implemented.");
  }
  setVibration(left?: unknown, right?: unknown, duration?: unknown): boolean {
    throw new Error("Method not implemented.");
  }
  " __opaque": never;
  release(): this is never {
    throw new Error("Method not implemented.");
  }
  type(): "Joystick" {
    throw new Error("Method not implemented.");
  }
  typeOf<T extends keyof Types>(name: T): this is Types[T] {
    throw new Error("Method not implemented.");
  }
}
