import {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import type { Registry, RegistryIcon } from "./types";

const PKG_ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SVG_DIR = join(PKG_ROOT, "svg");
const DIST_DIR = join(PKG_ROOT, "dist");
const RN_DIST = join(DIST_DIR, "react-native");
const TEMPLATES_DIR = join(PKG_ROOT, "templates", "react-native");

const SVG_ATTR_MAP: Record<string, string> = {
  "alignment-baseline": "alignmentBaseline",
  "baseline-shift": "baselineShift",
  "clip-path": "clipPath",
  "clip-rule": "clipRule",
  "color-interpolation": "colorInterpolation",
  "color-interpolation-filters": "colorInterpolationFilters",
  "dominant-baseline": "dominantBaseline",
  "fill-opacity": "fillOpacity",
  "fill-rule": "fillRule",
  "flood-color": "floodColor",
  "flood-opacity": "floodOpacity",
  "font-family": "fontFamily",
  "font-size": "fontSize",
  "font-style": "fontStyle",
  "font-weight": "fontWeight",
  "letter-spacing": "letterSpacing",
  "lighting-color": "lightingColor",
  "paint-order": "paintOrder",
  "pointer-events": "pointerEvents",
  "shape-rendering": "shapeRendering",
  "stop-color": "stopColor",
  "stop-opacity": "stopOpacity",
  "stroke-dasharray": "strokeDasharray",
  "stroke-dashoffset": "strokeDashoffset",
  "stroke-linecap": "strokeLinecap",
  "stroke-linejoin": "strokeLinejoin",
  "stroke-miterlimit": "strokeMiterlimit",
  "stroke-opacity": "strokeOpacity",
  "stroke-width": "strokeWidth",
  "text-anchor": "textAnchor",
  "text-decoration": "textDecoration",
  "text-rendering": "textRendering",
  "vector-effect": "vectorEffect",
  "word-spacing": "wordSpacing",
};

const SVG_ATTR_REGEXES = Object.entries(SVG_ATTR_MAP).map(
  ([svgAttr, jsxAttr]) => ({
    regex: new RegExp(`(?<=\\s)${svgAttr.replace(/-/g, "\\-")}=`, "g"),
    replacement: `${jsxAttr}=`,
  })
);

function convertAttrsToJsx(content: string): string {
  let result = content;
  for (const { regex, replacement } of SVG_ATTR_REGEXES) {
    result = result.replace(regex, replacement);
  }
  return result;
}

/** Map of HTML SVG element names to react-native-svg component names. */
const ELEMENT_MAP: Record<string, string> = {
  circle: "Circle",
  clipPath: "ClipPath",
  defs: "Defs",
  ellipse: "Ellipse",
  g: "G",
  line: "Line",
  linearGradient: "LinearGradient",
  mask: "Mask",
  path: "Path",
  polygon: "Polygon",
  polyline: "Polyline",
  radialGradient: "RadialGradient",
  rect: "Rect",
  stop: "Stop",
  symbol: "Symbol",
  text: "Text",
  tspan: "TSpan",
  use: "Use",
};

/** Sorted entries with longer names first to avoid partial matches (e.g. "clipPath" before "path"). */
const ELEMENT_ENTRIES = Object.entries(ELEMENT_MAP).sort(
  (a, b) => b[0].length - a[0].length
);

function convertElements(content: string): string {
  let result = content;
  for (const [html, rn] of ELEMENT_ENTRIES) {
    // Opening / self-closing tags
    result = result.replace(new RegExp(`<${html}([\\s/>])`, "g"), `<${rn}$1`);
    // Closing tags
    result = result.replace(new RegExp(`</${html}>`, "g"), `</${rn}>`);
  }
  return result;
}

function detectUsedElements(inner: string): string[] {
  const used: string[] = [];
  for (const [html, rn] of ELEMENT_ENTRIES) {
    if (new RegExp(`<${html}[\\s/>]`).test(inner)) {
      used.push(rn);
    }
  }
  return used.sort();
}

const SVG_RE = /<svg\s+([\s\S]*?)>([\s\S]*)<\/svg>/;
const ATTR_RE = /([\w:-]+)="([^"]*)"/g;
const ID_RE = /\bid="([^"]+)"/g;

function parseSvg(raw: string): { attrs: string; inner: string } {
  const m = raw.match(SVG_RE);
  if (!m) {
    throw new Error("Invalid SVG content");
  }
  return { attrs: m[1].trim(), inner: m[2].trim() };
}

function parseAttrPairs(s: string): [string, string][] {
  const pairs: [string, string][] = [];
  for (const m of s.matchAll(ATTR_RE)) {
    pairs.push([m[1], m[2]]);
  }
  return pairs;
}

/** Attributes to exclude from the generated Svg element. */
const EXCLUDED_ATTRS = new Set(["xmlns", "xmlns:xlink", "aria-hidden"]);

function extractStaticIds(svg: string): string[] {
  const seen = new Set<string>();
  const ids: string[] = [];
  for (const m of svg.matchAll(ID_RE)) {
    if (!seen.has(m[1])) {
      seen.add(m[1]);
      ids.push(m[1]);
    }
  }
  return ids;
}

function escRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function replaceIds(content: string, ids: string[], vars: string[]): string {
  let r = content;
  for (let i = 0; i < ids.length; i++) {
    const sid = escRe(ids[i]);
    const vn = vars[i];
    r = r.replace(
      new RegExp(`="url\\(#${sid}\\)"`, "g"),
      `={\`url(#\${${vn}})\`}`
    );
    r = r.replace(new RegExp(`id="${sid}"`, "g"), `id={${vn}}`);
  }
  return r;
}

function formatInner(content: string, base: string): string {
  const lines = content.replace(/></g, ">\n<").split("\n").filter(Boolean);
  let depth = 0;
  const out: string[] = [];
  for (const raw of lines) {
    const t = raw.trim();
    if (t.startsWith("</")) {
      depth = Math.max(0, depth - 1);
    }
    out.push(`${base}${"  ".repeat(depth)}${t}`);
    if (
      t.startsWith("<") &&
      !t.startsWith("</") &&
      !t.endsWith("/>") &&
      !t.includes("</")
    ) {
      depth++;
    }
  }
  return out.join("\n");
}

function generate(icon: RegistryIcon, svgRaw: string): string {
  const { attrs, inner } = parseSvg(svgRaw);

  // Build Svg attribute lines, excluding xmlns and aria-hidden
  const rawPairs = parseAttrPairs(attrs);
  const jsxPairs: [string, string][] = [];
  for (const [name, value] of rawPairs) {
    if (EXCLUDED_ATTRS.has(name)) {
      continue;
    }
    jsxPairs.push([SVG_ATTR_MAP[name] || name, value]);
  }
  jsxPairs.sort((a, b) => a[0].localeCompare(b[0]));
  const attrLines = jsxPairs.map(([n, v]) => `        ${n}="${v}"`).join("\n");

  // Handle static IDs for clipPath / gradient references
  const isUseId = icon.useStaticIds === true;
  const sids = isUseId ? extractStaticIds(svgRaw) : [];
  const vars = sids.length === 1 ? ["id"] : sids.map((_, i) => `id${i + 1}`);

  // Convert attributes and element names for react-native-svg
  let jsx = convertAttrsToJsx(inner);
  if (isUseId && sids.length > 0) {
    jsx = replaceIds(jsx, sids, vars);
  }
  jsx = convertElements(jsx);
  const body = formatInner(jsx, "        ");

  // Detect which react-native-svg components are used
  const usedElements = detectUsedElements(inner);

  // Build imports
  const imports: string[] = [];
  if (isUseId && sids.length > 0) {
    imports.push('import React, { useId } from "react";');
  } else {
    imports.push('import React from "react";');
  }

  const namedImports =
    usedElements.length > 0 ? `, { ${usedElements.join(", ")} }` : "";
  imports.push(`import Svg${namedImports} from "react-native-svg";`);
  imports.push('import Icon from "../icon";');
  imports.push('import type { IconProps } from "../types";');

  const cn = icon.componentName;
  const useIdBlock =
    isUseId && sids.length > 0
      ? `${vars.map((v) => `  const ${v} = useId();`).join("\n")}\n\n`
      : "";

  return `${imports.join("\n")}

export const ${cn} = (props: IconProps) => {
${useIdBlock}  return (
    <Icon {...props}>
      <Svg
${attrLines}
      >
${body}
      </Svg>
    </Icon>
  );
};

${cn}.displayName = "${cn}";
`;
}

function barrel(
  items: Array<{ componentName: string; fileName: string }>
): string {
  return `${items
    .sort((a, b) => a.componentName.localeCompare(b.componentName))
    .map((c) => `export { ${c.componentName} } from "./${c.fileName}";`)
    .join("\n")}\n`;
}

function main() {
  console.log("\n\x1b[1mGenerating React Native icon components\x1b[0m\n");

  const registry: Registry = JSON.parse(
    readFileSync(join(PKG_ROOT, "registry.json"), "utf-8")
  );

  if (existsSync(RN_DIST)) {
    rmSync(RN_DIST, { recursive: true });
  }
  for (const d of [
    RN_DIST,
    join(RN_DIST, "semantic"),
    join(RN_DIST, "brand"),
  ]) {
    mkdirSync(d, { recursive: true });
  }

  for (const file of ["icon.tsx", "types.ts"]) {
    const src = join(TEMPLATES_DIR, file);
    if (!existsSync(src)) {
      throw new Error(`Missing required template: ${src}`);
    }
    cpSync(src, join(RN_DIST, file));
    console.log(`  \x1b[34mcopy\x1b[0m ${file}`);
  }

  const semantic: Array<{ componentName: string; fileName: string }> = [];
  const brand: Array<{ componentName: string; fileName: string }> = [];
  let count = 0;

  for (const icon of registry.icons) {
    const svgPath = join(SVG_DIR, icon.category, `${icon.name}.svg`);
    if (!existsSync(svgPath)) {
      throw new Error(`Missing SVG: ${svgPath}`);
    }

    const raw = readFileSync(svgPath, "utf-8").trim();
    const tsx = generate(icon, raw);
    const fn = icon.componentName;

    writeFileSync(join(RN_DIST, icon.category, `${fn}.tsx`), tsx);
    (icon.category === "semantic" ? semantic : brand).push({
      componentName: fn,
      fileName: fn,
    });
    count++;
    console.log(`  \x1b[32m✓\x1b[0m ${icon.category}/${fn}.tsx`);
  }

  writeFileSync(join(RN_DIST, "semantic", "index.ts"), barrel(semantic));
  writeFileSync(join(RN_DIST, "brand", "index.ts"), barrel(brand));
  writeFileSync(
    join(RN_DIST, "index.ts"),
    'export * from "./semantic";\nexport * from "./brand";\n'
  );

  console.log(
    `\n\x1b[1mDone:\x1b[0m ${count} components (${semantic.length} semantic, ${brand.length} brand)\n`
  );
}

try {
  main();
} catch (err) {
  console.error(err);
  process.exit(1);
}
