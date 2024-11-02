import { Image } from "love.graphics";
import { CollisionLayer } from "../collisions";
import { config } from "../conf";
import { Actor, Damageable } from "../engine/actor";
import { BoxCollider2d } from "../engine/collision/box-collider2d";
import { Engine } from "../engine/engine";
import {
  Event,
  EventEmitter,
  SimpleEvent,
  SimpleEventEmitter,
} from "../engine/event";
import { ExtendedJoystick } from "../engine/input/extended-joystick";
import { InputActions } from "../engine/input/input";
import { SpriteEngine } from "../engine/sprite-engine";
import { AnimatedSprite } from "../engine/sprite/animated-sprite";
import { Rectangle, Vector2 } from "../engine/tools";
import { WeaponGun } from "./weapon/gun/weapon_gun";
import { WeaponMissile } from "./weapon/missile/weapon_missile";
import { Weapon } from "./weapon/weapon";

let image: Image;
Engine.preload(() => {
  image = love.graphics.newImage("/assets/ship.png");
});

export class Ship
  extends Actor
  implements Damageable, EventEmitter<"killed", Ship>
{
  weapons: Weapon[];
  currentWeapon = 0;
  private simpleEventEmitter = new SimpleEventEmitter<"killed", Ship>();
  public score = 0;
  public color: [number, number, number] = [1, 1, 1];

  constructor(
    spriteEngine: SpriteEngine,
    pos: Vector2,
    public readonly joystick: ExtendedJoystick<InputActions>
  ) {
    const animatedSprite = new AnimatedSprite(image, 40, 32, 0.1);
    const collider = new BoxCollider2d(
      new Rectangle(17, 10, 21, 12),
      [CollisionLayer.PLAYERS],
      [CollisionLayer.ENEMIES]
    );
    super("Ship", spriteEngine, pos, 200, animatedSprite, collider);

    this.weapons = [
      new WeaponGun(spriteEngine, new Vector2(35, 13), 0.1, this),
      new WeaponMissile(spriteEngine, new Vector2(30, 10), 0.4, this),
    ];
  }
  listen(
    eventType: "killed",
    callback: (e: Event<"killed", Ship>) => void
  ): void {
    this.simpleEventEmitter.listen(eventType, callback);
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  damage(_src: Actor | undefined, _amount: number): void {
    this.simpleEventEmitter.pushEvent(new SimpleEvent("killed", this));
  }

  getScore(): number {
    return this.score;
  }

  private getDir(): { x: number; y: number } {
    let x = 0;
    let y = 0;

    let axisX = this.joystick.getGamepadAxis("leftx");
    let axisY = this.joystick.getGamepadAxis("lefty");

    if (
      this.joystick.isGamepadDown("dpleft") ||
      this.joystick.isGamepadDown("dpright")
    ) {
      axisX =
        0 +
        (this.joystick.isGamepadDown("dpleft") ? -1 : 0) +
        (this.joystick.isGamepadDown("dpright") ? 1 : 0);
    }

    if (
      this.joystick.isGamepadDown("dpup") ||
      this.joystick.isGamepadDown("dpdown")
    ) {
      axisY =
        0 +
        (this.joystick.isGamepadDown("dpup") ? -1 : 0) +
        (this.joystick.isGamepadDown("dpdown") ? 1 : 0);
    }

    if (Math.abs(axisX) > 0.2) {
      x = axisX;
    }

    if (Math.abs(axisY) > 0.2) {
      y = axisY;
    }
    return { x, y };
  }

  private isMainWeaponFiring(): boolean {
    if (this.joystick.isActionDown("fire")) {
      return true;
    }
    return false;
  }

  update(dt: number) {
    super.update(dt); // Call the parent class's update method
    this.weapons[this.currentWeapon].update(dt);

    const dir = this.getDir();

    this.pos.x += dir.x * this.speed * dt;
    this.pos.y += dir.y * this.speed * dt;

    if (this.pos.x + (this.sprite?.getWidth() ?? 0) > config.screenWidth) {
      this.pos.x = config.screenWidth - (this.sprite?.getWidth() ?? 0);
    } else if (this.pos.x < 0) {
      this.pos.x = 0;
    }
    if (this.pos.y + (this.sprite?.getHeight() ?? 0) > config.screenHeight) {
      this.pos.y = config.screenHeight - (this.sprite?.getHeight() ?? 0);
    } else if (this.pos.y < 0) {
      this.pos.y = 0;
    }

    if (this.isMainWeaponFiring()) {
      this.weapons[this.currentWeapon].fire();
    }

    if (this.joystick.isActionDown("weapon_up")) {
      this.currentWeapon = Math.abs(
        (this.currentWeapon + 1) % this.weapons.length
      );
    }
    if (this.joystick.isActionDown("weapon_down")) {
      this.currentWeapon = Math.abs(
        (this.currentWeapon - 1) % this.weapons.length
      );
    }
  }

  draw() {
    love.graphics.setColor(...this.color);
    super.draw();
    this.weapons[this.currentWeapon].draw();
    love.graphics.setColor(1, 1, 1);
  }
}
