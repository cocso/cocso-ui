/**
 * Generates React icon components from canonical SVG source files.
 *
 * Reads SVGs from svg/semantic/ and svg/brand/, converts them to React
 * components matching the @cocso-ui/react-icons pattern (Icon wrapper,
 * displayName, aria-hidden, useId for static-ID icons).
 */
import {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";
import type { Registry, RegistryIcon } from "./types";

// biome-ignore lint/correctness/noGlobalDirnameFilename: tsx runs in CJS mode, import.meta.dirname is undefined
const PKG_ROOT = join(__dirname, "..");
const SVG_DIR = join(PKG_ROOT, "svg");
const DIST_DIR = join(PKG_ROOT, "dist");
const REACT_DIST = join(DIST_DIR, "react");
const REACT_ICONS_SRC = join(PKG_ROOT, "..", "react-icons", "src");

/** SVG kebab-case attributes that need camelCase conversion in JSX */
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

// Pre-compiled regexes for SVG→JSX attribute conversion
const SVG_ATTR_REGEXES = Object.entries(SVG_ATTR_MAP).map(
  ([svgAttr, jsxAttr]) => ({
    regex: new RegExp(`(?<=\\s)${svgAttr.replace(/-/g, "\\-")}=`, "g"),
    replacement: `${jsxAttr}=`,
  })
);

// ---------- helpers ----------

function convertAttrsToJsx(content: string): string {
  let result = content;
  for (const { regex, replacement } of SVG_ATTR_REGEXES) {
    result = result.replace(regex, replacement);
  }
  return result;
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
    // url(#id) references → JSX template expression
    r = r.replace(
      new RegExp(`="url\\(#${sid}\\)"`, "g"),
      `={\`url(#\${${vn}})\`}`
    );
    // id="id" → id={var}
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

// ---------- component generator ----------

function generate(icon: RegistryIcon, svgRaw: string): string {
  const { attrs, inner } = parseSvg(svgRaw);

  // --- SVG element attributes ---
  const rawPairs = parseAttrPairs(attrs);
  const jsxPairs: [string, string][] = [["aria-hidden", "true"]];
  for (const [name, value] of rawPairs) {
    jsxPairs.push([SVG_ATTR_MAP[name] || name, value]);
  }
  jsxPairs.sort((a, b) => a[0].localeCompare(b[0]));
  const attrLines = jsxPairs.map(([n, v]) => `        ${n}="${v}"`).join("\n");

  // --- inner content ---
  const isUseId = icon.useStaticIds === true;
  const sids = isUseId ? extractStaticIds(svgRaw) : [];
  const vars = sids.length === 1 ? ["id"] : sids.map((_, i) => `id${i + 1}`);

  let jsx = convertAttrsToJsx(inner);
  if (isUseId && sids.length > 0) {
    jsx = replaceIds(jsx, sids, vars);
  }
  const body = formatInner(jsx, "        ");

  // --- imports ---
  const imports: string[] = [];
  if (isUseId && sids.length > 0) {
    imports.push('import { useId } from "react";');
  }
  imports.push('import Icon from "../icon";');
  imports.push('import type { IconProps } from "../types";');

  // --- assemble ---
  const cn = icon.componentName;
  const useIdBlock =
    isUseId && sids.length > 0
      ? `${vars.map((v) => `  const ${v} = useId();`).join("\n")}\n\n`
      : "";

  return `${imports.join("\n")}

export const ${cn} = (props: IconProps) => {
${useIdBlock}  return (
    <Icon {...props}>
      <svg
${attrLines}
      >
${body}
      </svg>
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

// ---------- main ----------

function main() {
  console.log("\n\x1b[1mGenerating React icon components\x1b[0m\n");

  const registry: Registry = JSON.parse(
    readFileSync(join(PKG_ROOT, "registry.json"), "utf-8")
  );

  // Clean and create output dirs
  if (existsSync(REACT_DIST)) {
    rmSync(REACT_DIST, { recursive: true });
  }
  for (const d of [
    REACT_DIST,
    join(REACT_DIST, "semantic"),
    join(REACT_DIST, "brand"),
  ]) {
    mkdirSync(d, { recursive: true });
  }

  // Copy supporting files from react-icons/src
  for (const file of ["icon.tsx", "child.tsx", "types.ts"]) {
    const src = join(REACT_ICONS_SRC, file);
    if (existsSync(src)) {
      cpSync(src, join(REACT_DIST, file));
      console.log(`  \x1b[34mcopy\x1b[0m ${file}`);
    } else {
      console.error(`  \x1b[31m✗\x1b[0m missing ${src}`);
      process.exit(1);
    }
  }

  const semantic: Array<{ componentName: string; fileName: string }> = [];
  const brand: Array<{ componentName: string; fileName: string }> = [];
  let count = 0;

  for (const icon of registry.icons) {
    const svgPath = join(SVG_DIR, icon.category, `${icon.name}.svg`);
    if (!existsSync(svgPath)) {
      console.error(`  \x1b[31m✗\x1b[0m missing SVG: ${svgPath}`);
      process.exit(1);
    }

    const raw = readFileSync(svgPath, "utf-8").trim();
    const tsx = generate(icon, raw);
    const fn = icon.componentName;

    writeFileSync(join(REACT_DIST, icon.category, `${fn}.tsx`), tsx);
    (icon.category === "semantic" ? semantic : brand).push({
      componentName: fn,
      fileName: fn,
    });
    count++;
    console.log(`  \x1b[32m✓\x1b[0m ${icon.category}/${fn}.tsx`);
  }

  // Barrel files
  writeFileSync(join(REACT_DIST, "semantic", "index.ts"), barrel(semantic));
  writeFileSync(join(REACT_DIST, "brand", "index.ts"), barrel(brand));
  writeFileSync(
    join(REACT_DIST, "index.ts"),
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
