/**
 * Represents a rectangle with x, y coordinates and width and height dimensions.
 */
export class Rectangle {
  /**
   * Creates an instance of Rectangle.
   * @param x - The x coordinate of the rectangle.
   * @param y - The y coordinate of the rectangle.
   * @param w - The width of the rectangle.
   * @param h - The height of the rectangle.
   */
  constructor(
    public x: number,
    public y: number,
    public w: number,
    public h: number
  ) { }
}
