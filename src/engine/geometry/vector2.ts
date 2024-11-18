/**
 * Represents a 2D vector with x and y components.
 */
export class Vector2 {
  static zero = (): Vector2 => new Vector2(0, 0);
  static one = (): Vector2 => new Vector2(1, 1);
  static up = (): Vector2 => new Vector2(0, -1);
  static down = (): Vector2 => new Vector2(0, 1);
  static left = (): Vector2 => new Vector2(-1, 0);
  static right = (): Vector2 => new Vector2(1, 0);

  /**
   * Creates an instance of Vector2.
   * @param x - The x component of the vector.
   * @param y - The y component of the vector.
   */
  constructor(public x: number, public y: number) { }

  /**
   * Creates a Vector2 instance from a literal object.
   * @param literal - An object with x and y properties.
   * @returns A new Vector2 instance.
   */
  static of(literal: { x: number; y: number; }): Vector2 {
    return new Vector2(literal.x, literal.y);
  }

  /**
   * Adds another vector to this vector.
   * @param v - The vector to add.
   * @returns A new Vector2 instance with the added values.
   */
  public add(v: Vector2): Vector2 {
    return new Vector2(this.x + v.x, this.y + v.y);
  }

  /**
   * Subtracts another vector from this vector.
   * @param v - The vector to subtract.
   * @returns A new Vector2 instance with the subtracted values.
   */
  public sub(v: Vector2): Vector2 {
    return new Vector2(this.x - v.x, this.y - v.y);
  }

  /**
   * Multiplies the vector by a scalar value.
   * @param n - The scalar value to multiply by.
   * @returns A new Vector2 instance with the multiplied values.
   */
  public multiply(n: number): Vector2 {
    return new Vector2(this.x * n, this.y * n);
  }

  /**
   * Calculates the length (magnitude) of the vector.
   * @returns The length of the vector.
   */
  public length(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  /**
   * Normalizes the vector to have a length of 1.
   * @returns A new Vector2 instance with the normalized values.
   */
  public normalize(): Vector2 {
    const length = this.length();
    if (length === 0) {
      return new Vector2(0, 0);
    }
    return new Vector2(this.x / length, this.y / length);
  }
}
