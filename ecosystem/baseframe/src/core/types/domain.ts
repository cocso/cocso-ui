/** A color expressed as a CSS hex string (e.g. `#fff`, `#aabbcc`). */
export interface HexColor {
  /** Discriminant tag identifying this as a hex color. */
  kind: "HexColor";
  /** The hex color string including the leading `#`. */
  value: `#${string}`;
}

/** A color expressed as red, green, and blue channel values (0–255). */
export interface RgbColor {
  /** Blue channel (0–255). */
  b: number;
  /** Green channel (0–255). */
  g: number;
  /** Discriminant tag identifying this as an RGB color. */
  kind: "RgbColor";
  /** Red channel (0–255). */
  r: number;
}

/** A color expressed as red, green, blue, and alpha channel values. */
export interface RgbaColor {
  /** Alpha channel (0–1). */
  a: number;
  /** Blue channel (0–255). */
  b: number;
  /** Green channel (0–255). */
  g: number;
  /** Discriminant tag identifying this as an RGBA color. */
  kind: "RgbaColor";
  /** Red channel (0–255). */
  r: number;
}

/**
 * A reference to another token within a named collection.
 * Serialized as `$<collection>.<token>`.
 */
export interface TokenRef {
  /** The collection that owns the referenced token. */
  collection: string;
  /** Discriminant tag identifying this as a token reference. */
  kind: "TokenRef";
  /** The name of the referenced token within the collection. */
  token: string;
}

/** A numeric dimension with a CSS-compatible unit. */
export interface SizeValue {
  /** Discriminant tag identifying this as a size value. */
  kind: "SizeValue";
  /** The CSS unit for this dimension. */
  unit: "px" | "rem" | "em" | "vw" | "vh" | "%";
  /** The numeric magnitude. */
  value: number;
}

/** A time duration with a CSS-compatible unit. */
export interface DurationValue {
  /** Discriminant tag identifying this as a duration value. */
  kind: "DurationValue";
  /** The time unit: milliseconds or seconds. */
  unit: "ms" | "s";
  /** The numeric magnitude. */
  value: number;
}

/** A bare numeric value without a unit. */
export interface NumberValue {
  /** Discriminant tag identifying this as a number value. */
  kind: "NumberValue";
  /** The numeric value. */
  value: number;
}

/** A plain string value that does not match any structured token format. */
export interface StringValue {
  /** Discriminant tag identifying this as a string value. */
  kind: "StringValue";
  /** The raw string content. */
  value: string;
}

/**
 * Union of all value types that can appear as a color:
 * a hex color, RGB, RGBA, or a reference to another token.
 */
export type ColorValue = HexColor | RgbColor | RgbaColor | TokenRef;

/** A single layer within a multi-layer box or drop shadow definition. */
export interface ShadowLayer {
  /** Blur radius of the shadow. */
  blur: SizeValue | TokenRef;
  /** Shadow color. */
  color: ColorValue;
  /** Discriminant tag identifying this as a shadow layer. */
  kind: "ShadowLayer";
  /** Horizontal offset of the shadow. */
  offsetX: SizeValue | TokenRef;
  /** Vertical offset of the shadow. */
  offsetY: SizeValue | TokenRef;
  /** Spread radius of the shadow. */
  spread: SizeValue | TokenRef;
}

/** A composed shadow made up of one or more {@link ShadowLayer} values. */
export interface Shadow {
  /** Discriminant tag identifying this as a shadow. */
  kind: "Shadow";
  /** Ordered list of shadow layers rendered back-to-front. */
  layers: ShadowLayer[];
}

/**
 * Discriminated union of every supported design-token value type.
 * The `kind` field acts as the discriminant for exhaustive narrowing.
 */
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
