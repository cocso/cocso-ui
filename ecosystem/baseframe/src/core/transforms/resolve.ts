import type {
  ColorValue,
  ShadowLayer,
  SizeValue,
  TokenDecl,
  TokenRef,
  Value,
} from "../types";

export interface TokenResolver {
  resolve(value: Value): Value;
  resolveTokenRef(tokenRef: TokenRef): string;
}

export function createTokenResolver(
  allTokens: TokenDecl[],
  mode: string,
  cssVarNamer: (tokenName: string) => string
): TokenResolver {
  const tokenMap = new Map<string, TokenDecl>(
    allTokens.map((t) => [t.token.name, t])
  );

  return {
    resolve(value: Value): Value {
      return resolveValue(value, tokenMap, mode, cssVarNamer);
    },
    resolveTokenRef(tokenRef: TokenRef): string {
      const fullName = `$${tokenRef.collection}.${tokenRef.token}`;
      const found = tokenMap.get(fullName);

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
  tokenMap: Map<string, TokenDecl>,
  mode: string,
  cssVarNamer: (tokenName: string) => string
): Value {
  switch (value.kind) {
    case "TokenRef": {
      const fullName = `$${value.collection}.${value.token}`;
      const found = tokenMap.get(fullName);
      if (!found) {
        throw new Error(`Token not found: ${fullName}`);
      }
      const varName = cssVarNamer(fullName);
      return { kind: "StringValue", value: `var(${varName})` };
    }

    case "ShadowLayer":
      return {
        kind: "ShadowLayer",
        color: resolveValue(
          value.color,
          tokenMap,
          mode,
          cssVarNamer
        ) as ColorValue,
        offsetX: resolveValue(value.offsetX, tokenMap, mode, cssVarNamer) as
          | SizeValue
          | TokenRef,
        offsetY: resolveValue(value.offsetY, tokenMap, mode, cssVarNamer) as
          | SizeValue
          | TokenRef,
        blur: resolveValue(value.blur, tokenMap, mode, cssVarNamer) as
          | SizeValue
          | TokenRef,
        spread: resolveValue(value.spread, tokenMap, mode, cssVarNamer) as
          | SizeValue
          | TokenRef,
      };

    case "Shadow":
      return {
        kind: "Shadow",
        layers: value.layers.map(
          (layer) =>
            resolveValue(layer, tokenMap, mode, cssVarNamer) as ShadowLayer
        ),
      };

    default:
      return value;
  }
}
