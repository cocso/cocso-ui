import { readFile } from 'fs/promises';
import { parse } from 'yaml';
import { join } from 'path';
import { globby } from 'globby';
import type { Schema } from './schema';
import { isSchema, validateSchema } from './validation';

export const loadTokenSchema = async (filePath: string): Promise<Schema | null> => {
  try {
    const fileContent = await readFile(filePath, 'utf8');
    const parsedSchema = parse(fileContent);

    if (!isSchema(parsedSchema)) {
      console.warn(`Invalid schema format: ${filePath}`);
      return null;
    }

    const validationResult = validateSchema(parsedSchema);
    if (!validationResult.valid) {
      console.warn(`Schema validation failed: ${filePath}`);
      validationResult.errors.forEach((error) => console.warn(`  ${error}`));
      return null;
    }

    if (validationResult.warnings?.length) {
      validationResult.warnings.forEach((warning) => console.warn(`  ${warning}`));
    }

    parsedSchema.metadata.filePath = filePath;
    return parsedSchema;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.warn(`Failed to load schema: ${filePath} - ${errorMessage}`);
    return null;
  }
};

export const loadTokenSchemas = async (patterns: string[]): Promise<Schema[]> => {
  try {
    const matchedFiles = await globby(patterns, {
      expandDirectories: true,
      gitignore: true,
    });

    const loadPromises = matchedFiles.map(loadTokenSchema);
    const loadResults = await Promise.all(loadPromises);

    return loadResults.filter((schema): schema is Schema => schema !== null);
  } catch (error) {
    console.error('File search error:', error);
    return [];
  }
};

export const loadCocsoBaseTokens = async (): Promise<Schema[]> => {
  const BASE_TOKEN_PATH = join(process.cwd(), '../../packages/baseframe');
  const TOKEN_FILE_PATTERNS = ['**/*.yaml', '**/*.yml'];

  try {
    const tokenFiles = await globby(TOKEN_FILE_PATTERNS, {
      cwd: BASE_TOKEN_PATH,
      absolute: true,
      expandDirectories: true,
      gitignore: false,
    });

    console.log(`Token search path: ${BASE_TOKEN_PATH}`);
    console.log(`Found files:`, tokenFiles);

    const loadPromises = tokenFiles.map(loadTokenSchema);
    const loadResults = await Promise.all(loadPromises);

    const validSchemas = loadResults.filter((schema): schema is Schema => schema !== null);
    console.log(`Loaded schemas count: ${validSchemas.length}`);

    return validSchemas;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : error;
    console.warn('Failed to load COCSO base tokens:', errorMessage);
    return [];
  }
};
