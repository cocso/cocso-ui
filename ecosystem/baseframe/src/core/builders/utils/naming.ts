const LEADING_DOLLAR = /^\$/;
const DOT_GLOBAL = /\./g;

export function createVarName(name: string, prefix?: string): string {
  const clean = name.replace(LEADING_DOLLAR, "").replace(DOT_GLOBAL, "-");
  return prefix ? `--${prefix}-${clean}` : `--${clean}`;
}
