import { Actor } from "./engine/actor"; // Adjust the import path as necessary
import { AnimatedSprite } from "./engine/sprite/animated-sprite"; // Adjust the import path as necessary
import { Weapon } from "./engine/weapon/weapon"; // Adjust the import path as necessary

export class Ship extends Actor {
  weapon: Weapon;

  constructor(spriteEngine: any, x: number, y: number) {
    const image = love.graphics.newImage("assets/ship.png");
    const animatedSprite = new AnimatedSprite(image, 80, 64, 0.1);
    super(spriteEngine, x, y, 200, animatedSprite);

    this.weapon = new Weapon(spriteEngine, 0, 0, 1, this);
  }

  update(dt: number) {
    super.update(dt); // Call the parent class's update method
    this.weapon.update(dt);

    if (love.keyboard.isDown("left")) {
      this.x -= this.speed * dt;
    } else if (love.keyboard.isDown("right")) {
      this.x += this.speed * dt;
    }

    if (love.keyboard.isDown("up")) {
      this.y -= this.speed * dt;
    } else if (love.keyboard.isDown("down")) {
      this.y += this.speed * dt;
    }

    if (love.keyboard.isDown("space")) {
      this.weapon.fire();
    }
  }

  draw() {
    super.draw(); // Call the parent class's draw method
    this.weapon.draw();
  }
}
