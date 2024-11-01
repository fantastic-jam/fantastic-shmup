import { Image } from "love.graphics";
import { Actor } from "../engine/actor";
import { BoxCollider2d } from "../engine/collision/box-collider2d";
import { Engine } from "../engine/engine";
import { ExtendedJoystick } from "../engine/input/extended-joystick";
import { InputActions } from "../engine/input/input";
import { SpriteEngine } from "../engine/sprite-engine";
import { AnimatedSprite } from "../engine/sprite/animated-sprite";
import { Rectangle, Vector2 } from "../engine/tools";
import { WeaponMissile } from "./weapon/missile/weapon_missile";
import { Weapon } from "./weapon/weapon";
import { WeaponGun } from "./weapon/gun/weapon_gun";

let image: Image;
Engine.preload(() => {
  image = love.graphics.newImage("/assets/ship.png");
});

export class Ship extends Actor {
  weapons: Weapon[];
  currentWeapon = 0;

  constructor(
    spriteEngine: SpriteEngine,
    pos: Vector2,
    private joystick: ExtendedJoystick<InputActions>
  ) {
    const animatedSprite = new AnimatedSprite(image, 40, 32, 0.1);
    const collider = new BoxCollider2d(new Rectangle(17, 10, 21, 12));
    super(spriteEngine, pos, 200, animatedSprite, collider);

    this.weapons = [
      new WeaponGun(spriteEngine, new Vector2(35, 13), 0.1, this),
      new WeaponMissile(spriteEngine, new Vector2(30, 10), 0.4, this),
    ];
  }

  private getDir(): { x: number; y: number } {
    let x = 0;
    let y = 0;

    const axisX = this.joystick.getGamepadAxis("leftx");
    const axisY = this.joystick.getGamepadAxis("lefty");

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
    super.draw();
    print(this.currentWeapon.toString());
    this.weapons[this.currentWeapon].draw();
  }
}
