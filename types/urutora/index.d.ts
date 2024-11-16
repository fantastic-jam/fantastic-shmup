/* eslint-disable @typescript-eslint/no-invalid-void-type */
import { Font } from "love.graphics";
import { MouseButtonEnum, NodeTypeEnum, Style, Utils } from "./urutora.utils";

export type NodeType = `${NodeTypeEnum}`;
export type MouseButton = `${MouseButtonEnum}`;
export type ActionCallback = (this: void, e: unknown) => void;

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
  action(cb: ActionCallback): void;
  activate(): void;
  center(): void;
  centerX(): number;
  centerY(): number;
  setStyle(style: Partial<Style>, nodeType?: NodeType): this;
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

export interface Panel extends Node {
  rows: number;
  cols: number;
  verticalScale: number;
  horizontalScale: number;
  scrollSpeed: number;
  children: Record<number, Node>;
  colspanAt(row: number, col: number, span: number): this;
  rowspanAt(row: number, col: number, span: number): this;
  addAt(row: number, col: number, component: Node): this;
}
export interface Urutora {
  /** nodes */
  button(this: void, props: Partial<Button>): Button;
  text(this: void, props: Partial<Text>): Button;
  panel(this: void, props: Partial<Panel>): Panel;
  label(this: void, props: Partial<Label>): Label;

  /** methods */
  setDefaultFont(this: void, font: Font): void;
  setDimensions(
    this: void,
    x: number,
    y: number,
    scaleX: number,
    scaleY: number
  ): void;
  add(component: Node): void;
  remove(component: Node): void;
  getByTag(tag: string): Node;
  activateByTag(tag: string): Urutora;
  deactivateByTag(tag: string): Urutora;
  activateGroup(g: string): void;
  deactivateGroup(g: string): void;
  setGroupVisible(g: string, value: boolean): void;
  setGroupEnabled(g: string, value: boolean): void;
  setStyle(style: Style, nodeType?: NodeType): Urutora;
  setFocusedNode(node: Node): void;
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
  export function build(): Urutora;
}
