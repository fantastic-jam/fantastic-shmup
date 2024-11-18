import { expect, it } from "vitest";
import { Vector3 } from "./vector3";

it("should add two vectors", () => {
  const v1 = new Vector3(1, 2, 3);
  const v2 = new Vector3(4, 5, 6);
  const result = v1.add(v2);
  expect(result.x).toBe(5);
  expect(result.y).toBe(7);
  expect(result.z).toBe(9);
});

it("should subtract two vectors", () => {
  const v1 = new Vector3(1, 2, 3);
  const v2 = new Vector3(4, 5, 6);
  const result = v1.sub(v2);
  expect(result.x).toBe(-3);
  expect(result.y).toBe(-3);
  expect(result.z).toBe(-3);
});

it("should multiply a vector by a scalar", () => {
  const v = new Vector3(1, 2, 3);
  const result = v.multiply(2);
  expect(result.x).toBe(2);
  expect(result.y).toBe(4);
  expect(result.z).toBe(6);
});

it("should calculate the length of a vector", () => {
  const v = new Vector3(1, 2, 2);
  const result = v.length();
  expect(result).toBe(3);
});

it("should normalize a vector", () => {
  const v = new Vector3(3, 4, 0);
  const result = v.normalize();
  expect(result.x).toBeCloseTo(0.6);
  expect(result.y).toBeCloseTo(0.8);
  expect(result.z).toBeCloseTo(0);
});

it("should create a vector from a literal object", () => {
  const v = Vector3.of({ x: 1, y: 2, z: 3 });
  expect(v.x).toBe(1);
  expect(v.y).toBe(2);
  expect(v.z).toBe(3);
});