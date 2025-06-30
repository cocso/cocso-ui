import { BaseframeCore } from '../core';
import type { CliArgs } from './options';
import { DEFAULT_PATTERNS } from './options';

export const executeValidateCommand = async (args: CliArgs): Promise<void> => {
  const inputPattern = args.inputPattern || DEFAULT_PATTERNS.join(',');
  const { verbose = false } = args;

  console.log('🔍 토큰 검증을 시작합니다...');

  if (verbose) {
    console.log(`📁 입력 패턴: ${inputPattern}`);
  }

  const core = new BaseframeCore();

  try {
    const patterns = inputPattern.split(',').map((p) => p.trim());
    await core.loadSchemas(patterns);

    if (verbose) console.log('📦 COCSO 기본 토큰을 로드합니다...');
    await core.loadCocsoTokens();

    const schemas = core.getSchemas();

    if (schemas.length === 0) {
      console.log('⚠️  검증할 토큰 스키마가 없어요.');
      return;
    }

    const stats = core.getSchemaStats();
    console.log(`✅ 검증 완료: ${schemas.length}개 스키마`);

    Object.entries(stats).forEach(([kind, count]) => {
      console.log(`   - ${kind}: ${count}개`);
    });

    if (verbose) {
      console.log('\n📋 상세 정보:');
      schemas.forEach((schema, index) => {
        console.log(`${index + 1}. ${schema.metadata.name} (${schema.kind})`);
        if (schema.metadata.description) {
          console.log(`   설명: ${schema.metadata.description}`);
        }
        console.log(`   토큰 수: ${Object.keys(schema.data.tokens || {}).length}개`);
      });
    }

    console.log('🎉 모든 토큰이 유효해요!');
  } catch (error) {
    console.error('❌ 검증 중 오류가 발생했어요:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
};
