import type { Schema, TokenCollection } from '../schema';
import { formatTokenName } from '../validation';

export interface CssBuilderOptions {
  includeComments?: boolean;
}

export const buildCss = (schemas: Schema[], options: CssBuilderOptions = {}): string => {
  const { includeComments = true } = options;
  const outputLines: string[] = [];

  if (includeComments) {
    outputLines.push('/* COCSO Design Tokens - Generated CSS Variables */');
    outputLines.push('');
  }

  outputLines.push(':root {');

  for (const schema of schemas) {
    if (includeComments) {
      outputLines.push(`  /* ${schema.metadata.name} (${schema.kind}) */`);
    }

    const tokens = extractTokensFromSchema(schema, schemas);
    for (const [tokenName, tokenValue] of Object.entries(tokens)) {
      const cssVariable = formatTokenName(tokenName);
      outputLines.push(`  ${cssVariable}: ${String(tokenValue)};`);
    }

    if (includeComments) {
      outputLines.push('');
    }
  }

  if (outputLines[outputLines.length - 1] === '') {
    outputLines.pop();
  }

  outputLines.push('}');

  return outputLines.join('\n');
};

const resolveTokenReference = (value: string | number, allSchemas: Schema[]): string | number => {
  if (typeof value !== 'string') {
    return value;
  }

  if (value.startsWith('$')) {
    const cssVarName = formatTokenName(value);
    return `var(${cssVarName})`;
  }

  for (const schema of allSchemas) {
    if (schema.data?.tokens && schema.data.tokens[value]) {
      const cssVarName = formatTokenName(value);
      return `var(${cssVarName})`;
    }
  }

  return value;
};

const extractTokensFromSchema = (
  schema: Schema,
  allSchemas: Schema[],
): Record<string, string | number> => {
  const result: Record<string, string | number> = {};

  if (schema.data?.tokens) {
    for (const [tokenName, tokenDef] of Object.entries(schema.data.tokens)) {
      const value = tokenDef.values;

      if (typeof value === 'object' && value !== null) {
        if (Array.isArray(value)) {
          const stringArray = value.map((item: unknown) => String(item));
          result[tokenName] = stringArray.join(', ');
        } else {
          continue;
        }
      } else {
        result[tokenName] = resolveTokenReference(value, allSchemas);
      }
    }
  }

  return result;
};

export const buildCssFile = (schemas: Schema[], options: CssBuilderOptions = {}): string => {
  const css = buildCss(schemas, options);
  return css + '\n';
};
