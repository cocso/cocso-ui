export interface HexColor {
  kind: "HexColor";
  value: `#${string}`;
}

export interface RgbColor {
  b: number;
  g: number;
  kind: "RgbColor";
  r: number;
}

export interface RgbaColor {
  a: number;
  b: number;
  g: number;
  kind: "RgbaColor";
  r: number;
}

export interface TokenRef {
  collection: string;
  kind: "TokenRef";
  token: string;
}

export interface SizeValue {
  kind: "SizeValue";
  unit: "px" | "rem" | "em" | "vw" | "vh" | "%";
  value: number;
}

export interface DurationValue {
  kind: "DurationValue";
  unit: "ms" | "s";
  value: number;
}

export interface NumberValue {
  kind: "NumberValue";
  value: number;
}

export interface StringValue {
  kind: "StringValue";
  value: string;
}

export type ColorValue = HexColor | RgbColor | RgbaColor | TokenRef;

export interface ShadowLayer {
  blur: SizeValue | TokenRef;
  color: ColorValue;
  kind: "ShadowLayer";
  offsetX: SizeValue | TokenRef;
  offsetY: SizeValue | TokenRef;
  spread: SizeValue | TokenRef;
}

export interface Shadow {
  kind: "Shadow";
  layers: ShadowLayer[];
}

export type Value =
  | HexColor
  | RgbColor
  | RgbaColor
  | TokenRef
  | SizeValue
  | DurationValue
  | NumberValue
  | StringValue
  | ShadowLayer
  | Shadow;
