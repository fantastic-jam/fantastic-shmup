import { Types } from "love";
import {
  GamepadAxis,
  GamepadButton,
  Joystick,
  JoystickHat,
  JoystickInputType,
} from "love.joystick";

export interface JoystickAxisRemap {
  axis: GamepadAxis;
  inverse: boolean;
}

export class RemappedJoystick implements Joystick {
  public constructor(
    private delegate: Joystick,
    private remaps: {
      axis?: Partial<Record<GamepadAxis, JoystickAxisRemap>>;
    }
  ) {}

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
    const remap = this.remaps.axis?.[axis];
    if (remap) {
        return this.delegate.getGamepadAxis(remap.axis) * (remap.inverse ? -1: 1);
    }
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

  isDown(...vararg: Array<number>): boolean {
    return this.delegate.isDown(...vararg);
  }

  isGamepad(): boolean {
    return this.delegate.isGamepad();
  }

  isGamepadDown(...vararg: Array<GamepadButton>): boolean {
    return this.delegate.isGamepadDown(...vararg);
  }

  isVibrationSupported(): boolean {
    return this.delegate.isVibrationSupported();
  }

  setVibration(): boolean;
  setVibration(left?: number, right?: number, duration?: number): boolean {
    return this.delegate.setVibration(left, right, duration);
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
