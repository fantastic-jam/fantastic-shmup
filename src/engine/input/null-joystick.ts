import { Types } from "love";
import {
  GamepadAxis,
  GamepadButton,
  Joystick,
  JoystickHat,
  JoystickInputType,
} from "love.joystick";
import { EventEmitterJoystick } from "./event-emitter-joystick";
import { Event } from "../event";

export class NullJoystick implements EventEmitterJoystick {
  private static axes: GamepadAxis[] = [
    "leftx",
    "lefty",
    "rightx",
    "righty",
    "triggerleft",
    "triggerright",
  ];
  private static buttons: GamepadButton[] = [
    "a",
    "b",
    "back",
    "dpdown",
    "dpleft",
    "dpright",
    "dpup",
    "guide",
    "leftshoulder",
    "leftstick",
    "rightshoulder",
    "rightstick",
    "start",
    "x",
    "y",
  ];
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  listen(_eventType: "pressed" | "released", _callback: (e: Event<"pressed" | "released", [Joystick, GamepadButton]>) => void): void {
  }

  getAxes(): LuaMultiReturn<number[]> {
    return $multi(...NullJoystick.axes.map(() => 0));
  }
  getAxis(_axis: number): number {
    return 0;
  }
  getAxisCount(): number {
    return 6;
  }
  getButtonCount(): number {
    return NullJoystick.buttons.length;
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
    return undefined;
  }
  getGamepadAxis(_axis: GamepadAxis): number {
    return 0;
  }
  getGamepadMapping(): LuaMultiReturn<
    [
      inputType: JoystickInputType,
      inputIndex: number,
      hatDirection?: JoystickHat
    ]
  > {
    throw new Error("Method not implemented.");
  }
  getHat(): JoystickHat {
    throw new Error("Method not implemented.");
  }
  getHatCount(): number {
    return 0;
  }
  getID(): LuaMultiReturn<[id: number, instanceId?: number]> {
    throw new Error("Method not implemented.");
  }
  getName(): string {
    return "null";
  }
  getVibration(): LuaMultiReturn<[left: number, right: number]> {
    throw new Error("Method not implemented.");
  }
  isConnected(): boolean {
    throw new Error("Method not implemented.");
  }
  isDown(): boolean {
    throw new Error("Method not implemented.");
  }
  isGamepad(): boolean {
    return false;
  }
  isGamepadDown(..._vararg: GamepadButton[]): boolean {
    return false;
  }
  isVibrationSupported(): boolean {
    return false;
  }
  setVibration(): boolean {
    return false;
  }
  " __opaque": never;
  release(): this is never {
    throw new Error("Method not implemented.");
  }
  type(): "Joystick" {
    return "Joystick";
  }
  typeOf<T extends keyof Types>(name: T): this is Types[T] {
    return name === "Joystick";
  }
}
