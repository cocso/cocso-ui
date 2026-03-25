import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const sourcePath = resolve(import.meta.dirname, "../../css/token.css");
const destinationPath = resolve(
  import.meta.dirname,
  "../src/theme/tokens.generated.ts"
);

const tokenCss = readFileSync(sourcePath, "utf8");
const variablePattern = /(--cocso-[a-z0-9-]+):\s*([^;]+);/g;

const entries = [];

for (const match of tokenCss.matchAll(variablePattern)) {
  const name = match[1];
  const value = match[2].trim();
  entries.push([name, value]);
}

entries.sort(([left], [right]) => left.localeCompare(right));

const body = entries
  .map(([name, value]) => `  "${name}": "${value.replaceAll('"', '\\"')}",`)
  .join("\n");

const output = `export const rawCssVariables = {
${body}
} as const;
`;

writeFileSync(destinationPath, output, "utf8");
