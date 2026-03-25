import fs from "node:fs";
import path from "node:path";

const REPO_ROOT = path.resolve(import.meta.dirname, "../../..");
const SOURCE_COMPONENTS_DIR = path.join(
  REPO_ROOT,
  "packages/react-icons/src/components"
);
const TARGET_COMPONENTS_DIR = path.join(
  import.meta.dirname,
  "../src/components"
);
const TARGET_SRC_DIR = path.join(import.meta.dirname, "../src");
const SVG_BLOCK_REGEX = /<svg[\s\S]*?<\/svg>/m;
const COMPONENT_NAME_REGEX = /export const\s+([A-Za-z0-9_]+)\s*=/;
const USE_ID_DECLARATION_REGEX = /^const\s+\w+\s*=\s*useId\(\);$/;

const TAG_MAP = new Map([
  ["svg", "Svg"],
  ["path", "Path"],
  ["rect", "Rect"],
  ["g", "G"],
  ["defs", "Defs"],
  ["line", "Line"],
  ["circle", "Circle"],
  ["ellipse", "Ellipse"],
  ["polygon", "Polygon"],
  ["polyline", "Polyline"],
  ["clipPath", "ClipPath"],
  ["linearGradient", "LinearGradient"],
  ["radialGradient", "RadialGradient"],
  ["stop", "Stop"],
]);

const SVG_COMPONENTS = new Set(TAG_MAP.values());

function ensureDirectory(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function replaceTagNames(svgSource) {
  let output = svgSource;

  for (const [sourceTag, targetTag] of TAG_MAP.entries()) {
    output = output
      .replaceAll(new RegExp(`<${sourceTag}(?=[\\s>])`, "g"), `<${targetTag}`)
      .replaceAll(new RegExp(`</${sourceTag}>`, "g"), `</${targetTag}>`);
  }

  return output;
}

function sanitizeSvgSource(svgSource) {
  return replaceTagNames(svgSource)
    .replaceAll(/\saria-hidden="[^"]*"/g, "")
    .replaceAll(/\sxmlns="[^"]*"/g, "");
}

function extractSvgContent(sourceCode, sourceFilePath) {
  const svgMatch = sourceCode.match(SVG_BLOCK_REGEX);

  if (!svgMatch) {
    throw new Error(`Failed to find <svg> block: ${sourceFilePath}`);
  }

  return sanitizeSvgSource(svgMatch[0]);
}

function extractComponentName(sourceCode, sourceFilePath) {
  const componentMatch = sourceCode.match(COMPONENT_NAME_REGEX);

  if (!componentMatch) {
    throw new Error(`Failed to find component name: ${sourceFilePath}`);
  }

  return componentMatch[1];
}

function buildSvgImport(svgSource) {
  const usedTags = new Set();

  for (const componentTag of SVG_COMPONENTS) {
    if (
      svgSource.includes(`<${componentTag}`) ||
      svgSource.includes(`</${componentTag}>`)
    ) {
      usedTags.add(componentTag);
    }
  }

  if (!usedTags.has("Svg")) {
    throw new Error("Generated SVG content does not include <Svg> root tag.");
  }

  return Array.from(usedTags).sort((a, b) => a.localeCompare(b));
}

function extractUseIdLines(sourceCode) {
  return sourceCode
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => USE_ID_DECLARATION_REGEX.test(line));
}

function generateComponentSource({ sourceCode, componentName, svgSource }) {
  const useIdLines = extractUseIdLines(sourceCode);
  const hasUseId = useIdLines.length > 0;
  const svgImports = buildSvgImport(svgSource);

  const lines = [];

  if (hasUseId) {
    lines.push('import { useId } from "react";');
  }

  lines.push(`import { ${svgImports.join(", ")} } from "react-native-svg";`);
  lines.push('import { Icon } from "../../icon";');
  lines.push('import type { IconProps } from "../../types";');
  lines.push("");

  lines.push(`export const ${componentName} = (props: IconProps) => {`);

  if (hasUseId) {
    for (const useIdLine of useIdLines) {
      lines.push(`  ${useIdLine}`);
    }
    lines.push("");
  }

  lines.push("  return (");
  lines.push("    <Icon {...props}>");

  for (const line of svgSource.split("\n")) {
    lines.push(`      ${line}`);
  }

  lines.push("    </Icon>");
  lines.push("  );");
  lines.push("};");

  lines.push("");
  lines.push(`${componentName}.displayName = "${componentName}";`);
  lines.push("");

  return lines.join("\n");
}

function generateSubDirectory(subdirName) {
  const sourceSubdirPath = path.join(SOURCE_COMPONENTS_DIR, subdirName);
  const targetSubdirPath = path.join(TARGET_COMPONENTS_DIR, subdirName);

  ensureDirectory(targetSubdirPath);

  const sourceFiles = fs
    .readdirSync(sourceSubdirPath)
    .filter((fileName) => fileName.endsWith(".tsx"))
    .sort((a, b) => a.localeCompare(b));

  const generatedFiles = [];

  for (const fileName of sourceFiles) {
    const sourceFilePath = path.join(sourceSubdirPath, fileName);
    const sourceCode = fs.readFileSync(sourceFilePath, "utf8");
    const componentName = extractComponentName(sourceCode, sourceFilePath);
    const svgSource = extractSvgContent(sourceCode, sourceFilePath);

    const generatedSource = generateComponentSource({
      sourceCode,
      componentName,
      svgSource,
    });

    const targetFilePath = path.join(targetSubdirPath, fileName);
    fs.writeFileSync(targetFilePath, generatedSource);
    generatedFiles.push(fileName);
  }

  const indexSource = generatedFiles
    .map((fileName) => `export * from "./${fileName.replace(".tsx", "")}";`)
    .join("\n");

  fs.writeFileSync(path.join(targetSubdirPath, "index.ts"), `${indexSource}\n`);

  return generatedFiles;
}

function generatePackageIndex(subdirs) {
  const indexContent = subdirs
    .map((subdir) => `export * from "./components/${subdir}";`)
    .join("\n");

  fs.writeFileSync(path.join(TARGET_SRC_DIR, "index.ts"), `${indexContent}\n`);
}

function main() {
  ensureDirectory(TARGET_COMPONENTS_DIR);

  const subdirs = fs
    .readdirSync(SOURCE_COMPONENTS_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b));

  const summary = [];

  for (const subdir of subdirs) {
    const files = generateSubDirectory(subdir);
    summary.push(`${subdir}: ${files.length}`);
  }

  generatePackageIndex(subdirs);

  console.log(`Generated react-native icons from ${SOURCE_COMPONENTS_DIR}`);
  console.log(summary.join(", "));
}

main();
