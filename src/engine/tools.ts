export class Vector2 {
  constructor(public x: number, public y: number) {}

  static of(literal: { x: number; y: number }): Vector2 {
    return new Vector2(literal.x, literal.y);
  }

  public add(v: Vector2): Vector2 {
    return new Vector2(this.x + v.x, this.y + v.y);
  }
}

export class Vector3 {
  constructor(public x: number, public y: number, public z: number) {}

  static of(literal: { x: number; y: number; z: number }): Vector2 {
    return new Vector3(literal.x, literal.y, literal.z);
  }

  public add(v: Vector3): Vector3 {
    return new Vector3(this.x + v.x, this.y + v.y, this.z + v.z);
  }
}

export class Rectangle {
  constructor(
    public x: number,
    public y: number,
    public w: number,
    public h: number
  ) {}
}
