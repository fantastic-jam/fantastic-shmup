import { MouseButtonEnum, NodeTypeEnum } from "./urutora.utils";

export type NodeType = `${NodeTypeEnum}`;
export type MouseButton = `${MouseButtonEnum}`;

export interface Node {
  /** index */
  idx: number;
  /** selected */
  s: boolean;
  x: number;
  y: number;
  /** width */
  w: number;
  /** height */
  h: number;
  tag: string;
  type: number;
  enabled: boolean;
  visible: boolean;

  update?(dt: number): void;
  action(cb: (this: void, e: any) => void): void;
  activate(): void;
  center(): void;
  centerX(): number;
  centerY(): number;
  setStyle(style: any, nodeType?: NodeType): this;
  setEnabled(value: boolean): this;
  setVisible(value: boolean): this;
  deactivate(): this;
  disable(): this;
  enable(): this;
  hide(): this;
  show(): this;
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

export interface Text extends Node {
  text: string;
}

export interface Utils {
  default_font: any;
  nodeTypes: {
    LABEL: 1;
    BUTTON: 2;
    SLIDER: 3;
    TOGGLE: 4;
    TEXT: 5;
    MULTI: 6;
    PANEL: 7;
    JOY: 8;
    IMAGE: 9;
    ANIMATION: 10;
    PROGRESS_BAR: 11;
  };
  alignments: {
    LEFT: "left";
    CENTER: "center";
    RIGHT: "right";
  };
  mouseButtons: {
    LEFT: 1;
    RIGHT: 2;
  };
  sx: number;
  sy: number;
  scrollSpeed: number;
  defaultCurveSegments: number;
}

export interface Urutora {
  /** nodes */
  button(this: void, props: Partial<Button>): Button;
  text(this: void, props: Partial<Text>): Button;
  setDefaultFont(this: void, font: any): void;
  setDimensions(this: void, x: number, y: number, scaleX: number, scaleY: number): void;
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
  pressed(x: number, y: number, button: number): void;
  moved(x: number, y: number, dx: number, dy: number): void;
  released(x: number, y: number): void;
  textinput(text: string): void;
  keypressed(k: string, scancode: string, isrepeat: boolean): void;
  wheelmoved(x: number, y: number): void;
  update(dt: number): void;
  draw(): void;
  nodes: Node[];
}

/** @noResolution */
declare module "urutora" {
  export const utils: Utils;
  export const lm: typeof love.mouse;
  export const lg: typeof love.graphics;
  /**
   * @customName new
   */
  export function ctor(): Urutora;
}
