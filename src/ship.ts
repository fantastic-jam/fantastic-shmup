import { Actor } from "./engine/actor"; // Adjust the import path as necessary
import { Input } from "./engine/input/input";
import { AnimatedSprite } from "./engine/sprite/animated-sprite"; // Adjust the import path as necessary
import { Weapon } from "./engine/weapon/weapon"; // Adjust the import path as necessary

export class Ship extends Actor {
  weapon: Weapon;

  constructor(spriteEngine: any, x: number, y: number) {
    const image = love.graphics.newImage("assets/ship.png");
    const animatedSprite = new AnimatedSprite(image, 40, 32, 0.1);
    super(spriteEngine, x, y, 200, animatedSprite);

    this.weapon = new Weapon(spriteEngine, 0, 0, 1, this);
  }

  private getDir(): { x: number; y: number } {
    let x = 0;
    let y = 0;

    for (const joystick of Input.getJoysticks()) {
      const axisX = joystick.getGamepadAxis("leftx");
      const axisY = joystick.getGamepadAxis("lefty");

      if (Math.abs(axisX) > 0.2) {
        x = axisX;
      }

      if (Math.abs(axisY) > 0.2) {
        y = axisY;
      }
      if (joystick.isGamepadDown("start")) {
        love.event.quit(0);
      }
    }
    return { x, y };
  }

  private isFiring(): boolean {
    for (const joystick of Input.getJoysticks()) {
      if (joystick.isGamepadDown("b")) {
        return true;
      }
    }
  }

  update(dt: number) {
    super.update(dt); // Call the parent class's update method
    this.weapon.update(dt);

    const dir = this.getDir();

    this.x += dir.x * this.speed * dt;
    this.y += dir.y * this.speed * dt;

    if (this.isFiring()) {
      this.weapon.fire();
    }
  }

  draw() {
    super.draw(); // Call the parent class's draw method
    this.weapon.draw();
  }
}
