/* eslint-disable @typescript-eslint/no-invalid-void-type */
import { Font, Image } from "love.graphics";
import { RGBA } from "love.math";

export enum NodeTypeEnum {
  LABEL = 1,
  BUTTON = 2,
  SLIDER = 3,
  TOGGLE = 4,
  TEXT = 5,
  MULTI = 6,
  PANEL = 7,
  JOY = 8,
  IMAGE = 9,
  ANIMATION = 10,
  PROGRESS_BAR = 11,
}

export enum MouseButtonEnum {
  LEFT = 1,
  RIGHT = 2,
}

export enum AlignmentsEnum {
  LEFT = "left",
  CENTER = "center",
  RIGHT = "right",
}

export interface Style {
  padding: number;
  lineStyle: "rough" | "smooth";
  lineWidth: number;
  outline?: boolean;
  cornerRadius?: number;
  font?: Font;
  sliderMark?: Image;
  toggleMark?: Image;

  // colors
  bgColor: RGBA;
  fgColor: RGBA;
  disableBgColor: RGBA;
  disableFgColor: RGBA;
  hoverBgColor?: RGBA;
  hoverFgColor?: RGBA;
  pressedBgColor?: RGBA;
  pressedFgColor?: RGBA;
  progressBarGooColor?: RGBA;

  customLayers?: Record<string, Image>;
}

export interface Node {
  type: NodeTypeEnum;
  text?: string;
  style: Style;
  enabled?: boolean;
  pointed?: boolean;
  pressed?: boolean;
  w?: number;
  h?: number;
  x?: number;
  y?: number;
  align?: "left" | "center" | "right";
  originalW?: number;
}

interface DrawOptions {
  centered?: boolean;
  rotation?: number;
  scale?: number;
}

interface PrintOptions {
  bgColor?: RGBA;
  fgColor?: RGBA;
}

export interface Utils {
  nodeTypes: typeof NodeTypeEnum;
  default_font: Font;
  alignments: typeof AlignmentsEnum;
  sx: number;
  sy: number;
  scrollSpeed: number;
  defaultCurveSegments: number;
  style: Style;
  mouseButtons: typeof MouseButtonEnum;
  isLabel(node: Node): boolean;
  isPanel(node: Node): boolean;
  isMulti(node: Node): boolean;
  isImage(node: Node): boolean;
  isAnimation(node: Node): boolean;
  isToggle(node: Node): boolean;
  isProgressBar(node: Node): boolean;
  isSlider(node: Node): boolean;
  isButton(node: Node): boolean;
  isTextField(node: Node): boolean;
  isJoy(node: Node): boolean;
  textWidth(node: Node): number;
  textHeight(node: Node): number;
  darker(color: RGBA, amount?: number): RGBA;
  brighter(color: RGBA, amount?: number): RGBA;
  colors: {
    BLACK: RGBA;
    WHITE: RGBA;
    GRAY: RGBA;
    DARK_GRAY: RGBA;
    LOVE_BLUE: RGBA;
    LOVE_BLUE_LIGHT: RGBA;
    LOVE_PINK: RGBA;
    RED: RGBA;
  };
  toFixed(value: number, numberOfDecimals: number): string;
  withOpacity(color: RGBA, alpha?: number): RGBA;
  needsBase(node: Node): boolean;
  split(input: string, sep?: string): string[];
  print(text: string, x: number, y: number, data?: PrintOptions): void;
  prettyPrint(
    this: void,
    text: string,
    x: number,
    y: number,
    data?: PrintOptions
  ): void;
  draw(texture: Image, x: number, y: number, data?: DrawOptions): void;
  drawWithShader(
    node: Node,
    texture: Image,
    x: number,
    y: number,
    data?: DrawOptions
  ): void;
  rect(
    mode: "fill" | "line",
    x: number,
    y: number,
    w: number,
    h: number,
    rx?: number,
    ry?: number,
    segments?: number
  ): void;
  line(a: number, b: number, c: number, d: number): void;
  circ(mode: "fill" | "line", x: number, y: number, r: number): void;
  getMouse(): [x: number, y: number];
  pointInsideRect(
    px: number,
    py: number,
    x: number,
    y: number,
    w: number,
    h: number
  ): boolean;
  fixToggleBounds(node: Node): void;
  disabledImgShader: Image;
  pointedImgShader: Image;
  pressedImgShader: Image;
}
