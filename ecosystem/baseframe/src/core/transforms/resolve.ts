import type { ColorValue, ShadowLayer, SizeValue, TokenDecl, TokenRef, Value } from '../types';

export interface TokenResolver {
  resolve(value: Value): Value;

  resolveTokenRef(tokenRef: TokenRef): string;
}

export function createTokenResolver(
  allTokens: TokenDecl[],
  cssVarNamer: (tokenName: string) => string,
): TokenResolver {
  return {
    resolve(value: Value): Value {
      return resolveValue(value, allTokens, cssVarNamer);
    },
    resolveTokenRef(tokenRef: TokenRef): string {
      const fullName = `$${tokenRef.collection}.${tokenRef.token}`;
      const found = allTokens.find(t => t.token.name === fullName);

      if (!found) {
        throw new Error(`Token not found: ${fullName}`);
      }

      const varName = cssVarNamer(fullName);
      return `var(${varName})`;
    },
  };
}

function resolveValue(
  value: Value,
  allTokens: TokenDecl[],
  cssVarNamer: (tokenName: string) => string,
): Value {
  switch (value.kind) {
    case 'TokenRef': {
      const fullName = `$${value.collection}.${value.token}`;
      const found = allTokens.find(t => t.token.name === fullName);
      if (!found) {
        throw new Error(`Token not found: ${fullName}`);
      }
      const varName = cssVarNamer(fullName);
      return { kind: 'StringValue', value: `var(${varName})` };
    }

    case 'ShadowLayer':
      return {
        kind: 'ShadowLayer',
        color: resolveValue(value.color, allTokens, cssVarNamer) as ColorValue,
        offsetX: resolveValue(value.offsetX, allTokens, cssVarNamer) as SizeValue | TokenRef,
        offsetY: resolveValue(value.offsetY, allTokens, cssVarNamer) as SizeValue | TokenRef,
        blur: resolveValue(value.blur, allTokens, cssVarNamer) as SizeValue | TokenRef,
        spread: resolveValue(value.spread, allTokens, cssVarNamer) as SizeValue | TokenRef,
      };

    case 'Shadow':
      return {
        kind: 'Shadow',
        layers: value.layers.map(
          layer => resolveValue(layer, allTokens, cssVarNamer) as ShadowLayer,
        ),
      };

    default:
      return value;
  }
}
