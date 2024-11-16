import { Screen } from "love.graphics";
import { config } from "../conf";
import { Camera } from "../engine/camera";
import { Vector3 } from "../engine/tools";

export class Star {
  constructor(public pos: Vector3) {}
}

const STAR_MAX_DEPTH = 50;
const MAX_BRIGHTNESS = 1;
const STAR_SPEED = 2;
const STEREOSCOPIC_EFFECT = 0.5;
const DEPTH_SIZE_RATIO = 0.03;

export class StarField {
  private stars: Star[] = [];

  constructor(private camera: Camera, public starCount = 600) {
    for (let i = 0; i < starCount; i++) {
      const star = new Star(
        new Vector3(
          love.math.random(0, config.screenWidth),
          love.math.random(0, config.screenHeight),
          love.math.random(1, STAR_MAX_DEPTH)
        )
      );
      this.stars.push(star);
    }
  }

  public update(dt: number) {
    for (const star of this.stars) {
      star.pos.x = star.pos.x - STAR_SPEED * star.pos.z * dt;
      if (star.pos.x < 0) {
        star.pos.x += config.screenWidth;
        star.pos.y = love.math.random(0, config.screenHeight);
      }
    }
  }

  private getSteroscopticEffect(screen?: Screen): number {
    if (!screen || !love.graphics.getDepth) {
      return 0;
    }
    let sysDepth = -love.graphics.getDepth();
    if (screen === "left") {
      sysDepth = -sysDepth;
    }
    return sysDepth * STEREOSCOPIC_EFFECT;
  }

  private setBackgroundColor() {
    const cos = Math.round(5 + Math.cos(love.timer.getTime() * 0.1) * 5);
    love.graphics.setBackgroundColor(
      love.math.colorFromBytes(2 + cos, 4 + cos, 10 + cos)
    );
  }

  public draw(screen?: Screen) {
    this.setBackgroundColor();
    const scale = this.camera.scale ?? 1;
    const depthEffect = this.getSteroscopticEffect(screen);

    let brightness = MAX_BRIGHTNESS;
    for (const star of this.stars) {
      brightness = star.pos.z / 50;
      love.graphics.setColor(brightness, brightness, brightness);
      const layerDepth = STAR_MAX_DEPTH - star.pos.z;

      love.graphics.rectangle(
        "fill",
        (star.pos.x - depthEffect * layerDepth) * scale,
        star.pos.y * scale,
        star.pos.z * DEPTH_SIZE_RATIO * scale,
        star.pos.z * DEPTH_SIZE_RATIO * scale
      );
    }
    love.graphics.setColor(MAX_BRIGHTNESS, MAX_BRIGHTNESS, MAX_BRIGHTNESS);
  }
}
