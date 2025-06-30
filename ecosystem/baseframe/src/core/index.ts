import { writeFile, mkdir } from 'fs/promises';
import { join, dirname } from 'path';
import type { Schema, BuildOptions, OutputFormat } from './schema';
import { loadTokenSchemas, loadCocsoBaseTokens } from './token-loader';
import { buildCssFile, type CssBuilderOptions } from './builders/css-builder';
import { buildJsonFile, type JsonBuilderOptions } from './builders/json-builder';

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

  buildOutput(format: OutputFormat, options: CssBuilderOptions | JsonBuilderOptions = {}): string {
    switch (format) {
      case 'css':
        return buildCssFile(this.schemas, options as CssBuilderOptions);
      case 'json':
        return buildJsonFile(this.schemas, options as JsonBuilderOptions);
      default:
        throw new Error(`지원하지 않는 형식: ${format}`);
    }
  }

  async buildToFile(format: OutputFormat, outputPath: string, options: any = {}): Promise<void> {
    const content = this.buildOutput(format, options);

    await mkdir(dirname(outputPath), { recursive: true });
    await writeFile(outputPath, content, 'utf8');
  }

  async buildMultiple(outputDir: string, options: BuildOptions = {}): Promise<string[]> {
    const { formats = ['css', 'json'] } = options;
    const builtFiles: string[] = [];

    for (const format of formats) {
      const fileName = `tokens.${format}`;
      const outputPath = join(outputDir, fileName);

      await this.buildToFile(format, outputPath);

      builtFiles.push(outputPath);
    }

    return builtFiles;
  }

  getSchemas(): Schema[] {
    return [...this.schemas];
  }

  clearSchemas(): void {
    this.schemas = [];
  }

  getSchemaStats(): Record<string, number> {
    const stats: Record<string, number> = {};

    for (const schema of this.schemas) {
      stats[schema.kind] = (stats[schema.kind] || 0) + 1;
    }

    return stats;
  }
}

export type { Schema, BuildOptions, OutputFormat } from './schema';
export { loadTokenSchemas, loadCocsoBaseTokens } from './token-loader';
export { buildCssFile } from './builders/css-builder';
export { buildJsonFile } from './builders/json-builder';
