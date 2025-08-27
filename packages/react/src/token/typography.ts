export const fontSize = {
  10: 10,
  11: 11,
  12: 12,
  13: 13,
  14: 14,
  15: 15,
  16: 16,
  18: 18,
  20: 20,
  24: 24,
  28: 28,
  32: 32,
  36: 36,
  44: 44,
  60: 60,
} as const;

export type FontSize = keyof typeof fontSize;

export type ResponsiveFontSize =
  | FontSize
  | [FontSize, FontSize?, FontSize?]
  | { base: FontSize; tablet?: FontSize; desktop?: FontSize };

/*
  Font weights as defined in the CSS specification.
  @see https://developer.mozilla.org/en-US/docs/Web/CSS/font-weight
 */
export const fontWeight = {
  thin: 100,
  extralight: 200,
  light: 300,
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
  black: 900,
} as const;

export type FontWeight = keyof typeof fontWeight;

/*
  Line heights as defined in the tailwindcss documentation.
  @see https://v3.tailwindcss.com/docs/line-height
 */
export const lineHeight = {
  none: 1,
  tight: 1.25,
  snug: 1.375,
  normal: 1.5,
  relaxed: 1.625,
  loose: 2,
} as const;

export type LineHeight = keyof typeof lineHeight;
