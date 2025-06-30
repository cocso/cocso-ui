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
BASEFRAME

Usage:
  baseframe <command> [options]

Commands:
  build       Build tokens and generate output files
  validate    Validate token file validity
  help        Show this help message

Options:
  -i, --input <pattern>    Input file pattern (default: tokens/**/*.{yaml,yml})
  -o, --output <directory> Output directory (default: dist)
  -f, --format <format>    Output format, comma-separated (default: css,json)
  -v, --verbose           Verbose output
  -h, --help              Show help
  --combined              Build all tokens into combined files

Examples:
  baseframe build                                    # Generate individual files (default)
  baseframe build --combined                         # Generate combined tokens.css, tokens.json
  baseframe build -i "src/**/*.tokens.yaml" -o "build" -f "css"
  baseframe validate -i "tokens/**/*.yaml" -v
`);
};
