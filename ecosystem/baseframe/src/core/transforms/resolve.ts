import type { Value, TokenRef, ShadowLayer, ColorValue, SizeValue, TokenDecl } from '../types';

export interface TokenResolver {
  resolve(value: Value): Value;

  resolveTokenRef(tokenRef: TokenRef): string;
}

export function createTokenResolver(
  allTokens: TokenDecl[],
  mode: string,
  cssVarNamer: (tokenName: string) => string,
): TokenResolver {
  return {
    resolve(value: Value): Value {
      return resolveValue(value, allTokens, mode, cssVarNamer);
    },
    resolveTokenRef(tokenRef: TokenRef): string {
      const fullName = `$${tokenRef.collection}.${tokenRef.token}`;
      const found = allTokens.find((t) => t.token.name === fullName);

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
  mode: string,
  cssVarNamer: (tokenName: string) => string,
): Value {
  switch (value.kind) {
    case 'TokenRef':
      const fullName = `$${value.collection}.${value.token}`;
      const found = allTokens.find((t) => t.token.name === fullName);
      if (!found) {
        throw new Error(`Token not found: ${fullName}`);
      }
      const varName = cssVarNamer(fullName);
      return { kind: 'StringValue', value: `var(${varName})` };

    case 'ShadowLayer':
      return {
        kind: 'ShadowLayer',
        color: resolveValue(value.color, allTokens, mode, cssVarNamer) as ColorValue,
        offsetX: resolveValue(value.offsetX, allTokens, mode, cssVarNamer) as SizeValue | TokenRef,
        offsetY: resolveValue(value.offsetY, allTokens, mode, cssVarNamer) as SizeValue | TokenRef,
        blur: resolveValue(value.blur, allTokens, mode, cssVarNamer) as SizeValue | TokenRef,
        spread: resolveValue(value.spread, allTokens, mode, cssVarNamer) as SizeValue | TokenRef,
      };

    case 'Shadow':
      return {
        kind: 'Shadow',
        layers: value.layers.map(
          (layer) => resolveValue(layer, allTokens, mode, cssVarNamer) as ShadowLayer,
        ),
      };

    default:
      return value;
  }
}
