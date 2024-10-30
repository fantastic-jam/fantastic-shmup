import { Screen } from "love.graphics";
import { Vector2 } from "../tools";

export class Sprite {
    width: number;
    height: number;

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
    }

    update(dt: number) {
    }

    draw(pos: Vector2, screen?: Screen) {
    }
}
