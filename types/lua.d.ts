declare global {
  /**
   * @noSelf
   */
  export function print(...args: any[]): void;
  /**
   * @noSelf
   */
  export function require(name: string): any;
}
export {};
