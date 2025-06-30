import type { Schema, TokenValue } from '../schema';

export interface JsonBuilderOptions {
  includeMetadata?: boolean;
  formatOutput?: boolean;
}

export const buildJson = (schemas: Schema[], options: JsonBuilderOptions = {}): string => {
  const { includeMetadata = false, formatOutput = true } = options;
  const result: Record<string, any> = {};

  for (const schema of schemas) {
    if (includeMetadata) {
      result[`_metadata_${schema.metadata.id}`] = {
        name: schema.metadata.name,
        kind: schema.kind,
        collection: schema.data.collection,
        description: schema.metadata.description,
        version: schema.metadata.version
      };
    }

    const tokens = extractTokensFromSchema(schema);
    Object.assign(result, tokens);
  }

  return formatOutput 
    ? JSON.stringify(result, null, 2)
    : JSON.stringify(result);
};

const extractTokensFromSchema = (schema: Schema): Record<string, TokenValue> => {
  const result: Record<string, TokenValue> = {};

  if (schema.data?.tokens) {
    for (const [tokenName, tokenDef] of Object.entries(schema.data.tokens)) {
      const cleanName = tokenName.replace(/^\$/, '');
      result[cleanName] = tokenDef.values;
    }
  }

  return result;
};

export const buildJsonFile = (schemas: Schema[], options: JsonBuilderOptions = {}): string => {
  const json = buildJson(schemas, options);
  return json + '\n';
}; 