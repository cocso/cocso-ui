import type { Value, TokenDecl, TokenRef } from '../../types';
import { valueToString, parseValue } from '../../parsers';
import { createTokenResolver } from '../../transforms';

export function toCssValue(value: string | number | Value): string {
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return value.toString();
  return valueToString(value);
}

export type Resolver = (name: string, prefix?: string) => string;

export function resolveTokenValue(
  value: string | number,
  allTokens: TokenDecl[],
  resolver: Resolver,
  prefix?: string,
): string | number {
  const text = String(value);

  if (!text.startsWith('$')) {
    const parsed = parseValue(text);
    if (parsed.isValid && parsed.value) {
      const tokenResolver = createTokenResolver(allTokens, 'default', (name) =>
        resolver(name, prefix),
      );
      const resolved = tokenResolver.resolve(parsed.value);
      return toCssValue(resolved);
    }
    return value;
  }

  const parsed = parseValue(text);
  if (!parsed.isValid || !parsed.value) {
    throw new Error(`Invalid token reference: ${text}`);
  }

  const tokenResolver = createTokenResolver(allTokens, 'default', (name) => resolver(name, prefix));
  return tokenResolver.resolveTokenRef(parsed.value as TokenRef);
}
