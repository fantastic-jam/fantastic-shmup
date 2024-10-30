import { Screen } from "love.graphics";
import { Camera } from "../engine/camera";
import { Star } from "./star";

export class StarField {
  private stars: Star[][] = [];

  constructor(
    private camera: Camera,
    public layers: number = 4,
    public starCount: number = 600
  ) {
    for (let i = 0; i < layers; i++) {
      this.stars.push([]);
    }
    for (let i = 0; i < starCount; i++) {
      const star = new Star(
        love.math.random(0, love.graphics.getWidth()),
        love.math.random(0, love.graphics.getHeight())
      );
      const layer = love.math.random(0, this.layers - 1);
      this.stars[layer].push(star);
    }
  }

  public update(dt: number) {
    for (let i = 0; i < this.stars.length; i++) {
      const layer = this.stars[i];
      for (const star of layer) {
        star.x = star.x - 30 * (i + 1) * dt;
        if (star.x < 0) {
          star.x += love.graphics.getWidth();
          star.y = love.math.random(0, love.graphics.getHeight());
        }
      }
    }
  }

  public draw(screen?: Screen) {
    let sysDepth = -(love.graphics.getDepth?.() ?? 0);
    if (screen === "left") {
      sysDepth = -sysDepth;
    }

    let brightness = 255;
    for (let i = 0; i < this.stars.length; i++) {
      const layer = this.stars[i];
      for (const star of layer) {
        love.graphics.setColor(brightness, brightness, brightness);
        const layerDepth = (this.layers - i) * 6;
    
        love.graphics.rectangle(
          "fill",
          star.x - (sysDepth * layerDepth),
          star.y,
          (i + 1) * (1.5 / this.layers) * (this.camera.scale ?? 1),
          (i + 1) * (1.5 / this.layers) * (this.camera.scale ?? 1)
        );
      }
      brightness = brightness - 150 / this.layers;
    }
    love.graphics.setColor(255, 255, 255);
  }
}
