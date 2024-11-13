import { Types } from "love";
import {
  GamepadAxis,
  GamepadButton,
  Joystick,
  JoystickHat,
  JoystickInputType,
} from "love.joystick";
import { EventEmitter, SimpleEventEmitter } from "../event";
import { EventEmitterJoystick } from "./event-emitter-joystick";

export interface JoystickAxisRemap {
  axis: GamepadAxis;
  inverse: boolean;
}

export class ExtendedJoystick<T extends string>
  implements
    EventEmitterJoystick,
    EventEmitter<"actionpressed" | "actionreleased", [Joystick, T]>
{
  private gamepadPressed: Partial<Record<GamepadButton, boolean>> = {};
  private actionPressed: Partial<Record<T, boolean>> = {};
  private gamepadReleased: Partial<Record<GamepadButton, boolean>> = {};
  private actionReleased: Partial<Record<T, boolean>> = {};
  private gamepadEventEmitter = new SimpleEventEmitter<
    "pressed" | "released",
    [Joystick, GamepadButton]
  >();
  private actionEventEmitter = new SimpleEventEmitter<
    "actionPressed" | "actionReleased",
    [Joystick, T]
  >();

  public constructor(
    private delegate: EventEmitterJoystick,
    private mapping: Record<T, GamepadButton>
  ) {
    const inverseMapping: Partial<Record<GamepadButton, T>> = {};
    for (const key of Object.keys(this.mapping ?? {})) {
      const action = key as T;
      const btn = this.mapping[action];
      if (btn != null) {
        inverseMapping[btn] = action;
      }
    }

    delegate.listen("pressed", (e) => {
      const [_j, b] = e.getSource();
      this.gamepadPressed[b] = true;
      const action = inverseMapping[b];
      if (action != null) {
        this.actionPressed[action] = true;
      }
    });
    delegate.listen("released", (e) => {
      const [_j, b] = e.getSource();
      this.gamepadReleased[b] = true;
      const action = inverseMapping[b];
      if (action != null) {
        this.actionReleased[action] = true;
      }
    });
  }

  // listen(eventType: "pressed" | "released", callback: any);
  // listen(eventType: "actionPressed" | "actionReleased", callback: any);
  listen(eventType: any, callback: any): void {
    if (eventType === "actionPressed" || eventType === "actionReleased") {
      return this.actionEventEmitter.listen(eventType, callback);
    }
    return this.gamepadEventEmitter.listen(eventType, callback);
  }

  resetPressedStates(): void {
    this.gamepadPressed = {};
    this.actionPressed = {};
    this.gamepadReleased = {};
    this.actionReleased = {};
  }

  isActionDown(...actions: T[]): boolean {
    return this.isGamepadDown(...actions.map((action) => this.mapping[action]));
  }

  isActionPressed(...actions: T[]): boolean {
    return actions.some((action) => this.actionPressed[action]);
  }

  isActionReleased(...actions: T[]): boolean {
    return actions.some((action) => this.actionReleased[action]);
  }

  isGamepadPressed(...buttons: GamepadButton[]): boolean {
    return buttons.some((button) => this.gamepadPressed[button]);
  }
  isGamepadReleased(...buttons: GamepadButton[]): boolean {
    return buttons.some((button) => this.gamepadReleased[button]);
  }

  getAxes(): LuaMultiReturn<number[]> {
    return this.delegate.getAxes();
  }

  getAxis(axis: number): number {
    return this.delegate.getAxis(axis);
  }

  getAxisCount(): number {
    return this.delegate.getAxisCount();
  }

  getButtonCount(): number {
    return this.delegate.getButtonCount();
  }

  getDeviceInfo(): LuaMultiReturn<
    [vendorID: number, productID: number, productVersion: number]
  > {
    return this.delegate.getDeviceInfo();
  }

  getGUID(): string {
    return this.delegate.getGUID();
  }

  getGamepadMappingString(): string | undefined {
    return this.delegate.getGamepadMappingString();
  }

  getGamepadAxis(axis: GamepadAxis): number {
    return this.delegate.getGamepadAxis(axis);
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
    return this.delegate.getGamepadMapping(axisOrButton);
  }

  getHat(hat: number): JoystickHat {
    return this.delegate.getHat(hat);
  }

  getHatCount(): number {
    return this.delegate.getHatCount();
  }

  getID(): LuaMultiReturn<[id: number, instanceId?: number]> {
    return this.delegate.getID();
  }

  getName(): string {
    return this.delegate.getName();
  }

  getVibration(): LuaMultiReturn<[left: number, right: number]> {
    return this.delegate.getVibration();
  }

  isConnected(): boolean {
    return this.delegate.isConnected();
  }

  isDown(...vararg: number[]): boolean {
    return this.delegate.isDown(...vararg);
  }

  isGamepad(): boolean {
    return this.delegate.isGamepad();
  }

  isGamepadDown(...vararg: GamepadButton[]): boolean {
    return this.delegate.isGamepadDown(...vararg);
  }

  isVibrationSupported(): boolean {
    return this.delegate.isVibrationSupported();
  }

  setVibration(): boolean;
  setVibration(left: number, right: number, duration: number): boolean;
  setVibration(left?: number, right?: number, duration?: number): boolean {
    if (left != null && right != null && duration != null) {
      return this.delegate.setVibration(left, right, duration);
    }
    return this.delegate.setVibration();
  }

  " __opaque": never;

  release(): this is never {
    return this.delegate.release();
  }

  type(): "Joystick" {
    return this.delegate.type();
  }

  typeOf<T extends keyof Types>(name: T): this is Types[T] {
    return this.delegate.typeOf(name);
  }
}
