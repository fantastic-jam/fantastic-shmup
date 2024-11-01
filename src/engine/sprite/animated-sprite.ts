import { Image, Quad } from "love.graphics";
import { Vector2 } from "../tools";
import { Sprite } from "./sprite";

function loadAnimations(
  spritesheet: Image,
  frameWidth: number,
  frameHeight: number
): Quad[][] {
  const result: Quad[][] = [];
  const numAnimations = spritesheet.getHeight() / frameHeight;
  const numFrames = spritesheet.getWidth() / frameWidth;

  for (let i = 0; i < numAnimations; i++) {
    const animation: Quad[] = [];
    for (let j = 0; j < numFrames; j++) {
      animation.push(
        love.graphics.newQuad(
          j * frameWidth,
          i * frameHeight,
          frameWidth,
          frameHeight,
          spritesheet.getWidth(),
          spritesheet.getHeight()
        )
      );
    }
    result.push(animation);
  }
  return result;
}

export class AnimatedSprite implements Sprite {
  spritesheet: Image;
  animationSpeed: number;
  currentAnimationSpeed: number;
  currentAnimation: number;
  currentFrame: number;
  animations: Quad[][];
  elapsedTime: number;

  constructor(
    spritesheet: Image,
    private frameWidth: number,
    private frameHeight: number,
    animationSpeed: number
  ) {
    this.spritesheet = spritesheet;
    this.animationSpeed = animationSpeed;
    this.currentAnimationSpeed = animationSpeed;
    this.currentAnimation = 0;
    this.currentFrame = 0;
    this.animations = loadAnimations(spritesheet, frameWidth, frameHeight);
    this.elapsedTime = 0;
  }

  getWidth(): number {
    return this.frameWidth;
  }

  getHeight(): number {
    return this.frameHeight;
  }

  update(dt: number) {
    this.elapsedTime += dt;
    while (this.elapsedTime > this.animationSpeed) {
      this.elapsedTime -= this.animationSpeed;
      this.currentFrame =
        (this.currentFrame + 1) % this.animations[this.currentAnimation].length;
    }
  }

  draw(pos: Vector2) {
    love.graphics.draw(
      this.spritesheet,
      this.animations[this.currentAnimation][this.currentFrame],
      pos.x,
      pos.y
    );
  }
}
