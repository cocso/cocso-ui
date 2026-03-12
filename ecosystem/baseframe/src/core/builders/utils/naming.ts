const LEADING_DOLLAR = /^\$/;
const DOT_GLOBAL = /\./g;

/**
 * Converts a token name such as `$color.white` into a CSS custom property name.
 *
 * The leading `$` is stripped, dots are replaced with hyphens, and an optional
 * `prefix` is inserted after the leading `--`.
 *
 * @example
 * createVarName("$color.white")           // "--color-white"
 * createVarName("$color.white", "cocso")  // "--cocso-color-white"
 */
export function createVarName(name: string, prefix?: string): string {
  const clean = name.replace(LEADING_DOLLAR, "").replace(DOT_GLOBAL, "-");
  return prefix ? `--${prefix}-${clean}` : `--${clean}`;
}
