import { createRequire } from 'module';
import path from 'path';
import fs from 'fs-extra';
import YAML from 'yaml';
import yargs from 'yargs';
import { cssVars, TokenType, CollectionDefinitions } from '../core';

const require = createRequire(import.meta.url);
const sourcesPath = require.resolve('@cocso-ui/baseframe-sources');
const sourcesDir = path.dirname(sourcesPath);

function showBanner() {
  process.stdout.write(
    `
██████╗  █████╗ ███████╗███████╗███████╗██████╗  █████╗ ███╗   ███╗███████╗
██╔══██╗██╔══██╗██╔════╝██╔════╝██╔════╝██╔══██╗██╔══██╗████╗ ████║██╔════╝
██████╔╝███████║███████╗█████╗  █████╗  ██████╔╝███████║██╔████╔██║█████╗  
██╔══██╗██╔══██║╚════██║██╔══╝  ██╔══╝  ██╔══██╗██╔══██║██║╚██╔╝██║██╔══╝  
██████╔╝██║  ██║███████║███████╗██║     ██║  ██║██║  ██║██║ ╚═╝ ██║███████╗
╚═════╝ ╚═╝  ╚═╝╚══════╝╚══════╝╚═╝     ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝     ╚═╝╚══════╝
` + '\n',
  );
}

function findYamlFiles(dir: string): string[] {
  const files: string[] = [];

  function scan(currentDir: string) {
    const items = fs.readdirSync(currentDir);

    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        scan(fullPath);
      } else if (stat.isFile() && /\.ya?ml$/.test(item)) {
        files.push(fullPath);
      }
    }
  }

  scan(dir);
  return files;
}

async function loadTokens(): Promise<{
  tokens: TokenType[];
  collections: CollectionDefinitions | null;
}> {
  const yamlFiles = findYamlFiles(sourcesDir);
  const tokens: TokenType[] = [];
  let collections: CollectionDefinitions | null = null;

  for (const filePath of yamlFiles) {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const parsed = YAML.parse(content);

      if (parsed.kind === 'Tokens') {
        tokens.push(parsed);
      } else if (parsed.kind === 'TokenCollections') {
        collections = parsed;
      }
    } catch (error) {
      console.warn(` ❎ failed to parse ${filePath}:`, error);
    }
  }

  return { tokens, collections };
}

async function generateCss(outputDir: string, prefix?: string): Promise<void> {
  const { tokens, collections } = await loadTokens();

  if (!collections) {
    console.error(' ❎ collections.yaml not found');
    process.exit(1);
  }

  const css = cssVars.generateCssVariables(tokens, collections, {
    prefix,
    banner: `/* Generated CSS Variables for Baseframe Design Tokens */\n/* Generated at: ${new Date().toISOString()} */\n\n`,
    selectors: { global: { default: ':root' } },
  });

  await fs.ensureDir(outputDir);
  const outputPath = path.join(outputDir, 'tokens.css');
  await fs.writeFile(outputPath, css, 'utf-8');

  console.log(` ✅ Generated CSS variables: ${outputPath}`);
}

yargs(process.argv.slice(2))
  .command(
    'css-vars [dir]',
    'Generate CSS variables',
    (yargs) => {
      return yargs
        .positional('dir', {
          describe: 'Output directory',
          type: 'string',
          default: './',
        })
        .option('prefix', {
          describe: 'CSS variable prefix',
          type: 'string',
        });
    },
    async (argv) => {
      showBanner();
      await generateCss(argv.dir as string, argv.prefix as string | undefined);
    },
  )
  .demandCommand(1, 'You need to specify a command.')
  .showHelpOnFail(true)
  .help().argv;
