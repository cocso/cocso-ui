import type { BuildOptions, OutputFormat } from '../core';

export type CliCommand = 'build' | 'validate' | 'help';

export interface CliArgs {
  command: CliCommand;
  inputPattern?: string;
  outputDir?: string;
  formats?: OutputFormat[];
  verbose?: boolean;
  individual?: boolean;
}

export const parseCliArgs = (args: string[]): CliArgs => {
  if (args.length === 0) {
    return {
      command: 'help',
      inputPattern: DEFAULT_PATTERNS.join(','),
      outputDir: DEFAULT_OUTPUT_DIR,
      formats: ['css', 'json'],
      verbose: false,
      individual: true,
    };
  }

  const command = args[0] as CliCommand;

  if (!['build', 'validate', 'help'].includes(command)) {
    return {
      command: 'help',
      inputPattern: DEFAULT_PATTERNS.join(','),
      outputDir: DEFAULT_OUTPUT_DIR,
      formats: ['css', 'json'],
      verbose: false,
      individual: true,
    };
  }

  const inputPattern = getArgValue(args, ['-i', '--input']) || DEFAULT_PATTERNS.join(',');
  const outputDir = getArgValue(args, ['-o', '--output']) || DEFAULT_OUTPUT_DIR;
  const formatArg = getArgValue(args, ['-f', '--format']) || 'css,json';
  const verbose = hasFlag(args, ['-v', '--verbose']);
  
  const combined = hasFlag(args, ['--combined']);
  const individual = !combined;

  return {
    command,
    inputPattern,
    outputDir,
    formats: parseFormats(formatArg),
    verbose,
    individual,
  };
};

const getArgValue = (args: string[], flags: string[]): string | undefined => {
  for (const flag of flags) {
    const index = args.indexOf(flag);
    if (index !== -1 && index + 1 < args.length) {
      return args[index + 1];
    }
  }
  return undefined;
};

const hasFlag = (args: string[], flags: string[]): boolean => {
  return flags.some((flag) => args.includes(flag));
};

const parseFormats = (formatString: string): OutputFormat[] => {
  const validFormats: OutputFormat[] = ['css', 'json'];
  const formats = formatString.split(',').map((f) => f.trim());

  return formats.filter((format): format is OutputFormat =>
    validFormats.includes(format as OutputFormat),
  ) as OutputFormat[];
};

export const DEFAULT_PATTERNS = [
  'tokens/**/*.yaml',
  'tokens/**/*.yml',
  '**/*.tokens.yaml',
  '**/*.tokens.yml',
];

export const DEFAULT_OUTPUT_DIR = 'dist';

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
  --combined              모든 토큰을 하나의 파일로 통합 빌드
  -v, --verbose           자세한 출력
  -h, --help              도움말 표시

예시:
  baseframe build                                    # 각 토큰별로 개별 파일 생성 (기본)
  baseframe build --combined                         # 모든 토큰을 tokens.css, tokens.json으로 통합 빌드
  baseframe build -i "src/**/*.tokens.yaml" -o "build" -f "css"
  baseframe validate -i "tokens/**/*.yaml" -v
`);
};
