import { buildValidatedAst, createTokenResolver } from "../transforms";
import type { Ast, Collections, Token, TokenDecl } from "../types";
import { resolveValueWithResolver, toCssValue } from "./utils";
import { createVarName } from "./utils/naming";

/** Options for CSS variable generation. */
export interface CssVarsOptions {
  /** Optional comment banner prepended to the generated CSS output. */
  banner?: string;
  /** Prefix for CSS variable names (e.g. `"cocso"` produces `--cocso-*`). */
  prefix?: string;
  /**
   * Maps each collection and mode to a CSS selector.
   * Tokens in that mode are emitted under the specified selector.
   * Defaults to `:root` when a collection/mode entry is absent.
   */
  selectors?: {
    [collection: string]: {
      [mode: string]: string;
    };
  };
}

function createDeclaration(
  token: TokenDecl,
  mode: string,
  resolver: ReturnType<typeof createTokenResolver>,
  prefix?: string
): string {
  const value = token.values.find((v) => v.mode === mode);
  if (!value) {
    throw new Error(
      `No value found for token '${token.token.name}' in mode '${mode}'`
    );
  }

  const resolvedValue = resolveValueWithResolver(value.value, resolver);
  const varName = createVarName(token.token.name, prefix);
  return `${varName}: ${toCssValue(resolvedValue)};`;
}

function createRule(
  selector: string,
  tokens: TokenDecl[],
  mode: string,
  allTokens: TokenDecl[],
  prefix?: string
): string {
  const resolver = createTokenResolver(allTokens, mode, (name) =>
    createVarName(name, prefix)
  );
  const declarations = tokens
    .map((token) => `  ${createDeclaration(token, mode, resolver, prefix)}`)
    .join("\n");
  return `${selector} {\n${declarations}\n}`;
}

/**
 * Generates a CSS string of custom property declarations from a validated AST.
 *
 * Iterates over every collection and mode in the AST and emits a CSS rule block
 * scoped to the selector specified in `options.selectors`, falling back to
 * `:root` when no selector is configured.
 */
export function generateFromAst(ast: Ast, options: CssVarsOptions): string {
  const { prefix, banner = "", selectors = {} } = options;
  const { tokens, collections } = ast;

  const css = collections
    .flatMap((collection) => {
      const collectionTokens = tokens.filter(
        (token) => token.token.collection === collection.name
      );

      return collection.modes.map((mode) => {
        const selector = selectors[collection.name]?.[mode] || ":root";

        return createRule(selector, collectionTokens, mode, tokens, prefix);
      });
    })
    .join("\n\n");

  return `${banner}${css}\n`;
}

/**
 * Validates and builds an AST from raw token data, then generates CSS
 * custom property declarations.
 *
 * Combines `buildValidatedAst` and `generateFromAst` into a single call.
 */
export function generateCssVariables(
  tokens: Token[],
  collections: Collections,
  options: CssVarsOptions = {}
): string {
  const ast = buildValidatedAst(tokens, collections);
  return generateFromAst(ast, options);
}

/** Grouped entry point for CSS variable generation utilities. */
export const cssVars = {
  generateCssVariables,
  generateFromAst,
  createVarName,
} as const;
