export class Camera {
    x: number;
    y: number;
    scale: number;
    speed: number;

    constructor(x: number = 0, y: number = 0, scale: number = 1, speed: number = 200) {
        this.x = x;
        this.y = y;
        this.scale = scale;
        this.speed = speed;
    }

    set() {
        love.graphics.push();
        love.graphics.scale(this.scale);
        love.graphics.translate(-this.x, -this.y);
    }

    unset() {
        love.graphics.pop();
    }
}
