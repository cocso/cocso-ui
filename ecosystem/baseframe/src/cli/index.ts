import { createRequire } from "node:module";
import path from "node:path";
import fs from "fs-extra";
import YAML from "yaml";
import yargs from "yargs";
import { type Collections, cssVars, type Token, tailwind } from "../core";

const YAML_FILE_REGEX = /\.ya?ml$/;

const require = createRequire(import.meta.url);
const sourcesPath = require.resolve("@cocso-ui/baseframe-sources");
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
`
  );
}

function findYamlFiles(dir: string): string[] {
  const files: string[] = [];

  function scanDir(currentDir: string) {
    const items = fs.readdirSync(currentDir);

    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        scanDir(fullPath);
      } else if (stat.isFile() && YAML_FILE_REGEX.test(item)) {
        files.push(fullPath);
      }
    }
  }

  scanDir(dir);
  return files;
}

function loadTokens(): { tokens: Token[]; collections: Collections } {
  const yamlFiles = findYamlFiles(sourcesDir);
  const tokens: Token[] = [];
  let collections: Collections | null = null;

  for (const filePath of yamlFiles) {
    try {
      const content = fs.readFileSync(filePath, "utf-8");
      const parsed = YAML.parse(content);

      if (parsed.kind === "Tokens") {
        tokens.push(parsed);
      } else if (parsed.kind === "TokenCollections") {
        collections = parsed;
      }
    } catch (error) {
      console.warn(` ❎ failed to parse ${filePath}:`, error);
    }
  }

  if (!collections) {
    console.error(" ❎ collections.yaml not found");
    process.exit(1);
  }

  return { tokens, collections };
}

function generateCss(outputDir: string, prefix?: string): void {
  const { tokens, collections } = loadTokens();

  const css = cssVars.generateCssVariables(tokens, collections, {
    prefix: prefix ?? "cocso",
    banner: "",
    selectors: { global: { default: ":root" } },
  });

  fs.ensureDirSync(outputDir);
  const outputPath = path.join(outputDir, "token.css");
  fs.writeFileSync(outputPath, css, "utf-8");

  console.log(` ✅ Generated CSS variables: ${outputPath}`);
}

function generateTailwindCss(outputDir: string, prefix?: string): void {
  const { tokens, collections } = loadTokens();

  const tailwindCss = tailwind.generateTailwindCSS(tokens, collections, {
    dsPrefix: prefix ?? "cocso",
    banner: "",
  });

  fs.ensureDirSync(outputDir);
  const outputPath = path.join(outputDir, "tailwind4.css");
  fs.writeFileSync(outputPath, tailwindCss, "utf-8");

  console.log(` ✅ Generated TailwindCSS 4.0 configuration: ${outputPath}`);
}

yargs(process.argv.slice(2))
  .command(
    "css-vars [dir] [prefix]",
    "Generate CSS variables",
    (yargs) => {
      return yargs
        .positional("dir", {
          describe: "Output directory",
          type: "string",
          default: "./dist/",
        })
        .option("prefix", {
          describe: "CSS variable prefix",
          type: "string",
        });
    },
    (argv) => {
      showBanner();
      generateCss(argv.dir as string, argv.prefix as string | undefined);
    }
  )
  .command(
    "tailwindcss [dir] [prefix]",
    "Generate TailwindCSS 4.0 configuration",
    (yargs) => {
      return yargs
        .positional("dir", {
          describe: "Output directory",
          type: "string",
          default: "./dist/",
        })
        .option("prefix", {
          describe: "CSS variable prefix",
          type: "string",
        });
    },
    (argv) => {
      showBanner();
      generateTailwindCss(
        argv.dir as string,
        argv.prefix as string | undefined
      );
    }
  )
  .demandCommand(1, "You need to specify a command.")
  .showHelpOnFail(true)
  .help().argv;
