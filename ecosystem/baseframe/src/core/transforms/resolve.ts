import type {
  ColorValue,
  ShadowLayer,
  SizeValue,
  TokenDecl,
  TokenRef,
  Value,
} from "../types";

/** Strategy for resolving token values and references to CSS expressions. */
export interface TokenResolver {
  /**
   * Resolves a structured `Value`, replacing any embedded `TokenRef` nodes
   * with `StringValue` nodes containing `var(--…)` expressions.
   */
  resolve(value: Value): Value;

  /**
   * Resolves a `TokenRef` directly to a `var(--…)` CSS custom property string.
   *
   * @throws {Error} When the referenced token does not exist in the token map.
   */
  resolveTokenRef(tokenRef: TokenRef): string;
}

/**
 * Creates a `TokenResolver` bound to a specific set of token declarations and
 * a rendering mode.
 *
 * The resolver uses `cssVarNamer` to convert token names to their CSS custom
 * property equivalents, enabling the same resolver logic to work with different
 * naming prefixes.
 *
 * @param allTokens - Full list of token declarations available for reference lookup.
 * @param mode - The active mode (e.g. `"default"`, `"dark"`) used when resolving values.
 * @param cssVarNamer - Function that maps a token name to a CSS variable name string.
 */
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

/**
 * Recursively resolves a `Value` node by replacing `TokenRef` leaves with
 * `StringValue` nodes that contain `var(--…)` CSS expressions.
 *
 * `ShadowLayer` and `Shadow` composite values are resolved depth-first so that
 * every nested reference is expanded before the parent value is returned.
 * All other value kinds are returned unchanged.
 */
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
