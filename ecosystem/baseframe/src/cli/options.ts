import type { BuildOptions, OutputFormat } from '../core';

/**
 * CLI command types
 */
export type CliCommand = 'build' | 'validate' | 'help';

/**
 * Parsed CLI arguments
 */
export interface CliArgs {
  command: CliCommand;
  inputPattern?: string;
  outputDir?: string;
  formats?: OutputFormat[];
  verbose?: boolean;
}

/**
 * Parse CLI arguments - simple implementation
 */
export const parseCliArgs = (args: string[]): CliArgs => {
  // 명령어가 없으면 help
  if (args.length === 0) {
    return {
      command: 'help',
      inputPattern: DEFAULT_PATTERNS.join(','),
      outputDir: DEFAULT_OUTPUT_DIR,
      formats: ['css', 'json'],
      verbose: false,
    };
  }

  const command = args[0] as CliCommand;
  
  // 유효하지 않은 명령어면 help
  if (!['build', 'validate', 'help'].includes(command)) {
    return {
      command: 'help',
      inputPattern: DEFAULT_PATTERNS.join(','),
      outputDir: DEFAULT_OUTPUT_DIR,
      formats: ['css', 'json'],
      verbose: false,
    };
  }

  const inputPattern = getArgValue(args, ['-i', '--input']) || DEFAULT_PATTERNS.join(',');
  const outputDir = getArgValue(args, ['-o', '--output']) || DEFAULT_OUTPUT_DIR;
  const formatArg = getArgValue(args, ['-f', '--format']) || 'css,json';
  const verbose = hasFlag(args, ['-v', '--verbose']);

  return {
    command,
    inputPattern,
    outputDir,
    formats: parseFormats(formatArg),
    verbose,
  };
};

/**
 * Get argument value by flags
 */
const getArgValue = (args: string[], flags: string[]): string | undefined => {
  for (const flag of flags) {
    const index = args.indexOf(flag);
    if (index !== -1 && index + 1 < args.length) {
      return args[index + 1];
    }
  }
  return undefined;
};

/**
 * Check if flag exists in arguments
 */
const hasFlag = (args: string[], flags: string[]): boolean => {
  return flags.some((flag) => args.includes(flag));
};

/**
 * Parse output formats from string
 */
const parseFormats = (formatString: string): OutputFormat[] => {
  const validFormats: OutputFormat[] = ['css', 'json'];
  const formats = formatString.split(',').map((f) => f.trim());

  return formats.filter((format): format is OutputFormat =>
    validFormats.includes(format as OutputFormat),
  ) as OutputFormat[];
};

/**
 * Default patterns for token files
 */
export const DEFAULT_PATTERNS = [
  'tokens/**/*.yaml',
  'tokens/**/*.yml',
  '**/*.tokens.yaml',
  '**/*.tokens.yml',
];

/**
 * Default output directory
 */
export const DEFAULT_OUTPUT_DIR = 'dist';

/**
 * Show CLI help
 */
export const showHelp = (): void => {
  console.log(`
🎨 BASEFRAME - Design Token Management Tool

사용법:
  baseframe <명령어> [옵션]

명령어:
  build       토큰을 빌드하고 출력 파일을 생성합니다
  validate    토큰 파일의 유효성을 검증합니다
  help        이 도움말을 표시합니다

옵션:
  -i, --input <패턴>       입력 파일 패턴 (기본: tokens/**/*.{yaml,yml})
  -o, --output <디렉토리>   출력 디렉토리 (기본: dist)
  -f, --format <형식>      출력 형식, 쉼표로 구분 (기본: css,json)
  -v, --verbose           자세한 출력
  -h, --help              도움말 표시

예시:
  baseframe build
  baseframe build -i "src/**/*.tokens.yaml" -o "build" -f "css"
  baseframe validate -i "tokens/**/*.yaml" -v
`);
};
