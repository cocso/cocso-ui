import { buildValidatedAst, createTokenResolver } from "../transforms";
import type { Ast, Collections, Token, TokenDecl } from "../types";
import { resolveValueWithResolver, toCssValue } from "./utils";
import { createVarName } from "./utils/naming";

export interface CssVarsOptions {
  banner?: string;
  prefix?: string;
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

export function generateCssVariables(
  tokens: Token[],
  collections: Collections,
  options: CssVarsOptions = {}
): string {
  const ast = buildValidatedAst(tokens, collections);
  return generateFromAst(ast, options);
}

export const cssVars = {
  generateCssVariables,
  generateFromAst,
  createVarName,
} as const;
