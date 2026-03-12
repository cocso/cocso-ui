import type {
  ColorValue,
  ParseResult,
  ShadowLayer,
  SizeValue,
  TokenRef,
  Value,
} from "../types";

/** Matches 3-, 4-, 6-, and 8-digit CSS hex color strings. */
const HEX_REGEX =
  /^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{4}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{8})$/;
/** Matches `rgb(r, g, b)` color strings. */
const RGB_REGEX = /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/;
/** Matches `rgba(r, g, b, a)` color strings. */
const RGBA_REGEX =
  /^rgba\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*([01]?\.?\d*)\s*\)$/;
/**
 * Matches token references of the form `$collection.token`
 * where each segment starts with an alphanumeric character.
 */
const TOKEN_REF_REGEX =
  /^\$[a-zA-Z0-9][a-zA-Z0-9_-]*(?:\.[a-zA-Z0-9][a-zA-Z0-9_-]*)+$/;
/** Matches numeric values with a CSS size unit (px, rem, em, vw, vh, %). */
const SIZE_REGEX = /^([+-]?\d*\.?\d+)(px|rem|em|vw|vh|%)$/;
/** Matches numeric values with a CSS time unit (ms or s). */
const DURATION_REGEX = /^([+-]?\d*\.?\d+)(ms|s)$/;
/** Splits a string on any run of whitespace characters. */
const WHITESPACE_REGEX = /\s+/;

/**
 * Parses a raw token value into a structured {@link Value} variant.
 *
 * The parser attempts each format in order:
 * number → hex → rgb → rgba → token reference → shadow → size → duration → string.
 * The result is always `isValid: true`; unrecognised strings fall back to
 * {@link StringValue} rather than returning an error.
 *
 * @param value - The raw scalar value read from a YAML token file.
 * @returns A {@link ParseResult} whose `value` field holds the structured result.
 */
export function parseValue(value: string | number): ParseResult {
  const str = String(value).trim();

  if (typeof value === "number") {
    return { isValid: true, value: { kind: "NumberValue", value } };
  }

  const hex = parseHex(str);
  if (hex.isValid) {
    return hex;
  }

  const rgb = parseRgb(str);
  if (rgb.isValid) {
    return rgb;
  }

  const rgba = parseRgba(str);
  if (rgba.isValid) {
    return rgba;
  }

  const tokenRef = parseTokenRef(str);
  if (tokenRef.isValid) {
    return tokenRef;
  }

  const shadow = parseShadow(str);
  if (shadow.isValid) {
    return shadow;
  }

  const size = parseSize(str);
  if (size.isValid) {
    return size;
  }

  const duration = parseDuration(str);
  if (duration.isValid) {
    return duration;
  }

  return { isValid: true, value: { kind: "StringValue", value: str } };
}

/**
 * Serializes a structured {@link Value} back into its canonical string form.
 *
 * - Colors: `#rrggbb`, `rgb(r, g, b)`, or `rgba(r, g, b, a)`
 * - Token references: `$collection.token`
 * - Sizes / durations: `<number><unit>`
 * - Shadows: comma-separated layers, each formatted as `x y blur spread color`
 * - Numbers: plain decimal string
 * - Strings: returned as-is
 *
 * @param value - The structured value to serialize.
 * @returns The canonical string representation of the value.
 */
export function valueToString(value: Value): string {
  switch (value.kind) {
    case "HexColor":
      return value.value;
    case "RgbColor":
      return `rgb(${value.r}, ${value.g}, ${value.b})`;
    case "RgbaColor":
      return `rgba(${value.r}, ${value.g}, ${value.b}, ${value.a})`;
    case "TokenRef":
      return `$${value.collection}.${value.token}`;
    case "SizeValue":
      return `${value.value}${value.unit}`;
    case "DurationValue":
      return `${value.value}${value.unit}`;
    case "NumberValue":
      return value.value.toString();
    case "StringValue":
      return value.value;
    case "ShadowLayer": {
      const x = valueToString(value.offsetX);
      const y = valueToString(value.offsetY);
      const blur = valueToString(value.blur);
      const spread = valueToString(value.spread);
      const color = valueToString(value.color);
      return `${x} ${y} ${blur} ${spread} ${color}`;
    }
    case "Shadow":
      return value.layers.map((layer) => valueToString(layer)).join(", ");
    default:
      return String(value);
  }
}

/**
 * Parses a CSS hex color string into a {@link HexColor}.
 * Accepts 3-, 4-, 6-, and 8-digit forms. The stored value is lowercased.
 *
 * @param value - The candidate string to parse.
 * @returns A successful {@link ParseResult} with a `HexColor`, or a failure.
 */
function parseHex(value: string): ParseResult {
  if (!HEX_REGEX.test(value)) {
    return { isValid: false, error: `Invalid hex color: ${value}` };
  }

  return {
    isValid: true,
    value: { kind: "HexColor", value: value.toLowerCase() as `#${string}` },
  };
}

/**
 * Parses a `rgb(r, g, b)` string into an {@link RgbColor}.
 * Each channel must be in the range 0–255.
 *
 * @param value - The candidate string to parse.
 * @returns A successful {@link ParseResult} with an `RgbColor`, or a failure.
 */
function parseRgb(value: string): ParseResult {
  const match = value.match(RGB_REGEX);

  if (!match) {
    return { isValid: false, error: `Invalid rgb color: ${value}` };
  }

  const [, r, g, b] = match;
  const red = Number.parseInt(r, 10);
  const green = Number.parseInt(g, 10);
  const blue = Number.parseInt(b, 10);

  if (
    red < 0 ||
    red > 255 ||
    green < 0 ||
    green > 255 ||
    blue < 0 ||
    blue > 255
  ) {
    return { isValid: false, error: `Invalid RGB values: ${value}` };
  }

  return {
    isValid: true,
    value: { kind: "RgbColor", r: red, g: green, b: blue },
  };
}

/**
 * Parses an `rgba(r, g, b, a)` string into an {@link RgbaColor}.
 * RGB channels must be in 0–255; alpha must be in 0–1.
 *
 * @param value - The candidate string to parse.
 * @returns A successful {@link ParseResult} with an `RgbaColor`, or a failure.
 */
function parseRgba(value: string): ParseResult {
  const match = value.match(RGBA_REGEX);

  if (!match) {
    return { isValid: false, error: `Invalid rgba color: ${value}` };
  }

  const [, r, g, b, a] = match;
  const red = Number.parseInt(r, 10);
  const green = Number.parseInt(g, 10);
  const blue = Number.parseInt(b, 10);
  const alpha = Number.parseFloat(a);

  if (
    red < 0 ||
    red > 255 ||
    green < 0 ||
    green > 255 ||
    blue < 0 ||
    blue > 255
  ) {
    return { isValid: false, error: `Invalid RGB values: ${value}` };
  }

  if (alpha < 0 || alpha > 1) {
    return { isValid: false, error: `Invalid alpha value: ${value}` };
  }

  return {
    isValid: true,
    value: { kind: "RgbaColor", r: red, g: green, b: blue, a: alpha },
  };
}

/**
 * Parses a token reference string of the form `$collection.token` into a
 * {@link TokenRef}. The leading `$` is stripped; the last dot-separated
 * segment becomes the token name and the rest form the collection path.
 *
 * @param value - The candidate string to parse.
 * @returns A successful {@link ParseResult} with a `TokenRef`, or a failure.
 */
function parseTokenRef(value: string): ParseResult {
  if (!TOKEN_REF_REGEX.test(value)) {
    return { isValid: false, error: `Invalid token reference: ${value}` };
  }

  const clean = value.substring(1);
  const parts = clean.split(".");

  if (parts.length < 2) {
    return { isValid: false, error: `Invalid token format: ${value}` };
  }

  const token = parts.at(-1);
  const collection = parts.slice(0, -1).join(".");

  if (!token) {
    return { isValid: false, error: `Invalid token format: ${value}` };
  }

  return { isValid: true, value: { kind: "TokenRef", collection, token } };
}

/**
 * Parses a CSS size string (e.g. `16px`, `1.5rem`, `50%`) into a
 * {@link SizeValue}.
 *
 * @param value - The candidate string to parse.
 * @returns A successful {@link ParseResult} with a `SizeValue`, or a failure.
 */
function parseSize(value: string): ParseResult {
  const match = value.match(SIZE_REGEX);

  if (!match) {
    return { isValid: false, error: `Invalid size: ${value}` };
  }

  const [, numValue, unit] = match;
  const num = Number.parseFloat(numValue);

  if (Number.isNaN(num)) {
    return { isValid: false, error: `Invalid size value: ${value}` };
  }

  return {
    isValid: true,
    value: {
      kind: "SizeValue",
      value: num,
      unit: unit as "px" | "rem" | "em" | "vw" | "vh" | "%",
    },
  };
}

/**
 * Parses a CSS duration string (e.g. `200ms`, `0.3s`) into a
 * {@link DurationValue}.
 *
 * @param value - The candidate string to parse.
 * @returns A successful {@link ParseResult} with a `DurationValue`, or a failure.
 */
function parseDuration(value: string): ParseResult {
  const match = value.match(DURATION_REGEX);

  if (!match) {
    return { isValid: false, error: `Invalid duration: ${value}` };
  }

  const [, numValue, unit] = match;
  const num = Number.parseFloat(numValue);

  if (Number.isNaN(num)) {
    return { isValid: false, error: `Invalid duration value: ${value}` };
  }

  return {
    isValid: true,
    value: { kind: "DurationValue", value: num, unit: unit as "ms" | "s" },
  };
}

/**
 * Parses a color value that may be a hex string, `rgb(...)`, `rgba(...)`,
 * a token reference (`$collection.token`), or a CSS `var(...)` expression.
 *
 * @param value - The candidate color string.
 * @returns A successful {@link ParseResult} with a {@link ColorValue}, or a failure.
 */
function parseColor(value: string): ParseResult {
  if (!value) {
    return { isValid: false, error: "Missing color value" };
  }

  if (value.startsWith("$")) {
    return parseTokenRef(value);
  }

  if (value.startsWith("var(")) {
    return { isValid: true, value: { kind: "StringValue", value } };
  }

  const hex = parseHex(value);
  if (hex.isValid) {
    return hex;
  }

  const rgb = parseRgb(value);
  if (rgb.isValid) {
    return rgb;
  }

  const rgba = parseRgba(value);
  if (rgba.isValid) {
    return rgba;
  }

  return { isValid: false, error: `Invalid color: ${value}` };
}

/**
 * Parses a multi-layer shadow string (comma-separated layers) into a
 * {@link Shadow}. Each layer is delegated to {@link parseShadowLayer}.
 * The string must contain at least one `px` value or `$` token reference
 * to be considered a candidate shadow.
 *
 * @param value - The candidate shadow string.
 * @returns A successful {@link ParseResult} with a `Shadow`, or a failure.
 */
function parseShadow(value: string): ParseResult {
  if (!(value.includes("px") || value.includes("$"))) {
    return { isValid: false, error: `Invalid shadow format: ${value}` };
  }

  try {
    const layerStrings = value.split(",").map((s) => s.trim());
    const layers: ShadowLayer[] = [];

    for (const layerStr of layerStrings) {
      const layer = parseShadowLayer(layerStr);
      if (!(layer.isValid && layer.value)) {
        return { isValid: false, error: `Invalid shadow layer: ${layerStr}` };
      }
      layers.push(layer.value as ShadowLayer);
    }

    return { isValid: true, value: { kind: "Shadow", layers } };
  } catch {
    return { isValid: false, error: `Invalid shadow format: ${value}` };
  }
}

/**
 * Parses a single shadow layer string of the form
 * `<offsetX> <offsetY> <blur> <spread> <color>` into a {@link ShadowLayer}.
 * Each positional value may be a size (e.g. `4px`) or a token reference.
 *
 * @param value - A single whitespace-delimited shadow layer string.
 * @returns A successful {@link ParseResult} with a `ShadowLayer`, or a failure.
 */
function parseShadowLayer(value: string): ParseResult {
  const parts = value.trim().split(WHITESPACE_REGEX);

  if (parts.length < 4) {
    return { isValid: false, error: `Invalid shadow layer format: ${value}` };
  }

  try {
    const x = parseSizeOrTokenRef(parts[0]);
    const y = parseSizeOrTokenRef(parts[1]);
    const blur = parseSizeOrTokenRef(parts[2]);
    const spread = parseSizeOrTokenRef(parts[3]);

    if (!(x.isValid && y.isValid && blur.isValid && spread.isValid)) {
      return { isValid: false, error: `Invalid shadow dimensions: ${value}` };
    }

    const colorPart = parts.slice(4).join(" ").trim();
    const color = parseColor(colorPart);

    if (!color.isValid) {
      return { isValid: false, error: `Invalid shadow color: ${colorPart}` };
    }

    return {
      isValid: true,
      value: {
        kind: "ShadowLayer",
        color: color.value as ColorValue,
        offsetX: x.value as SizeValue | TokenRef,
        offsetY: y.value as SizeValue | TokenRef,
        blur: blur.value as SizeValue | TokenRef,
        spread: spread.value as SizeValue | TokenRef,
      },
    };
  } catch {
    return { isValid: false, error: `Invalid shadow layer: ${value}` };
  }
}

/**
 * Parses a string as either a token reference (`$...`) or a CSS size value.
 * Used for individual positional components of a shadow layer.
 *
 * @param value - The candidate string.
 * @returns A {@link ParseResult} delegated to {@link parseTokenRef} or {@link parseSize}.
 */
function parseSizeOrTokenRef(value: string): ParseResult {
  if (value.startsWith("$")) {
    return parseTokenRef(value);
  }
  return parseSize(value);
}
