import { Screen } from "love.graphics";
import { Vector2 } from "../tools";
import { Sprite } from "./sprite";

function loadAnimations(
  spritesheet: any,
  frameWidth: number,
  frameHeight: number
): any[][] {
  const result: any[][] = [];
  const numAnimations = spritesheet.getHeight() / frameHeight;
  const numFrames = spritesheet.getWidth() / frameWidth;

  for (let i = 0; i < numAnimations; i++) {
    const animation: any[] = [];
    for (let j = 0; j < numFrames; j++) {
      animation.push(
        love.graphics.newQuad(
          j * frameWidth,
          i * frameHeight,
          frameWidth,
          frameHeight,
          spritesheet.getDimensions()
        )
      );
    }
    result.push(animation);
  }
  return result;
}

export class AnimatedSprite extends Sprite {
  spritesheet: any;
  animationSpeed: number;
  currentAnimationSpeed: number;
  currentAnimation: number;
  currentFrame: number;
  animations: any[][];
  elapsedTime: number;

  constructor(
    spritesheet: any,
    frameWidth: number,
    frameHeight: number,
    animationSpeed: number
  ) {
    super(spritesheet.getWidth(), spritesheet.getHeight());
    this.spritesheet = spritesheet;
    this.animationSpeed = animationSpeed;
    this.currentAnimationSpeed = animationSpeed;
    this.currentAnimation = 0;
    this.currentFrame = 0;
    this.animations = loadAnimations(spritesheet, frameWidth, frameHeight);
    this.elapsedTime = 0;
  }

  update(dt: number) {
    this.elapsedTime += dt;
    while (this.elapsedTime > this.animationSpeed) {
      this.elapsedTime -= this.animationSpeed;
      this.currentFrame =
        (this.currentFrame + 1) % this.animations[this.currentAnimation].length;
    }
  }

  draw(pos: Vector2, screen?: Screen) {
    love.graphics.draw(
      this.spritesheet,
      this.animations[this.currentAnimation][this.currentFrame],
      pos.x,
      pos.y
    );
  }
}
