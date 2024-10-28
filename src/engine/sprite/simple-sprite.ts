import { Sprite } from './sprite'; // Adjust the import path as necessary

export class SimpleSprite extends Sprite {
    image: any;

    constructor(image: any) {
        super(image.getWidth(), image.getHeight());
        this.image = image;
    }

    draw(x: number, y: number) {
        love.graphics.draw(this.image, x, y);
    }
}
