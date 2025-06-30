import { BaseframeCore } from '../core';
import type { CliArgs } from './options';
import { DEFAULT_PATTERNS, DEFAULT_OUTPUT_DIR } from './options';

/**
 * Execute build command
 */
export const executeBuildCommand = async (args: CliArgs): Promise<void> => {
  const inputPattern = args.inputPattern || DEFAULT_PATTERNS.join(',');
  const outputDir = args.outputDir || DEFAULT_OUTPUT_DIR;
  const formats = args.formats || ['css', 'json'];
  const { verbose = false, individual = true } = args;

  console.log('🔧 토큰 빌드를 시작합니다...');

  if (verbose) {
    console.log(`📁 입력 패턴: ${inputPattern}`);
    console.log(`📤 출력 디렉토리: ${outputDir}`);
    console.log(`🎯 출력 형식: ${formats.join(', ')}`);
    console.log(`📋 빌드 모드: ${individual ? '개별 빌드' : '통합 빌드'}`);
  }

  const core = new BaseframeCore();

  try {
    const patterns = inputPattern.split(',').map((p) => p.trim());
    await core.loadSchemas(patterns);

    if (verbose) console.log('📦 COCSO 기본 토큰을 로드합니다...');
    await core.loadCocsoTokens();

    const schemas = core.getSchemas();

    if (schemas.length === 0) {
      console.log('⚠️  유효한 토큰 스키마가 없어요.');
      return;
    }

    if (verbose) {
      const stats = core.getSchemaStats();
      console.log(`✅ 로드된 스키마: ${schemas.length}개`);
      Object.entries(stats).forEach(([kind, count]) => {
        console.log(`   - ${kind}: ${count}개`);
      });
    }

    const builtFiles = await core.buildMultiple(outputDir, { formats, individual });

    console.log('🎉 토큰 빌드가 완료되었어요!');

    if (individual) {
      console.log(`📄 개별 파일 ${builtFiles.length}개가 생성되었어요:`);
    } else {
      console.log('📄 생성된 파일:');
    }

    builtFiles.forEach((file) => {
      console.log(`   📄 ${file}`);
    });
  } catch (error) {
    console.error('❌ 빌드 중 오류가 발생했어요:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
};
