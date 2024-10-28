import { Star } from "./star";

export class StarField {
  private stars: Star[][] = [];

  constructor(public layers: number = 4, public starCount: number = 600) {
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
        star.x = star.x - 30 * i * dt;
        if (star.x < 0) {
          star.x = love.graphics.getWidth();
          star.y = love.math.random(0, love.graphics.getHeight());
        }
      }
    }
  }

  public draw() {
    let brightness = 255;
    for (let i = 0; i < this.stars.length; i++) {
      const layer = this.stars[i];
      for (const star of layer) {
        love.graphics.setColor(brightness, brightness, brightness);
        love.graphics.rectangle("fill", star.x, star.y, i * (2 / this.layers), i * (2 / this.layers));
        //love.graphics.printf('.', star.x, star.x, star.y)
      }
      brightness = brightness - (150 / this.layers);
    }
    love.graphics.setColor(255, 255, 255);
  }
}
