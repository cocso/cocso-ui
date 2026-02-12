export function createVarName(name: string, prefix?: string): string {
  const clean = name.replace(/^\$/, '').replace(/\./g, '-');
  return prefix ? `--${prefix}-${clean}` : `--${clean}`;
}
