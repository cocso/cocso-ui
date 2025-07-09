export interface HexColor {
  kind: 'HexColor';
  value: `#${string}`;
}

export interface RgbColor {
  kind: 'RgbColor';
  r: number;
  g: number;
  b: number;
}

export interface RgbaColor {
  kind: 'RgbaColor';
  r: number;
  g: number;
  b: number;
  a: number;
}

export interface TokenRef {
  kind: 'TokenRef';
  collection: string;
  token: string;
}

export interface SizeValue {
  kind: 'SizeValue';
  value: number;
  unit: 'px' | 'rem' | 'em' | 'vw' | 'vh' | '%';
}

export interface DurationValue {
  kind: 'DurationValue';
  value: number;
  unit: 'ms' | 's';
}

export interface NumberValue {
  kind: 'NumberValue';
  value: number;
}

export interface StringValue {
  kind: 'StringValue';
  value: string;
}

export type ColorValue = HexColor | RgbColor | RgbaColor | TokenRef;

export interface ShadowLayer {
  kind: 'ShadowLayer';
  offsetX: SizeValue | TokenRef;
  offsetY: SizeValue | TokenRef;
  blur: SizeValue | TokenRef;
  spread: SizeValue | TokenRef;
  color: ColorValue;
}

export interface Shadow {
  kind: 'Shadow';
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
