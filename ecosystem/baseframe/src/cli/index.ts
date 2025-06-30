#!/usr/bin/env node

import { parseCliArgs, showHelp } from './options';
import { executeBuildCommand } from './build';
import { executeValidateCommand } from './validate';

const CLI_BANNER = `
╔══════════════════════════════════════════════════════════════╗
║                         🎨 BASEFRAME                          ║
║                 Design Token Management Tool                 ║
╚══════════════════════════════════════════════════════════════╝
`;

export const runCli = async (): Promise<void> => {
  const rawArgs = process.argv.slice(2);

  console.log(CLI_BANNER);

  try {
    const args = parseCliArgs(rawArgs);

    if (args.command === 'help' || rawArgs.length === 0 || rawArgs.includes('--help') || rawArgs.includes('-h')) {
      showHelp();
      return;
    }

    switch (args.command) {
      case 'build':
        await executeBuildCommand(args);
        break;

      case 'validate':
        await executeValidateCommand(args);
        break;

      default:
        console.error(`❌ 알 수 없는 명령어: ${args.command}`);
        showHelp();
        process.exit(1);
    }
  } catch (error) {
    console.error('❌ 오류가 발생했어요:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
};
