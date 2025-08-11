export function createColor(token: string | undefined): string | undefined {
  if (!token) {
    return undefined;
  }
  if (!token.includes('.')) {
    return token;
  }

  return `var(--color-${token.replace(/\./g, '-')})`;
}

const FONT_WEIGHT_MAP = {
  thin: '100',
  extralight: '200',
  light: '300',
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800',
  black: '900',
} as const;

export type FontWeightToken = keyof typeof FONT_WEIGHT_MAP;

export function createFontWeight(token: string | undefined): string | undefined {
  if (!token) {
    return undefined;
  }

  return token in FONT_WEIGHT_MAP ? FONT_WEIGHT_MAP[token as FontWeightToken] : token;
}
