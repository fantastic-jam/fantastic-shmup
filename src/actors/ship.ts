import { Image } from "love.graphics";
import { Actor } from "../engine/actor";
import { BoxCollider2d } from "../engine/collision/box-collider2d";
import { Engine } from "../engine/engine";
import { ExtendedJoystick } from "../engine/input/extended-joystick";
import { InputActions } from "../engine/input/input";
import { SpriteEngine } from "../engine/sprite-engine";
import { AnimatedSprite } from "../engine/sprite/animated-sprite";
import { Rectangle, Vector2 } from "../engine/tools";
import { Weapon } from "../engine/weapon/weapon";

let image: Image;
Engine.preload(() => {
  image = love.graphics.newImage("/assets/ship.png");
});

export class Ship extends Actor {
  weapon: Weapon;

  constructor(
    spriteEngine: SpriteEngine,
    pos: Vector2,
    private joystick: ExtendedJoystick<InputActions>
  ) {
    const animatedSprite = new AnimatedSprite(image, 40, 32, 0.1);
    const collider = new BoxCollider2d(new Rectangle(17, 10, 21, 12));
    super(spriteEngine, pos, 200, animatedSprite, collider);

    this.weapon = new Weapon(spriteEngine, new Vector2(30, 10), 0.15, this);
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
    this.weapon.update(dt);

    const dir = this.getDir();

    this.pos.x += dir.x * this.speed * dt;
    this.pos.y += dir.y * this.speed * dt;

    if (this.isMainWeaponFiring()) {
      this.weapon.fire();
    }
  }

  draw() {
    super.draw(); // Call the parent class's draw method
    this.weapon.draw();
  }
}
