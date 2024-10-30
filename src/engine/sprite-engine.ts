import { Screen } from "love.graphics";
import { Actor } from "./actor";
import { Camera } from "./camera";
import { Input } from "./input/input";

export class SpriteEngine {
  private actors: Actor[] = [];

  constructor(public camera: Camera = new Camera()) {
    this.actors = [];
  }

  getActors(){
    return [...this.actors];
  }

  addActor(actor: Actor) {
    this.actors.push(actor);
  }

  removeActor(actor: Actor) {
    this.actors = this.actors.filter((a) => a !== actor);
  }

  update(dt: number) {
    if (love.keyboard.isDown && love.keyboard.isDown("kp+")) {
      this.camera.scale -= this.camera.speed * dt * 0.001;
    } else if (love.keyboard.isDown && love.keyboard.isDown("kp-")) {
      this.camera.scale += this.camera.speed * dt * 0.001;
    }
    for (let actor of this.actors) {
      actor.update(dt);
    }
  }

  draw(screen?: Screen) {
    this.camera.set();
    for (let actor of this.actors) {
      actor.draw(screen);
    }
    this.camera.unset();
  }
}
