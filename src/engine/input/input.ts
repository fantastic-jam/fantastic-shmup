import { Joystick } from "love.joystick";
import { KeyboardJoystick } from "./keyboard-joystick";
import { RemappedJoystick } from "./remapped-joystick";

export class Input {
  private static keyboard = new KeyboardJoystick();

  static remapJoysticks(joysticks: Joystick[]): Joystick[] {
    return joysticks.map((j) => {
      switch (j.getGUID()) {
        case "{7BC9702D-7D81-4EBB-AD4F-8C94076588D5}": // new 3ds
          return new RemappedJoystick(j, {
            axis: {
              lefty: { axis: "lefty", inverse: true },
              righty: { axis: "righty", inverse: true },
            },
          });
        case "{6EBE242C-820F-46E1-9A66-DC8200686D51}": // switch
          return new RemappedJoystick(j, {
            axis: {
              lefty: { axis: "lefty", inverse: false },
              leftx: { axis: "rightx", inverse: false },
            },
          });
        default:
          return j;
      }
    });
  }

  static getJoysticks(): Joystick[] {
    if (love.keyboard?.isScancodeDown) {
      return [this.keyboard, ...love.joystick.getJoysticks()];
    }
    return this.remapJoysticks(love.joystick.getJoysticks());
  }
}
