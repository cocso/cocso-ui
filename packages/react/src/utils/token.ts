export function createColor(token: string | undefined): string | undefined {
  if (!token) {
    return undefined;
  }
  if (!token.includes('.')) {
    return token;
  }

  return `var(--color-${token.replace(/\./g, '-')})`;
}
