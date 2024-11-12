export interface Node {
  action(arg0: (this: void, e: any) => void): unknown;
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface Button extends Node {
  text: string;
  onClick: () => void;
}

export interface Slider extends Node {
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}

export interface Checkbox extends Node {
  size: number;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export interface Label extends Node {
  text: string;
}

export interface Urutora {
  /** @noSelf */
  button(props: Partial<Button>): Node;
  setDefaultFont(font: any): void;
  /** @noSelf  */
  setDimensions(x: number, y: number, scaleX: number, scaleY: number): void;
  add(component: any): void;
  remove(component: any): void;
  getByTag(tag: string): any;
  activateByTag(tag: string): Urutora;
  deactivateByTag(tag: string): Urutora;
  activateGroup(g: string): void;
  deactivateGroup(g: string): void;
  setGroupVisible(g: string, value: boolean): void;
  setGroupEnabled(g: string, value: boolean): void;
  setStyle(style: any, nodeType?: string): Urutora;
  setFocusedNode(node: any): void;
  draw(): void;
  update(dt: number): void;
  pressed(x: number, y: number, button: number): void;
  moved(x: number, y: number, dx: number, dy: number): void;
  released(x: number, y: number): void;
  textinput(text: string): void;
  keypressed(k: string, scancode: string, isrepeat: boolean): void;
  wheelmoved(x: number, y: number): void;
  update(dt: number): void;
  draw(): void;
}

/** @noResolution */
declare module "urutora" {
  /**
   * @customName new
   */
  export function ctor(): Urutora;
}
