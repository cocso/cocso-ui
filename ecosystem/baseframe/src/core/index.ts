import { writeFile, mkdir } from 'fs/promises';
import { join, dirname, basename } from 'path';
import type { Schema, BuildOptions, OutputFormat } from './schema';
import { loadTokenSchemas, loadCocsoBaseTokens } from './token-loader';
import { buildCssFile } from './builders/css-builder';
import { buildJsonFile } from './builders/json-builder';

export class BaseframeCore {
  private schemas: Schema[] = [];

  async loadSchemas(patterns: string | string[]): Promise<void> {
    const patternArray = Array.isArray(patterns) ? patterns : [patterns];
    this.schemas = await loadTokenSchemas(patternArray);
  }

  async loadCocsoTokens(): Promise<void> {
    const cocsoTokens = await loadCocsoBaseTokens();
    this.schemas.push(...cocsoTokens);
  }

  async buildOutput(
    outputFormat: OutputFormat,
    schemas?: Schema[],
    options: { isIndividual?: boolean; minify?: boolean; selector?: string } = {},
  ): Promise<string> {
    const targetSchemas = schemas || this.schemas;
    const { isIndividual = false, minify = false, selector = ':root' } = options;

    switch (outputFormat) {
      case 'css':
        return await buildCssFile(targetSchemas, { 
          includeComments: !isIndividual,
          minify,
          selector
        });
      case 'json':
        return buildJsonFile(targetSchemas, { includeMetadata: !isIndividual });
      default:
        throw new Error(`Unsupported format: ${outputFormat}`);
    }
  }

  async buildToFile(
    outputFormat: OutputFormat,
    outputPath: string,
    schemas?: Schema[],
    options: {
      isIndividual?: boolean;
      minify?: boolean;
      selector?: string;
    } = {},
  ): Promise<void> {
    const generatedContent = await this.buildOutput(outputFormat, schemas, options);

    await mkdir(dirname(outputPath), { recursive: true });
    await writeFile(outputPath, generatedContent, 'utf8');
  }

  async buildCombined(outputDirectory: string, buildOptions: BuildOptions = {}): Promise<string[]> {
    const { formats = ['css', 'json'] } = buildOptions;
    const generatedFiles: string[] = [];

    for (const outputFormat of formats) {
      const fileName = `tokens.${outputFormat}`;
      const filePath = join(outputDirectory, fileName);

      await this.buildToFile(outputFormat, filePath, undefined, { isIndividual: false });
      generatedFiles.push(filePath);
    }

    return generatedFiles;
  }

  async buildIndividual(outputDirectory: string, buildOptions: BuildOptions = {}): Promise<string[]> {
    const { formats = ['css', 'json'] } = buildOptions;
    const generatedFiles: string[] = [];

    for (const targetSchema of this.schemas) {
      const schemaBaseName = this.getSchemaBaseName(targetSchema);

      for (const outputFormat of formats) {
        const fileName = `${schemaBaseName}.${outputFormat}`;
        const filePath = join(outputDirectory, fileName);

        await this.buildToFile(outputFormat, filePath, [targetSchema], { isIndividual: true });
        generatedFiles.push(filePath);
      }
    }

    return generatedFiles;
  }

  async buildMultiple(
    outputDirectory: string,
    buildOptions: BuildOptions & { individual?: boolean } = {},
  ): Promise<string[]> {
    const { individual = true } = buildOptions;

    if (individual) {
      return this.buildIndividual(outputDirectory, buildOptions);
    } else {
      return this.buildCombined(outputDirectory, buildOptions);
    }
  }

  private getSchemaBaseName(targetSchema: Schema): string {
    if (targetSchema.metadata.filePath) {
      const originalFileName = basename(targetSchema.metadata.filePath);
      return originalFileName.replace(/\.(yaml|yml)$/, '');
    }

    return targetSchema.data.collection || targetSchema.metadata.id;
  }

  getSchemas(): Schema[] {
    return [...this.schemas];
  }

  clearSchemas(): void {
    this.schemas = [];
  }

  getSchemaStats(): Record<string, number> {
    const schemaStatistics: Record<string, number> = {};

    for (const currentSchema of this.schemas) {
      const schemaKind = currentSchema.kind;
      schemaStatistics[schemaKind] = (schemaStatistics[schemaKind] || 0) + 1;
    }

    return schemaStatistics;
  }
}

export type { Schema, BuildOptions, OutputFormat } from './schema';
export { loadTokenSchemas, loadCocsoBaseTokens } from './token-loader';
export { buildCssFile } from './builders/css-builder';
export { buildJsonFile } from './builders/json-builder';
