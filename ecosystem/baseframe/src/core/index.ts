import { writeFile, mkdir } from 'fs/promises';
import { join, dirname, basename } from 'path';
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

  buildOutput(format: OutputFormat, schemas?: Schema[], options: { isIndividual?: boolean } = {}): string {
    const targetSchemas = schemas || this.schemas;
    const { isIndividual = false } = options;
    
    switch (format) {
      case 'css':
        return buildCssFile(targetSchemas, { includeComments: !isIndividual });
      case 'json':
        return buildJsonFile(targetSchemas, { includeMetadata: !isIndividual });
      default:
        throw new Error(`지원하지 않는 형식: ${format}`);
    }
  }

  async buildToFile(format: OutputFormat, outputPath: string, schemas?: Schema[], options: { isIndividual?: boolean } = {}): Promise<void> {
    const content = this.buildOutput(format, schemas, options);

    await mkdir(dirname(outputPath), { recursive: true });
    await writeFile(outputPath, content, 'utf8');
  }

  /**
   * 모든 토큰을 하나의 파일로 빌드
   */
  async buildCombined(outputDir: string, options: BuildOptions = {}): Promise<string[]> {
    const { formats = ['css', 'json'] } = options;
    const builtFiles: string[] = [];

    for (const format of formats) {
      const fileName = `tokens.${format}`;
      const outputPath = join(outputDir, fileName);

      await this.buildToFile(format, outputPath, undefined, { isIndividual: false });
      builtFiles.push(outputPath);
    }

    return builtFiles;
  }

  /**
   * 각 토큰 파일별로 개별 빌드
   */
  async buildIndividual(outputDir: string, options: BuildOptions = {}): Promise<string[]> {
    const { formats = ['css', 'json'] } = options;
    const builtFiles: string[] = [];

    for (const schema of this.schemas) {
      const baseName = this.getSchemaBaseName(schema);
      
      for (const format of formats) {
        const fileName = `${baseName}.${format}`;
        const outputPath = join(outputDir, fileName);

        await this.buildToFile(format, outputPath, [schema], { isIndividual: true });
        builtFiles.push(outputPath);
      }
    }

    return builtFiles;
  }

  /**
   * 빌드 방식을 선택할 수 있는 통합 메서드
   */
  async buildMultiple(outputDir: string, options: BuildOptions & { individual?: boolean } = {}): Promise<string[]> {
    const { individual = true } = options; // 기본값을 개별 빌드로 변경
    
    if (individual) {
      return this.buildIndividual(outputDir, options);
    } else {
      return this.buildCombined(outputDir, options);
    }
  }

  /**
   * 스키마에서 파일 이름을 추출
   */
  private getSchemaBaseName(schema: Schema): string {
    if (schema.metadata.filePath) {
      const fileName = basename(schema.metadata.filePath);
      return fileName.replace(/\.(yaml|yml)$/, '');
    }
    
    // fallback: collection name 또는 id 사용
    return schema.data.collection || schema.metadata.id;
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
