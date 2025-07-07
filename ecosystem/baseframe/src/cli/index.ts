import fs from 'fs-extra';
import { createRequire } from 'node:module';
import path from 'node:path';
import yargs from 'yargs';

const require = createRequire(import.meta.url);
const sourcesPath = require.resolve('@cocso-ui/baseframe-sources');
const sourcesDir = path.dirname(sourcesPath);

const PREFIX = 'cocso';
const SIGNATURE = `
██████╗  █████╗ ███████╗███████╗███████╗██████╗  █████╗ ███╗   ███╗███████╗
██╔══██╗██╔══██╗██╔════╝██╔════╝██╔════╝██╔══██╗██╔══██╗████╗ ████║██╔════╝
██████╔╝███████║███████╗█████╗  █████╗  ██████╔╝███████║██╔████╔██║█████╗  
██╔══██╗██╔══██║╚════██║██╔══╝  ██╔══╝  ██╔══██╗██╔══██║██║╚██╔╝██║██╔══╝  
██████╔╝██║  ██║███████║███████╗██║     ██║  ██║██║  ██║██║ ╚═╝ ██║███████╗
╚═════╝ ╚═╝  ╚═╝╚══════╝╚══════╝╚═╝     ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝     ╚═╝╚══════╝
`;

const readYAMLFiles = (dir: string, fileList: string[] = []) => {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      readYAMLFiles(filePath, fileList);
    } else if (stat.isFile() && (path.extname(file) === '.yaml' || path.extname(file) === '.yml')) {
      fileList.push(filePath);
    }
  }

  return fileList;
};

yargs(process.argv.slice(2))
  .middleware((argv) => {
    if (!argv.help && !argv.h && argv._.length > 0) {
      process.stdout.write(SIGNATURE + '\n');
    }
  })
  .command(
    'css-vars [dir]',
    'Generate css-variables tokens',
    (yargs) => {
      return yargs.positional('dir', {
        describe: 'Output directory',
        type: 'string',
        default: './',
      });
    },
    async () => {
      const files = readYAMLFiles(sourcesDir);
      console.log(files);
    },
  )
  .demandCommand(1, 'You need to specify a command.')
  .showHelpOnFail(true)
  .help().argv;
