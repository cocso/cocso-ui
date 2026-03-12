import { createRequire } from "node:module";
import path from "node:path";
import fs from "fs-extra";
import YAML from "yaml";
import yargs from "yargs";
import { type Collections, cssVars, type Token, tailwind } from "../core";
import { findYamlFiles } from "../utils/fs";

const require = createRequire(import.meta.url);
const sourcesPath = require.resolve("@cocso-ui/baseframe-sources");
const sourcesDir = path.dirname(sourcesPath);

/** Prints the Baseframe ASCII art banner to stdout. */
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

/**
 * Discovers and loads all YAML token and collection files from the resolved
 * `@cocso-ui/baseframe-sources` package directory.
 *
 * Files with `kind: "Tokens"` are accumulated into the `tokens` array.
 * The single file with `kind: "TokenCollections"` is stored as `collections`.
 * Exits the process with code 1 when no collections file is found.
 */
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

/**
 * Generates `token.css` (CSS custom properties) and writes it to `outputDir`.
 *
 * Uses the `css-vars` builder with the given `prefix` (defaults to `"cocso"`).
 * Creates the output directory if it does not already exist.
 */
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

/**
 * Generates `tailwind4.css` (Tailwind CSS 4.0 `@theme` configuration) and
 * writes it to `outputDir`.
 *
 * Uses the `tailwind` builder with the given `prefix` (defaults to `"cocso"`).
 * Creates the output directory if it does not already exist.
 */
function generateTailwindCss(outputDir: string, prefix?: string): void {
  const { tokens, collections } = loadTokens();

  const tailwindCss = tailwind.generateTailwindCSS(tokens, collections, {
    prefix: prefix ?? "cocso",
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
