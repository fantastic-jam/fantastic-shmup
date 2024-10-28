import { Actor } from "./actor";
import { Camera } from "./camera";

export class SpriteEngine {
  x: number;
  y: number;
  actors: any[];
  camera: Camera;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.actors = [];
    this.camera = new Camera(0, 0, 1, 200);
  }

  addActor(actor: Actor) {
    this.actors.push(actor);
  }

  removeActor(actor: Actor) {
    this.actors = this.actors.filter((a) => a !== actor);
  }

  update(dt: number) {
    if (love.keyboard.isDown("kp+")) {
      this.camera.scale -= this.camera.speed * dt * 0.001;
    } else if (love.keyboard.isDown("kp-")) {
      this.camera.scale += this.camera.speed * dt * 0.001;
    }
    for (let actor of this.actors) {
      actor.update(dt);
    }
  }

  draw() {
    this.camera.set();
    for (let actor of this.actors) {
      actor.draw();
    }
    this.camera.unset();
  }
}
