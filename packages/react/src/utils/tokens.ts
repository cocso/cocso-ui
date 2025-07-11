export function createColor(token: string | undefined): string | undefined {
  if (!token) return undefined;
  return `var(--color-${token.replace(/\./g, '-')})`;
}

const FONT_WEIGHT_MAP = {
  thin: '100',
  'extra-light': '200',
  light: '300',
  normal: '400',
  medium: '500',
  'semi-bold': '600',
  bold: '700',
  'extra-bold': '800',
  black: '900',
} as const;

export type FontWeightToken = keyof typeof FONT_WEIGHT_MAP;

export function createFontWeight(token: string | undefined): string | undefined {
  if (!token) return undefined;
  return FONT_WEIGHT_MAP[token as FontWeightToken] ?? token;
}
