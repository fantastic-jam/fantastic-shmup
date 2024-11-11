import { ExtendedJoystick } from "./engine/input/extended-joystick";
import { InputActions } from "./engine/input/input";

export class Player {
  isLocal() {
    return this.peerId === undefined;
  }
  constructor(
    public id: number,
    public joystick: ExtendedJoystick<InputActions>,
    public peerId?: number | undefined,
    public isDead: boolean = false
  ) {}
}
