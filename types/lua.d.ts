/* eslint-disable @typescript-eslint/no-invalid-void-type */
declare global {
  export function print(this: void, ...args: unknown[]): void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export function require(this: void, name: string): any;
}
export {};
