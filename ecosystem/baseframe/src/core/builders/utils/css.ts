import type { TokenDecl, Value, TokenRef } from '../../types';
import { parseValue, valueToString } from '../../parsers';
import { createTokenResolver } from '../../transforms';

export function createCssVarName(name: string, prefix?: string): string {
  const clean = name.replace(/^\$/, '').replace(/\./g, '-');
  return prefix ? `--${prefix}-${clean}` : `--${clean}`;
}

export function toCssValue(value: string | number | Value): string {
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return value.toString();
  return valueToString(value);
}

export function resolveTokenValue(
  value: string | number,
  allTokens: TokenDecl[],
  prefix?: string,
): string | number {
  const text = String(value);

  if (!text.startsWith('$')) {
    const parsed = parseValue(text);
    if (parsed.isValid && parsed.value) {
      const resolver = createTokenResolver(allTokens, 'default', (name) =>
        createCssVarName(name, prefix),
      );
      const resolved = resolver.resolve(parsed.value);
      return toCssValue(resolved);
    }
    return value;
  }

  const parsed = parseValue(text);
  if (!parsed.isValid || !parsed.value) {
    throw new Error(`Invalid token reference: ${text}`);
  }

  const resolver = createTokenResolver(allTokens, 'default', (name) =>
    createCssVarName(name, prefix),
  );
  return resolver.resolveTokenRef(parsed.value as TokenRef);
}
