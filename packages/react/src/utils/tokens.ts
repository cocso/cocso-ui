export function createColor(token: string | undefined): string | undefined {
  if (!token) {
    return undefined;
  }
  return `var(--color-${token.replace(/\./g, '-')})`;
}
