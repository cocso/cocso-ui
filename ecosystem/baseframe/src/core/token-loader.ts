import { readFile } from 'fs/promises';
import { parse } from 'yaml';
import { join } from 'path';
import { globby } from 'globby';
import type { Schema } from './schema';
import { isSchema, validateSchema } from './validation';

export const loadTokenSchema = async (filePath: string): Promise<Schema | null> => {
  try {
    const content = await readFile(filePath, 'utf8');
    const parsed = parse(content);

    if (!isSchema(parsed)) {
      console.warn(`⚠️  ${filePath}: 유효하지 않은 스키마 형식`);
      return null;
    }

    const validation = validateSchema(parsed);
    if (!validation.valid) {
      console.warn(`❌ ${filePath}: 검증 실패`);
      validation.errors.forEach((error) => console.warn(`   ❌ ${error}`));
      return null;
    }

    // 경고가 있으면 출력하지만 스키마는 로드
    if (validation.warnings && validation.warnings.length > 0) {
      validation.warnings.forEach((warning) => console.warn(`   ⚠️  ${warning}`));
    }

    return parsed;
  } catch (error) {
    console.warn(`❌ ${filePath}: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
    return null;
  }
};

export const loadTokenSchemas = async (patterns: string[]): Promise<Schema[]> => {
  try {
    const files = await globby(patterns, {
      expandDirectories: true,
      gitignore: true,
    });

    // 병렬로 모든 파일 로드
    const schemaPromises = files.map(file => loadTokenSchema(file));
    const results = await Promise.all(schemaPromises);

    // null이 아닌 스키마만 필터링
    return results.filter((schema): schema is Schema => schema !== null);
  } catch (error) {
    console.error('파일 검색 중 오류:', error);
    return [];
  }
};

export const loadCocsoBaseTokens = async (): Promise<Schema[]> => {
  const baseTokenPath = join(process.cwd(), '../../packages/baseframe');

  try {
    const files = await globby(['*.yaml', '*.yml'], {
      cwd: baseTokenPath,
      absolute: true,
      expandDirectories: false,
      gitignore: false,
    });

    // 병렬로 모든 파일 로드
    const schemaPromises = files.map(file => loadTokenSchema(file));
    const results = await Promise.all(schemaPromises);

    // null이 아닌 스키마만 필터링
    return results.filter((schema): schema is Schema => schema !== null);
  } catch (error) {
    console.warn('COCSO 기본 토큰 로드 실패:', error instanceof Error ? error.message : error);
    return [];
  }
};
