export const fontSize = {
  10: 10,
  12: 12,
  14: 14,
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

/*
  Font weights as defined in the CSS specification.
  @see https://developer.mozilla.org/en-US/docs/Web/CSS/font-weight
 */
export const fontWeight = {
  regular: 400,
  medium: 500,
  semiBold: 600,
  bold: 700,
  extraBold: 800,
  black: 900,
} as const;

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
