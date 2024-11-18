/**
 * Represents a 3-dimensional vector with x, y, and z components.
 */
export class Vector3 {
  /**
   * Creates an instance of Vector3.
   * @param x - The x component of the vector.
   * @param y - The y component of the vector.
   * @param z - The z component of the vector.
   */
  constructor(public x: number, public y: number, public z: number) { }

  /**
   * Creates a new Vector3 instance from a literal object.
   * @param literal - An object with x, y, and z properties.
   * @returns A new Vector3 instance.
   */
  static of(literal: { x: number; y: number; z: number; }): Vector3 {
    return new Vector3(literal.x, literal.y, literal.z);
  }

  /**
   * Adds the given vector to the current vector.
   * @param v - The vector to add.
   * @returns A new Vector3 instance representing the result of the addition.
   */
  public add(v: Vector3): Vector3 {
    return new Vector3(this.x + v.x, this.y + v.y, this.z + v.z);
  }

  /**
   * Subtracts the given vector from the current vector.
   * @param v - The vector to subtract.
   * @returns A new Vector3 instance representing the result of the subtraction.
   */
  public sub(v: Vector3): Vector3 {
    return new Vector3(this.x - v.x, this.y - v.y, this.z - v.z);
  }

  /**
   * Multiplies the current vector by a scalar value.
   * @param n - The scalar value to multiply by.
   * @returns A new Vector3 instance representing the result of the multiplication.
   */
  public multiply(n: number): Vector3 {
    return new Vector3(this.x * n, this.y * n, this.z * n);
  }

  /**
   * Calculates the length (magnitude) of the vector.
   * @returns The length of the vector.
   */
  public length(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }

  /**
   * Normalizes the vector, making it a unit vector.
   * @returns A new Vector3 instance representing the normalized vector.
   */
  public normalize(): Vector3 {
    const length = this.length();
    if (length === 0) {
      return new Vector3(0, 0, 0);
    }
    return new Vector3(this.x / length, this.y / length, this.z / length);
  }
}
