import { Types } from "love";
import {
  GamepadAxis,
  GamepadButton,
  Joystick,
  JoystickHat,
  JoystickInputType,
} from "love.joystick";
import { KeyConstant, Scancode } from "love.keyboard";
import { EventEmitterJoystick } from "./event-emitter-joystick";
import { Event, EventEmitter, SimpleEvent, SimpleEventEmitter } from "../event";

export class KeyboardJoystick implements EventEmitterJoystick {
  private eventEmitter = new SimpleEventEmitter<
    "pressed" | "released",
    [Joystick, GamepadButton]
  >();

  constructor(
    keyboardEmitter: EventEmitter<
      "keypressed" | "keyreleased",
      [KeyConstant, Scancode, boolean | undefined]
    >
  ) {
    keyboardEmitter.listen("keypressed", (e) => {
      const [_key, scancode] = e.getSource();
      const btn = KeyboardJoystick.inverseMapping.get(scancode);
      if (btn != null) {
        this.eventEmitter.pushEvent(new SimpleEvent("pressed", [this, btn]));
      }
    });
    keyboardEmitter.listen("keyreleased", (e) => {
      const [_key, scancode] = e.getSource();
      const btn = KeyboardJoystick.inverseMapping.get(scancode);
      if (btn != null) {
        this.eventEmitter.pushEvent(new SimpleEvent("released", [this, btn]));
      }
    });
  }

  listen(
    eventType: "pressed" | "released",
    callback: (
      e: Event<"pressed" | "released", [Joystick, GamepadButton]>
    ) => void
  ): void {
    return this.eventEmitter.listen(eventType, callback);
  }
  private static axes: GamepadAxis[] = [
    "leftx",
    "lefty",
    "rightx",
    "righty",
    "triggerleft",
    "triggerright",
  ];
  private static mapping: Record<GamepadButton, Scancode> = {
    a: "space",
    b: "g",
    back: "escape",
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
  private static inverseMapping: Map<Scancode, GamepadButton> = (function () {
    const result = new Map<Scancode, GamepadButton>();
    for (const key of Object.keys(KeyboardJoystick.mapping)) {
      const btn = key as GamepadButton;
      result.set(KeyboardJoystick.mapping[btn], btn);
    }
    return result;
  })();

  getAxes(): LuaMultiReturn<number[]> {
    return $multi(
      ...KeyboardJoystick.axes.map((axis) => this.getGamepadAxis(axis))
    );
  }
  getAxis(axis: number): number {
    if (axis >= KeyboardJoystick.axes.length) {
      return 0;
    }
    return this.getGamepadAxis(KeyboardJoystick.axes[axis]);
  }
  getAxisCount(): number {
    return 6;
  }
  getButtonCount(): number {
    return Object.keys(KeyboardJoystick.mapping).length;
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
  getGamepadAxis(axis: GamepadAxis): number {
    let result = 0;
    switch (axis) {
      case "leftx":
        result += love.keyboard.isScancodeDown("a") ? -1 : 0;
        result += love.keyboard.isScancodeDown("d") ? 1 : 0;
        break;
      case "lefty":
        result += love.keyboard.isScancodeDown("w") ? -1 : 0;
        result += love.keyboard.isScancodeDown("s") ? 1 : 0;
        break;
      case "rightx":
        result += love.keyboard.isScancodeDown("k") ? -1 : 0;
        result += love.keyboard.isScancodeDown(";") ? 1 : 0;
        break;
      case "righty":
        result += love.keyboard.isScancodeDown("o") ? -1 : 0;
        result += love.keyboard.isScancodeDown("l") ? 1 : 0;
        break;
      case "triggerleft":
        result += love.keyboard.isScancodeDown("1") ? 1 : 0;
        break;
      case "triggerright":
        result += love.keyboard.isScancodeDown("3") ? 1 : 0;
        break;
    }
    return result;
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
    return "keyboard";
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
  isGamepadDown(...vararg: GamepadButton[]): boolean {
    return vararg.some((button) =>
      love.keyboard.isScancodeDown(KeyboardJoystick.mapping[button])
    );
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
