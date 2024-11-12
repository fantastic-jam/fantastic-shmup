import { GamepadButton, Joystick } from "love.joystick";
import { EventEmitter } from "../event";

export interface EventEmitterJoystick
  extends Joystick,
    EventEmitter<"pressed" | "released", [Joystick, GamepadButton]> {}
