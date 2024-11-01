import { GamepadButton, Joystick } from "love.joystick";
import { customInputMappings } from "../../conf";
import { ExtendedJoystick } from "./extended-joystick";
import { KeyboardJoystick } from "./keyboard-joystick";
import { RemappedJoystick } from "./remapped-joystick";

function isNintendoOs(): boolean {
  return (love.system.getOS() as string) === "Horizon";
}

const standardMappings = {
  confirm: "b",
  cancel: "a",
};

const nintendoMappings = {
  confirm: "b",
  cancel: "a",
};

export type InputActions =
  | keyof typeof standardMappings
  | keyof typeof customInputMappings;
export type GamepadActionMappings = Record<InputActions, GamepadButton>;

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class Input {
  private static keyboard = new KeyboardJoystick();
  private static joysticks: ExtendedJoystick<string>[] = [];
  private static nintendoGamepads: Record<string, string> = {
    "{B58A259A-13AA-46E0-BDCB-31898EDAB24E}": "NINTENDO_3DS",
    "{7BC9702D-7D81-4EBB-AD4F-8C94076588D5}": "NEW_NINTENDO_3DS",
    "{6EBE242C-820F-46E1-9A66-DC8200686D51}": "NINTENDO_SWITCH_HANDHELD",
    "{42ECF5C5-AFA5-4EDE-B1A2-4E9C2287559A}": "NINTENDO_SWITCH_PRO",
    "{660EBC7E-3953-4B74-8406-AD5992FCC5C7}": "JOYCON_LEFT",
    "{AD770831-A7E4-41A8-8DD0-FD48323E0043}": "JOYCON_RIGHT",
    "{701B198B-9AD9-4730-8EEB-EBECF707B9DF}": "JOYCON_PAIR",
    "{62998927-C43D-41F5-B6B1-D22CBF031D91}": "WII_U_GAMEPAD",
    "{02DC4D7B-2480-4678-BB06-D9AEDC3DE29B}": "WII_REMOTE",
    "{C0E2DDE5-25DF-4F7D-AEA6-4F25DE2FC385}": "WII_REMOTE_NUNCHUCK",
    "{B4F6A311-8228-477D-857B-B875D891C46D}": "WII_CLASSIC",
    "{36895D3B-A724-4F46-994C-64BCE736EBCB}": "WII_PRO",
  };

  static isNintendoGamepad(joystick: Joystick) {
    if (!joystick.getGUID) {
      return true;
    }
    return !!Input.nintendoGamepads[joystick.getGUID()];
  }

  static hasKeyboard(): boolean {
    return !!love.keyboard.isScancodeDown;
  }

  private static remapJoystick(joystick: Joystick): Joystick {
    if (Input.isNintendoGamepad(joystick)) {
      return new RemappedJoystick(joystick, {
        axes: {
          lefty: { axis: "lefty", inverse: true },
          righty: { axis: "righty", inverse: true },
        },
        buttons: {
          a: "b",
          b: "a",
          x: "y",
          y: "x",
        },
      });
    }
    return joystick;
  }

  static extendJoystick(
    joystick: Joystick,
    mappings: GamepadActionMappings
  ): ExtendedJoystick<InputActions> {
    return new ExtendedJoystick(joystick, mappings);
  }

  static getJoysticks(): ExtendedJoystick<InputActions>[] {
    return Input.joysticks;
  }

  static init(): void {
    const gamepadActionMappings = {
      ...(isNintendoOs() ? nintendoMappings : standardMappings),
      ...customInputMappings,
    };

    const joysticks = love.joystick
      .getJoysticks()
      .map((j) => this.remapJoystick(j));

    if (Input.hasKeyboard()) {
      joysticks.push(Input.keyboard);
    }
    this.joysticks = joysticks.map((j) =>
      this.extendJoystick(j, gamepadActionMappings as GamepadActionMappings)
    );
  }
}
