import { rawCssVariables } from "./tokens.generated";

const FALLBACK_TRANSPARENT = "transparent";
const CSS_VARIABLE_REFERENCE_PATTERN = /^var\((--cocso-[a-z0-9-]+)\)$/;
const cssVariableMap: Record<string, string> = rawCssVariables;

const resolveVariableReference = (value: string): string => {
  const match = value.match(CSS_VARIABLE_REFERENCE_PATTERN);

  if (!match) {
    return value;
  }

  const referencedVariable = match[1];
  const referencedValue = cssVariableMap[referencedVariable];

  if (!referencedValue) {
    return value;
  }

  return resolveVariableReference(referencedValue);
};

const getColor = (tokenName: string): string => {
  const variableName = `--cocso-color-${tokenName}` as const;
  const value = cssVariableMap[variableName];

  if (!value) {
    throw new Error(`Missing color token: ${variableName}`);
  }

  return resolveVariableReference(value);
};

const toNumber = (value: string): number => {
  const parsed = Number.parseFloat(value.replace("px", ""));

  if (Number.isNaN(parsed)) {
    throw new Error(`Expected numeric token value, received: ${value}`);
  }

  return parsed;
};

const getNumberToken = (tokenName: string): number => {
  const value = cssVariableMap[tokenName];

  if (!value) {
    throw new Error(`Missing numeric token: ${tokenName}`);
  }

  return toNumber(resolveVariableReference(value));
};

const createColorScale = (scaleName: string) => ({
  50: getColor(`${scaleName}-50`),
  100: getColor(`${scaleName}-100`),
  200: getColor(`${scaleName}-200`),
  300: getColor(`${scaleName}-300`),
  400: getColor(`${scaleName}-400`),
  500: getColor(`${scaleName}-500`),
  600: getColor(`${scaleName}-600`),
  700: getColor(`${scaleName}-700`),
  800: getColor(`${scaleName}-800`),
  900: getColor(`${scaleName}-900`),
  950: getColor(`${scaleName}-950`),
});

const neutral = createColorScale("neutral");
const primary = createColorScale("primary");
const danger = createColorScale("danger");
const warning = createColorScale("warning");
const success = createColorScale("success");
const info = createColorScale("info");

export const colors = {
  transparent: FALLBACK_TRANSPARENT,
  white: getColor("white"),
  whiteAlpha5: getColor("white-alpha-5"),
  whiteAlpha10: getColor("white-alpha-10"),
  whiteAlpha20: getColor("white-alpha-20"),
  whiteAlpha30: getColor("white-alpha-30"),
  whiteAlpha40: getColor("white-alpha-40"),
  whiteAlpha50: getColor("white-alpha-50"),
  whiteAlpha60: getColor("white-alpha-60"),
  whiteAlpha70: getColor("white-alpha-70"),
  whiteAlpha80: getColor("white-alpha-80"),
  whiteAlpha90: getColor("white-alpha-90"),
  black: getColor("black"),
  blackAlpha5: getColor("black-alpha-5"),
  blackAlpha10: getColor("black-alpha-10"),
  blackAlpha20: getColor("black-alpha-20"),
  blackAlpha30: getColor("black-alpha-30"),
  blackAlpha40: getColor("black-alpha-40"),
  blackAlpha50: getColor("black-alpha-50"),
  blackAlpha60: getColor("black-alpha-60"),
  blackAlpha70: getColor("black-alpha-70"),
  blackAlpha80: getColor("black-alpha-80"),
  blackAlpha90: getColor("black-alpha-90"),
  neutral50: neutral[50],
  neutral100: neutral[100],
  neutral200: neutral[200],
  neutral300: neutral[300],
  neutral400: neutral[400],
  neutral500: neutral[500],
  neutral600: neutral[600],
  neutral700: neutral[700],
  neutral800: neutral[800],
  neutral900: neutral[900],
  neutral950: neutral[950],
  primary50: primary[50],
  primary100: primary[100],
  primary200: primary[200],
  primary300: primary[300],
  primary400: primary[400],
  primary500: primary[500],
  primary600: primary[600],
  primary700: primary[700],
  primary800: primary[800],
  primary900: primary[900],
  primary950: primary[950],
  danger50: danger[50],
  danger100: danger[100],
  danger200: danger[200],
  danger300: danger[300],
  danger400: danger[400],
  danger500: danger[500],
  danger600: danger[600],
  danger700: danger[700],
  danger800: danger[800],
  danger900: danger[900],
  danger950: danger[950],
  warning50: warning[50],
  warning100: warning[100],
  warning200: warning[200],
  warning300: warning[300],
  warning400: warning[400],
  warning500: warning[500],
  warning600: warning[600],
  warning700: warning[700],
  warning800: warning[800],
  warning900: warning[900],
  warning950: warning[950],
  success50: success[50],
  success100: success[100],
  success200: success[200],
  success300: success[300],
  success400: success[400],
  success500: success[500],
  success600: success[600],
  success700: success[700],
  success800: success[800],
  success900: success[900],
  success950: success[950],
  info50: info[50],
  info100: info[100],
  info200: info[200],
  info300: info[300],
  info400: info[400],
  info500: info[500],
  info600: info[600],
  info700: info[700],
  info800: info[800],
  info900: info[900],
  info950: info[950],
  textPrimary: getColor("text-primary"),
  textSecondary: getColor("text-secondary"),
  textTertiary: getColor("text-tertiary"),
} as const;

export type ColorToken = keyof typeof colors;

export const spacing = {
  s0: getNumberToken("--cocso-spacing-0"),
  s1: getNumberToken("--cocso-spacing-1"),
  s2: getNumberToken("--cocso-spacing-2"),
  s3: getNumberToken("--cocso-spacing-3"),
  s4: getNumberToken("--cocso-spacing-4"),
  s5: getNumberToken("--cocso-spacing-5"),
  s6: getNumberToken("--cocso-spacing-6"),
  s7: getNumberToken("--cocso-spacing-7"),
  s8: getNumberToken("--cocso-spacing-8"),
  s9: getNumberToken("--cocso-spacing-9"),
  s10: getNumberToken("--cocso-spacing-10"),
  s11: getNumberToken("--cocso-spacing-11"),
  s12: getNumberToken("--cocso-spacing-12"),
  s13: getNumberToken("--cocso-spacing-13"),
  s14: getNumberToken("--cocso-spacing-14"),
  s15: getNumberToken("--cocso-spacing-15"),
  s16: getNumberToken("--cocso-spacing-16"),
  s17: getNumberToken("--cocso-spacing-17"),
  s18: getNumberToken("--cocso-spacing-18"),
  s19: getNumberToken("--cocso-spacing-19"),
  s20: getNumberToken("--cocso-spacing-20"),
  s21: getNumberToken("--cocso-spacing-21"),
  max: getNumberToken("--cocso-spacing-max"),
} as const;

export type SpacingToken = keyof typeof spacing;

export const radius = {
  r1: getNumberToken("--cocso-radius-1"),
  r2: getNumberToken("--cocso-radius-2"),
  r3: getNumberToken("--cocso-radius-3"),
  r4: getNumberToken("--cocso-radius-4"),
  r5: getNumberToken("--cocso-radius-5"),
  r6: getNumberToken("--cocso-radius-6"),
  full: getNumberToken("--cocso-radius-full"),
} as const;

export type RadiusToken = keyof typeof radius;

export const fontSize = {
  12: getNumberToken("--cocso-text-xs"),
  14: getNumberToken("--cocso-text-sm"),
  16: getNumberToken("--cocso-text-base"),
} as const;

export type FontSizeToken = keyof typeof fontSize;

export const fontWeight = {
  thin: getNumberToken("--cocso-font-weight-thin"),
  extralight: getNumberToken("--cocso-font-weight-extralight"),
  light: getNumberToken("--cocso-font-weight-light"),
  normal: getNumberToken("--cocso-font-weight-regular"),
  medium: getNumberToken("--cocso-font-weight-medium"),
  semibold: getNumberToken("--cocso-font-weight-semibold"),
  bold: getNumberToken("--cocso-font-weight-bold"),
  extrabold: getNumberToken("--cocso-font-weight-extrabold"),
  black: getNumberToken("--cocso-font-weight-black"),
} as const;

export type FontWeightToken = keyof typeof fontWeight;

export const lineHeight = {
  none: 1,
  tight: 1.25,
  snug: 1.375,
  normal: 1.5,
  relaxed: 1.625,
  loose: 2,
} as const;

export type LineHeightToken = keyof typeof lineHeight;

export interface ShadowToken {
  elevation: number;
  shadowColor: string;
  shadowOffset: {
    height: number;
    width: number;
  };
  shadowOpacity: number;
  shadowRadius: number;
}

export const shadows: Record<"xs" | "sm" | "md" | "lg", ShadowToken> = {
  xs: {
    elevation: 1,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
  },
  sm: {
    elevation: 2,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  md: {
    elevation: 4,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
  },
  lg: {
    elevation: 6,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
  },
};

export const zIndex = {
  behind: getNumberToken("--cocso-z-index-behind"),
  base: getNumberToken("--cocso-z-index-base"),
  above: getNumberToken("--cocso-z-index-above"),
  header: getNumberToken("--cocso-z-index-header"),
  overlay: getNumberToken("--cocso-z-index-overlay"),
  dialog: getNumberToken("--cocso-z-index-dialog"),
  dialogContent: getNumberToken("--cocso-z-index-dialog-content"),
} as const;
