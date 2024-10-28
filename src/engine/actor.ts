import { SpriteEngine } from "./sprite-engine";

export class Actor {
    spriteEngine: any;
    x: number;
    y: number;
    speed: number;
    sprite: any;
    parent: Actor | undefined;

    constructor(spriteEngine: SpriteEngine, x: number, y: number, speed: number = 200, sprite: any, parent?: Actor) {
        this.spriteEngine = spriteEngine;
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.sprite = sprite;
        this.parent = parent;
    }

    update(dt: number) {
        this.sprite.update(dt);
    }

    globalX(): number {
        return this.x + (this.parent ? this.parent.x : 0);
    }

    globalY(): number {
        return this.y + (this.parent ? this.parent.y : 0);
    }

    draw() {
        this.sprite.draw(this.globalX(), this.globalY());
    }

    // translate() {
    //     love.graphics.push();
    //     love.graphics.translate(this.x, this.y);
    // }

    // endTranslate() {
    //     love.graphics.pop();
    // }
}
