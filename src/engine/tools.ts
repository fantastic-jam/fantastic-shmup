export class Vector2 {
  constructor(public x: number, public y: number) {}

  static of(literal: { x: number; y: number }): Vector2 {
    return new Vector2(literal.x, literal.y);
  }

  public add(v: Vector2): Vector2 {
    return new Vector2(this.x + v.x, this.y + v.y);
  }
}
