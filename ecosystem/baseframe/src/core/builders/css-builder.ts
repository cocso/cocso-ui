import postcss from 'postcss';
// @ts-ignore
import autoprefixer from 'autoprefixer';
// @ts-ignore
import cssnano from 'cssnano';
import type { Schema, TokenCollection } from '../schema';
import { formatTokenName } from '../validation';

export interface CssBuilderOptions {
  includeComments?: boolean;
  minify?: boolean;
  selector?: string;
  autoprefixer?: boolean;
}

export const buildCss = async (schemas: Schema[], options: CssBuilderOptions = {}): Promise<string> => {
  const { 
    includeComments = true, 
    minify = false, 
    selector = ':root',
    autoprefixer: enableAutoprefixer = true
  } = options;

  const cssRoot = postcss.root();

  if (includeComments) {
    cssRoot.append(postcss.comment({ text: ' COCSO Design Tokens - Generated CSS Variables ' }));
  }

  const variablesRule = postcss.rule({ selector });

  for (const schema of schemas) {
    if (includeComments) {
      variablesRule.append(
        postcss.comment({ text: ` ${schema.metadata.name} (${schema.kind}) ` })
      );
    }

    const extractedTokens = extractTokensFromSchema(schema, schemas);
    
    for (const [tokenName, tokenValue] of Object.entries(extractedTokens)) {
      const cssVariableName = formatTokenName(tokenName);
      const cssDeclaration = postcss.decl({
        prop: cssVariableName,
        value: String(tokenValue)
      });
      
      variablesRule.append(cssDeclaration);
    }
  }

  cssRoot.append(variablesRule);

  const postcssPlugins = [];
  
  if (enableAutoprefixer) {
    postcssPlugins.push(autoprefixer());
  }
  
  if (minify) {
    postcssPlugins.push(cssnano({
      preset: ['default', {
        discardComments: !includeComments,
        normalizeWhitespace: true,
        minifySelectors: true,
        minifyParams: true,
      }]
    }));
  }

  const cssProcessor = postcss(postcssPlugins);
  const processResult = await cssProcessor.process(cssRoot, { from: undefined });
  
  return processResult.css;
};

const resolveTokenReference = (tokenValue: string | number, availableSchemas: Schema[]): string | number => {
  if (typeof tokenValue !== 'string') {
    return tokenValue;
  }

  if (tokenValue.startsWith('$')) {
    const cssVariableName = formatTokenName(tokenValue);
    return `var(${cssVariableName})`;
  }

  for (const schema of availableSchemas) {
    if (schema.data?.tokens && schema.data.tokens[tokenValue]) {
      const cssVariableName = formatTokenName(tokenValue);
      return `var(${cssVariableName})`;
    }
  }

  return tokenValue;
};

const extractTokensFromSchema = (
  targetSchema: Schema,
  availableSchemas: Schema[],
): Record<string, string | number> => {
  const extractedTokens: Record<string, string | number> = {};

  if (targetSchema.data?.tokens) {
    for (const [tokenName, tokenDefinition] of Object.entries(targetSchema.data.tokens)) {
      const tokenValue = tokenDefinition.values;

      if (typeof tokenValue === 'object' && tokenValue !== null) {
        if (Array.isArray(tokenValue)) {
          const stringifiedArray = tokenValue.map((item: unknown) => String(item));
          extractedTokens[tokenName] = stringifiedArray.join(', ');
        } else {
          continue;
        }
      } else {
        extractedTokens[tokenName] = resolveTokenReference(tokenValue, availableSchemas);
      }
    }
  }

  return extractedTokens;
};

export const buildCssFile = async (schemas: Schema[], options: CssBuilderOptions = {}): Promise<string> => {
  const css = await buildCss(schemas, options);
  return css + '\n';
};


