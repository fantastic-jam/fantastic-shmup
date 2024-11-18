import { expect, it } from "vitest";
import { Vector2 } from "./vector2";

it("should add two vectors", () => {
  const v1 = new Vector2(1, 2);
  const v2 = new Vector2(3, 4);
  const result = v1.add(v2);
  expect(result.x).toBe(4);
  expect(result.y).toBe(6);
});

it("should subtract two vectors", () => {
  const v1 = new Vector2(1, 2);
  const v2 = new Vector2(3, 4);
  const result = v1.sub(v2);
  expect(result.x).toBe(-2);
  expect(result.y).toBe(-2);
});

it("should multiply a vector by a scalar", () => {
  const v = new Vector2(1, 2);
  const result = v.multiply(2);
  expect(result.x).toBe(2);
  expect(result.y).toBe(4);
});

it("should calculate the length of a vector", () => {
  const v = new Vector2(3, 4);
  const result = v.length();
  expect(result).toBe(5);
});

it("should normalize a vector", () => {
  const v = new Vector2(3, 4);
  const result = v.normalize();
  expect(result.x).toBeCloseTo(0.6);
  expect(result.y).toBeCloseTo(0.8);
});

it("should create a vector from a literal object", () => {
  const v = Vector2.of({ x: 1, y: 2 });
  expect(v.x).toBe(1);
  expect(v.y).toBe(2);
}); 

