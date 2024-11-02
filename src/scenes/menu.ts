import { Source } from "love.audio";
import { Screen } from "love.graphics";
import { config } from "../conf";
import {
  Event,
  EventEmitter,
  SimpleEvent,
  SimpleEventEmitter,
} from "../engine/event";
import { ExtendedJoystick } from "../engine/input/extended-joystick";
import { Input, InputActions } from "../engine/input/input";
import { Scene } from "../engine/scene";
import { StarField } from "../world/starfield";
import { Camera } from "../engine/camera";

export class MenuScene implements Scene, EventEmitter<"start", MenuScene> {
  music: Source;
  joysticks = new Map<ExtendedJoystick<InputActions>, number>();
  private emitter = new SimpleEventEmitter<"start", MenuScene>();
  private starField: StarField;

  constructor() {
    this.music = love.audio.newSource("assets/menu.ogg", "stream");
    this.music.setLooping(true);
    this.music.setVolume(0.2);
    this.music.play();
    this.starField = new StarField(new Camera(), 200);
  }

  getPlayers(): ExtendedJoystick<InputActions>[] {
    const result: ExtendedJoystick<InputActions>[] = [];
    this.joysticks.forEach((_, j) => {
      result.push(j);
    });
    return result;
  }

  listen(
    eventType: "start",
    callback: (e: Event<"start", MenuScene>) => void
  ): void {
    return this.emitter.listen(eventType, callback);
  }

  update(dt: number): void {
    for (const joystick of Input.getJoysticks()) {
      if (joystick.isGamepadDown("start")) {
        const readyTime = this.joysticks.get(joystick);
        if (readyTime == null) {
          this.joysticks.set(joystick, love.timer.getTime());
        } else if (love.timer.getTime() - readyTime > 1) {
          this.emitter.pushEvent(new SimpleEvent("start", this));
        }
      }
      if (joystick.isGamepadDown("back")) {
        love.event.quit(0);
      }
    }
    this.starField.update(dt);
  }
  draw(screen?: Screen): void {
    if (screen !== "bottom") {
      this.starField.draw()
      let idx = 0;
      this.joysticks.forEach((time) => {
        if (love.timer.getTime() - time < 1) {
          love.graphics.setColor(0.6, 0.6, 0.5);
        } else {
          love.graphics.setColor(1, 1, 1);
        }
        love.graphics.print("ready", 10 + idx++ * 50, config.screenHeight - 30);
        love.graphics.setColor(1, 1, 1);
      });
    }
  }
  unload(): void {
    this.music.stop();
    this.music.release();
  }
}
