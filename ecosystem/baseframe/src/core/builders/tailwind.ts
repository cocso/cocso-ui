import { buildValidatedAst } from "../transforms";
import type { Ast, Collections, Token, TokenDecl } from "../types";
import { createVarName } from "./utils/naming";

export interface TailwindOptions {
  banner?: string;
  prefix?: string;
}

// Collections whose tokens are excluded from @theme (Tailwind handles spacing natively)
const SKIP_COLLECTIONS = new Set(["spacing"]);
const TOKEN_COLLECTION_REGEX = /^\$([^.]+)\./;

function extractCollection(tokenName: string): string | null {
  const match = tokenName.match(TOKEN_COLLECTION_REGEX);
  return match ? match[1] : null;
}

function createTheme(tokens: TokenDecl[], dsPrefix: string): string {
  const vars: string[] = [];
  const processed = new Set<string>();

  for (const token of tokens) {
    if (processed.has(token.token.name)) {
      continue;
    }
    processed.add(token.token.name);

    const collection = extractCollection(token.token.name);
    if (!collection || SKIP_COLLECTIONS.has(collection)) {
      continue;
    }

    const twVar = createVarName(token.token.name);
    const dsVar = createVarName(token.token.name, dsPrefix);
    vars.push(`  ${twVar}: var(${dsVar});`);
  }

  return vars.length > 0 ? `@theme {\n${vars.join("\n")}\n}` : "";
}

function createUtilities(): string[] {
  return ["@utility z-* { z-index: --value(--z-index-*); }"];
}

export function generateFromAst(ast: Ast, options: TailwindOptions): string {
  const { banner = "", prefix = "cocso" } = options;
  const { tokens, collections } = ast;
  const parts: string[] = [];

  if (banner) {
    parts.push(banner);
  }

  for (const collection of collections) {
    const collectionTokens = tokens.filter(
      (token) => token.token.collection === collection.name
    );

    const theme = createTheme(collectionTokens, prefix);
    if (theme) {
      parts.push(theme);
      parts.push("");
    }
  }

  const utilities = createUtilities();

  if (utilities.length > 0) {
    parts.push(...utilities);
    parts.push("");
  }

  return parts.join("\n");
}

export function generateTailwindCSS(
  tokens: Token[],
  collections: Collections,
  options: TailwindOptions = {}
): string {
  const ast = buildValidatedAst(tokens, collections);
  return generateFromAst(ast, options);
}

export const tailwind = {
  generateTailwindCSS,
  generateFromAst,
  createVarName,
} as const;
