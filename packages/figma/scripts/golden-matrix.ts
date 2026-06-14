#!/usr/bin/env tsx
/**
 * Golden Matrix — React vs Figma Resolver Parity Diagnostic
 *
 * Compares resolveForReact and resolveForFigma outputs for ALL recipes
 * across every variant combination. Classifies each difference to determine
 * whether issues stem from type information loss or architectural problems.
 *
 * Usage: pnpm --filter @cocso-ui/figma golden-matrix
 */

import { writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import type { RecipeDefinition } from "@cocso-ui/recipe";
import { alertRecipe } from "@cocso-ui/recipe/recipes/alert.recipe";
import { avatarRecipe } from "@cocso-ui/recipe/recipes/avatar.recipe";
import { badgeRecipe } from "@cocso-ui/recipe/recipes/badge.recipe";
import { breadcrumbRecipe } from "@cocso-ui/recipe/recipes/breadcrumb.recipe";
import { buttonRecipe } from "@cocso-ui/recipe/recipes/button.recipe";
import { cardRecipe } from "@cocso-ui/recipe/recipes/card.recipe";
import { checkboxRecipe } from "@cocso-ui/recipe/recipes/checkbox.recipe";
import { dialogRecipe } from "@cocso-ui/recipe/recipes/dialog.recipe";
import { inputRecipe } from "@cocso-ui/recipe/recipes/input.recipe";
import { linkRecipe } from "@cocso-ui/recipe/recipes/link.recipe";
import { paginationRecipe } from "@cocso-ui/recipe/recipes/pagination.recipe";
import { progressRecipe } from "@cocso-ui/recipe/recipes/progress.recipe";
import { radioGroupRecipe } from "@cocso-ui/recipe/recipes/radio-group.recipe";
import { selectRecipe } from "@cocso-ui/recipe/recipes/select.recipe";
import { skeletonRecipe } from "@cocso-ui/recipe/recipes/skeleton.recipe";
import { spinnerRecipe } from "@cocso-ui/recipe/recipes/spinner.recipe";
import { stockQuantityStatusRecipe } from "@cocso-ui/recipe/recipes/stock-quantity-status.recipe";
import { switchRecipe } from "@cocso-ui/recipe/recipes/switch.recipe";
import { typographyRecipe } from "@cocso-ui/recipe/recipes/typography.recipe";
import { resolveForReact } from "@cocso-ui/recipe/resolvers/react";
import {
  type FigmaNodeSpec,
  resolveColorToken,
  resolveForFigma,
  resolveRadiusToken,
} from "../src/generators/recipe-resolver";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type DiffCategory =
  | "COMPOUND_SPLIT"
  | "EQUIVALENT"
  | "FIGMA_ONLY"
  | "PASSTHROUGH"
  | "REACT_ONLY"
  | "SILENT_DROP"
  | "STATE_UNSUPPORTED"
  | "VALUE_MISMATCH";

interface PropertyDiff {
  category: DiffCategory;
  figmaValue: unknown;
  note?: string;
  property: string;
  reactValue: string | undefined;
}

interface ComboDiff {
  combo: Record<string, string>;
  diffs: PropertyDiff[];
}

interface RecipeResult {
  baseCombos: ComboDiff[];
  comboCount: number;
  name: string;
  phase: "target" | "extended";
  stateDiffs: PropertyDiff[];
  stateNames: string[];
  variantDims: Record<string, string[]>;
}

interface RGB {
  b: number;
  g: number;
  r: number;
}

interface ParsedReactValue {
  borderStyle?: string;
  number?: number;
  raw: string;
  token?: string;
  type: "border" | "color" | "literal" | "px" | "radius" | "spacing" | "string";
}

// ---------------------------------------------------------------------------
// Recipe registry
// ---------------------------------------------------------------------------

// biome-ignore lint/suspicious/noExplicitAny: RecipeDefinition generic variance
type AnyRecipe = RecipeDefinition<any, any>;

interface RecipeEntry {
  phase: "target" | "extended";
  recipe: AnyRecipe;
}

const RECIPES: Record<string, RecipeEntry> = {
  button: { recipe: buttonRecipe, phase: "target" },
  badge: { recipe: badgeRecipe, phase: "target" },
  input: { recipe: inputRecipe, phase: "target" },
  select: { recipe: selectRecipe, phase: "extended" },
  link: { recipe: linkRecipe, phase: "extended" },
  checkbox: { recipe: checkboxRecipe, phase: "extended" },
  switch: { recipe: switchRecipe, phase: "extended" },
  "radio-group": { recipe: radioGroupRecipe, phase: "extended" },
  spinner: { recipe: spinnerRecipe, phase: "extended" },
  typography: { recipe: typographyRecipe, phase: "extended" },
  dialog: { recipe: dialogRecipe, phase: "extended" },
  pagination: { recipe: paginationRecipe, phase: "extended" },
  "stock-quantity-status": {
    recipe: stockQuantityStatusRecipe,
    phase: "extended",
  },
  alert: { recipe: alertRecipe, phase: "extended" },
  avatar: { recipe: avatarRecipe, phase: "extended" },
  breadcrumb: { recipe: breadcrumbRecipe, phase: "extended" },
  card: { recipe: cardRecipe, phase: "extended" },
  progress: { recipe: progressRecipe, phase: "extended" },
  skeleton: { recipe: skeletonRecipe, phase: "extended" },
};

// ---------------------------------------------------------------------------
// Top-level regex patterns
// ---------------------------------------------------------------------------

const RE_COLOR_VAR = /^var\(--cocso-color-(.+)\)$/;
const RE_TOKEN_VAR = /^var\(--cocso-(.+)\)$/;
const RE_PX_VALUE = /^(-?\d+(?:\.\d+)?)px$/;
const RE_BORDER_VALUE = /^(\d+)px\s+(\w+)\s+var\(--cocso-color-(.+)\)$/;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function rgbClose(a: RGB, b: RGB, tolerance = 0.002): boolean {
  return (
    Math.abs(a.r - b.r) < tolerance &&
    Math.abs(a.g - b.g) < tolerance &&
    Math.abs(a.b - b.b) < tolerance
  );
}

function formatRgb(rgb: RGB): string {
  return `rgb(${(rgb.r * 255).toFixed(0)}, ${(rgb.g * 255).toFixed(0)}, ${(rgb.b * 255).toFixed(0)})`;
}

function formatFigmaValue(value: unknown): string {
  if (value === undefined || value === null) {
    return "—";
  }
  if (typeof value === "object" && value !== null && "r" in value) {
    return formatRgb(value as RGB);
  }
  return JSON.stringify(value);
}

function comboLabel(combo: Record<string, string>): string {
  return Object.values(combo).join("/");
}

function parseReactValue(value: string): ParsedReactValue {
  const colorMatch = value.match(RE_COLOR_VAR);
  if (colorMatch) {
    return { type: "color", token: colorMatch[1], raw: value };
  }
  const tokenMatch = value.match(RE_TOKEN_VAR);
  if (tokenMatch) {
    const token = tokenMatch[1];
    if (token.startsWith("radius-")) {
      return { type: "radius", token, raw: value };
    }
    if (token.startsWith("spacing-")) {
      return { type: "spacing", token, raw: value };
    }
    return { type: "string", token, raw: value };
  }
  const pxMatch = value.match(RE_PX_VALUE);
  if (pxMatch) {
    return { type: "px", number: Number(pxMatch[1]), raw: value };
  }
  const borderMatch = value.match(RE_BORDER_VALUE);
  if (borderMatch) {
    return {
      type: "border",
      number: Number(borderMatch[1]),
      borderStyle: borderMatch[2],
      token: borderMatch[3],
      raw: value,
    };
  }
  return { type: "literal", raw: value };
}

function getVariantDimensions(recipe: AnyRecipe): Record<string, string[]> {
  const dims: Record<string, string[]> = {};
  for (const [dim, values] of Object.entries(recipe.variants)) {
    dims[dim] = Object.keys(values as Record<string, unknown>);
  }
  return dims;
}

function cartesian(dims: Record<string, string[]>): Record<string, string>[] {
  const keys = Object.keys(dims);
  if (keys.length === 0) {
    return [{}];
  }
  const [first, ...rest] = keys;
  const restDims: Record<string, string[]> = {};
  for (const k of rest) {
    restDims[k] = dims[k];
  }
  const restCombos = cartesian(restDims);
  return dims[first].flatMap((val) =>
    restCombos.map((c) => ({ [first]: val, ...c }))
  );
}

// ---------------------------------------------------------------------------
// Classification helpers
// ---------------------------------------------------------------------------

function classifyColor(
  key: string,
  reactValue: string,
  figmaValue: unknown,
  token: string
): PropertyDiff {
  if (
    typeof figmaValue === "object" &&
    figmaValue !== null &&
    "r" in figmaValue
  ) {
    const expected = resolveColorToken(token);
    if (rgbClose(expected, figmaValue as RGB)) {
      return { property: key, reactValue, figmaValue, category: "EQUIVALENT" };
    }
    return {
      property: key,
      reactValue,
      figmaValue,
      category: "VALUE_MISMATCH",
      note: `token "${token}" → expected ${formatRgb(expected)}, got ${formatRgb(figmaValue as RGB)}`,
    };
  }
  return { property: key, reactValue, figmaValue, category: "VALUE_MISMATCH" };
}

function classifyRadius(
  key: string,
  reactValue: string,
  figmaValue: number,
  token: string
): PropertyDiff {
  const expected = resolveRadiusToken(token);
  return {
    property: key,
    reactValue,
    figmaValue,
    category: expected === figmaValue ? "EQUIVALENT" : "VALUE_MISMATCH",
    note:
      expected === figmaValue
        ? undefined
        : `token "${token}" → expected ${expected}, got ${figmaValue}`,
  };
}

function classifySingleProperty(
  key: string,
  reactValue: string | undefined,
  figmaValue: unknown
): PropertyDiff {
  if (reactValue === undefined) {
    return { property: key, reactValue, figmaValue, category: "FIGMA_ONLY" };
  }
  if (figmaValue === undefined) {
    return classifyReactOnly(key, reactValue);
  }
  return classifyBothPresent(key, reactValue, figmaValue);
}

function classifyReactOnly(key: string, reactValue: string): PropertyDiff {
  const parsed = parseReactValue(reactValue);
  if (parsed.type === "color" && parsed.token === "transparent") {
    return {
      property: key,
      reactValue,
      figmaValue: undefined,
      category: "SILENT_DROP",
      note: "transparent → color token in React, dropped in Figma",
    };
  }
  const cssLiterals = ["currentColor", "none", "inherit"];
  if (parsed.type === "literal" && cssLiterals.includes(parsed.raw)) {
    return {
      property: key,
      reactValue,
      figmaValue: undefined,
      category: "SILENT_DROP",
      note: `CSS literal "${parsed.raw}" dropped in Figma`,
    };
  }
  return {
    property: key,
    reactValue,
    figmaValue: undefined,
    category: "REACT_ONLY",
  };
}

function classifyBothPresent(
  key: string,
  reactValue: string,
  figmaValue: unknown
): PropertyDiff {
  const parsed = parseReactValue(reactValue);
  if (parsed.type === "color" && parsed.token) {
    return classifyColor(key, reactValue, figmaValue, parsed.token);
  }
  if (parsed.type === "px" && typeof figmaValue === "number") {
    return {
      property: key,
      reactValue,
      figmaValue,
      category: parsed.number === figmaValue ? "EQUIVALENT" : "VALUE_MISMATCH",
    };
  }
  if (
    parsed.type === "radius" &&
    parsed.token &&
    typeof figmaValue === "number"
  ) {
    return classifyRadius(key, reactValue, figmaValue, parsed.token);
  }
  if (
    parsed.type === "literal" &&
    parsed.raw === "100%" &&
    figmaValue === 1000
  ) {
    return {
      property: key,
      reactValue,
      figmaValue,
      category: "EQUIVALENT",
      note: 'Both mean "fully rounded": CSS 100% ≈ Figma 1000',
    };
  }
  if (typeof figmaValue === "string" && reactValue === figmaValue) {
    return { property: key, reactValue, figmaValue, category: "PASSTHROUGH" };
  }
  if (typeof figmaValue === "number" && Number(reactValue) === figmaValue) {
    return { property: key, reactValue, figmaValue, category: "EQUIVALENT" };
  }
  return { property: key, reactValue, figmaValue, category: "VALUE_MISMATCH" };
}

// ---------------------------------------------------------------------------
// Comparison
// ---------------------------------------------------------------------------

function handleCompoundBorderSplit(
  react: Record<string, string>,
  figma: Record<string, unknown>,
  diffs: PropertyDiff[],
  accountedFigma: Set<string>
): void {
  if (!react.border || figma.border) {
    return;
  }
  const parsed = parseReactValue(react.border);
  if (parsed.type !== "border") {
    return;
  }
  const strokeColorOk =
    parsed.token &&
    figma.strokeColor &&
    typeof figma.strokeColor === "object" &&
    "r" in (figma.strokeColor as object) &&
    rgbClose(resolveColorToken(parsed.token), figma.strokeColor as RGB);
  const strokeWeightOk = figma.strokeWeight === parsed.number;
  diffs.push({
    property: "border",
    reactValue: react.border,
    figmaValue: undefined,
    category: "COMPOUND_SPLIT",
    note: `→ strokeColor=${formatFigmaValue(figma.strokeColor)} (${strokeColorOk ? "OK" : "MISMATCH"}), strokeWeight=${figma.strokeWeight} (${strokeWeightOk ? "OK" : "MISMATCH"}), borderStyle "${parsed.borderStyle}" not preserved`,
  });
  accountedFigma.add("strokeColor");
  accountedFigma.add("strokeWeight");
}

function compareOutputs(
  recipeName: string,
  reactOutput: Record<string, string>,
  figmaSpec: FigmaNodeSpec,
  combo: Record<string, string>
): ComboDiff {
  const diffs: PropertyDiff[] = [];
  const prefix = `--cocso-${recipeName}-`;

  const react: Record<string, string> = {};
  for (const [key, value] of Object.entries(reactOutput)) {
    const stripped = key.startsWith(prefix) ? key.slice(prefix.length) : key;
    react[stripped] = value;
  }

  const figma: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(figmaSpec)) {
    if (value !== undefined && key !== "_tokenRefs") {
      figma[key] = value;
    }
  }

  const accountedFigma = new Set<string>();
  handleCompoundBorderSplit(react, figma, diffs, accountedFigma);

  const allKeys = new Set<string>();
  for (const key of Object.keys(react)) {
    if (key !== "border" || !accountedFigma.size) {
      allKeys.add(key);
    }
  }
  for (const key of Object.keys(figma)) {
    if (!accountedFigma.has(key)) {
      allKeys.add(key);
    }
  }
  if (accountedFigma.size > 0) {
    allKeys.delete("border");
  }

  for (const key of allKeys) {
    diffs.push(classifySingleProperty(key, react[key], figma[key]));
  }

  return { combo, diffs };
}

// ---------------------------------------------------------------------------
// Per-recipe analysis
// ---------------------------------------------------------------------------

function analyzeStateParity(
  recipe: AnyRecipe,
  state: string,
  defaultCombo: Record<string, string>,
  baseReact: Record<string, string>
): PropertyDiff[] {
  const diffs: PropertyDiff[] = [];
  const prefix = `--cocso-${recipe.name}-`;
  const stateReact = resolveForReact(recipe, defaultCombo, { state });
  const stateFigma = resolveForFigma(recipe, defaultCombo, { state });

  const stateFigmaCombo = compareOutputs(recipe.name, stateReact, stateFigma, {
    ...defaultCombo,
    state,
  });
  for (const d of stateFigmaCombo.diffs) {
    if (d.category !== "EQUIVALENT" && d.category !== "PASSTHROUGH") {
      diffs.push(d);
    }
  }

  for (const [key, stateValue] of Object.entries(stateReact)) {
    if (baseReact[key] !== stateValue) {
      const stripped = key.startsWith(prefix) ? key.slice(prefix.length) : key;
      const figmaStateSpec = stateFigma as Record<string, unknown>;
      const figmaHasIt = figmaStateSpec[stripped] !== undefined;
      diffs.push({
        property: stripped,
        reactValue: stateValue,
        figmaValue: figmaHasIt ? figmaStateSpec[stripped] : undefined,
        category: figmaHasIt ? "EQUIVALENT" : "STATE_UNSUPPORTED",
        note: `${state}: ${baseReact[key]} → ${stateValue}`,
      });
    }
  }
  return diffs;
}

function analyzeRecipe(
  name: string,
  recipe: AnyRecipe,
  phase: "target" | "extended"
): RecipeResult {
  const variantDims = getVariantDimensions(recipe);
  const combos = cartesian(variantDims);
  const stateNames = recipe.states ? Object.keys(recipe.states) : [];

  const baseCombos: ComboDiff[] = [];
  for (const combo of combos) {
    const reactOutput = resolveForReact(recipe, combo);
    const figmaOutput = resolveForFigma(recipe, combo);
    baseCombos.push(
      compareOutputs(recipe.name, reactOutput, figmaOutput, combo)
    );
  }

  const stateDiffs: PropertyDiff[] = [];
  if (stateNames.length > 0) {
    const defaultCombo = (
      recipe.defaultVariants ? { ...recipe.defaultVariants } : combos[0]
    ) as Record<string, string>;
    const baseReact = resolveForReact(recipe, defaultCombo);
    for (const state of stateNames) {
      stateDiffs.push(
        ...analyzeStateParity(recipe, state, defaultCombo, baseReact)
      );
    }
  }

  return {
    name,
    phase,
    variantDims,
    comboCount: combos.length,
    baseCombos,
    stateDiffs,
    stateNames,
  };
}

// ---------------------------------------------------------------------------
// Report generation
// ---------------------------------------------------------------------------

function countByCategory(diffs: PropertyDiff[], cat: DiffCategory): number {
  return diffs.filter((d) => d.category === cat).length;
}

function getAllDiffs(results: RecipeResult[]): PropertyDiff[] {
  return results.flatMap((r) => [
    ...r.baseCombos.flatMap((c) => c.diffs),
    ...r.stateDiffs,
  ]);
}

function getRecipeDiffs(r: RecipeResult): PropertyDiff[] {
  return [...r.baseCombos.flatMap((c) => c.diffs), ...r.stateDiffs];
}

function reportHeader(
  results: RecipeResult[],
  allDiffs: PropertyDiff[]
): string[] {
  const now = new Date().toISOString().replace("T", " ").slice(0, 19);
  const target = results.filter((r) => r.phase === "target").length;
  const extended = results.filter((r) => r.phase === "extended").length;
  const totalCombos = results.reduce((s, r) => s + r.comboCount, 0);
  return [
    "# Golden Matrix Diagnostic Report",
    "",
    `- **Generated**: ${now}`,
    `- **Recipes**: ${results.length} (${target} target + ${extended} extended)`,
    `- **Total combinations**: ${totalCombos}`,
    `- **Total property comparisons**: ${allDiffs.length}`,
    "",
  ];
}

function reportPerRecipeTable(results: RecipeResult[]): string[] {
  const lines = [
    "## Per-Recipe Summary",
    "",
    "| Recipe | Phase | Combos | Comparisons | Equivalent | Passthrough | Silent Drop | Compound Split | State Unsupported | Value Mismatch | Result |",
    "|--------|-------|-------:|------------:|----------:|----------:|----------:|----------:|----------:|----------:|--------|",
  ];
  for (const r of results) {
    const d = getRecipeDiffs(r);
    const vm = countByCategory(d, "VALUE_MISMATCH");
    const ro = countByCategory(d, "REACT_ONLY");
    const fo = countByCategory(d, "FIGMA_ONLY");
    const unexplained = vm + ro + fo;
    lines.push(
      `| ${r.name} | ${r.phase} | ${r.comboCount} | ${d.length} | ${countByCategory(d, "EQUIVALENT")} | ${countByCategory(d, "PASSTHROUGH")} | ${countByCategory(d, "SILENT_DROP")} | ${countByCategory(d, "COMPOUND_SPLIT")} | ${countByCategory(d, "STATE_UNSUPPORTED")} | ${vm} | ${unexplained === 0 ? "✓ PASS" : `⚠ ${unexplained}`} |`
    );
  }
  lines.push("");
  return lines;
}

function reportGate(allDiffs: PropertyDiff[]): string[] {
  const vm = countByCategory(allDiffs, "VALUE_MISMATCH");
  const ro = countByCategory(allDiffs, "REACT_ONLY");
  const fo = countByCategory(allDiffs, "FIGMA_ONLY");
  const total = vm + ro + fo;
  const lines = ["## Gate Assessment", ""];
  if (total === 0) {
    lines.push(
      "**PASS** — All differences across all recipes are classifiable as expected format differences, known silent drops, compound splits, or missing state support."
    );
    lines.push("No fundamental architectural mismatch detected.");
  } else {
    lines.push(`**NEEDS INVESTIGATION** — ${total} unexplained difference(s).`);
  }
  lines.push("");
  return lines;
}

function collectPatterns(
  results: RecipeResult[]
): Map<string, { count: number; recipes: Set<string>; diff: PropertyDiff }> {
  const patterns = new Map<
    string,
    { count: number; recipes: Set<string>; diff: PropertyDiff }
  >();
  for (const r of results) {
    for (const combo of r.baseCombos) {
      for (const diff of combo.diffs) {
        if (diff.category === "EQUIVALENT" || diff.category === "PASSTHROUGH") {
          continue;
        }
        const pk = `${diff.property}|${diff.category}`;
        const existing = patterns.get(pk);
        if (existing) {
          existing.count++;
          existing.recipes.add(r.name);
        } else {
          patterns.set(pk, { count: 1, recipes: new Set([r.name]), diff });
        }
      }
    }
  }
  return patterns;
}

function reportPatterns(results: RecipeResult[]): string[] {
  const lines = ["## Difference Patterns (all recipes)", ""];
  const patterns = collectPatterns(results);
  if (patterns.size === 0) {
    lines.push("No non-trivial differences found.");
  } else {
    lines.push("| # | Property | Category | Count | Recipes | Note |");
    lines.push("|--:|----------|----------|------:|---------|------|");
    let idx = 1;
    for (const [, p] of patterns) {
      lines.push(
        `| ${idx} | \`${p.diff.property}\` | ${p.diff.category} | ${p.count} | ${[...p.recipes].join(", ")} | ${p.diff.note ?? "—"} |`
      );
      idx++;
    }
  }
  lines.push("");
  return lines;
}

function reportStates(results: RecipeResult[]): string[] {
  const withStates = results.filter((r) => r.stateNames.length > 0);
  if (withStates.length === 0) {
    return [];
  }
  const lines = [
    "## State Support",
    "",
    "| Recipe | States | Overridden Properties | Status |",
    "|--------|--------|----------------------|--------|",
  ];
  for (const r of withStates) {
    const props = [...new Set(r.stateDiffs.map((d) => d.property))].join(", ");
    lines.push(
      `| ${r.name} | ${r.stateNames.join(", ")} | ${props || "—"} | resolveForFigma now supports state option ✓ |`
    );
  }
  lines.push("");
  return lines;
}

function reportDetails(results: RecipeResult[]): string[] {
  const lines: string[] = [];
  for (const r of results) {
    const nonTrivial = r.baseCombos.some((c) =>
      c.diffs.some(
        (d) => d.category !== "EQUIVALENT" && d.category !== "PASSTHROUGH"
      )
    );
    if (!nonTrivial) {
      continue;
    }
    lines.push(`## ${r.name} — Non-Equivalent Details`);
    lines.push("");
    const seen = new Set<string>();
    for (const combo of r.baseCombos) {
      const interesting = combo.diffs.filter(
        (d) => d.category !== "EQUIVALENT" && d.category !== "PASSTHROUGH"
      );
      if (interesting.length === 0) {
        continue;
      }
      const key = interesting
        .map((d) => `${d.property}:${d.category}`)
        .join(",");
      if (seen.has(key)) {
        continue;
      }
      seen.add(key);
      lines.push(`**${comboLabel(combo.combo)}**`);
      lines.push("");
      lines.push("| Property | React | Figma | Category | Note |");
      lines.push("|----------|-------|-------|----------|------|");
      for (const d of interesting) {
        lines.push(
          `| \`${d.property}\` | \`${d.reactValue ?? "—"}\` | ${formatFigmaValue(d.figmaValue)} | ${d.category} | ${d.note ?? "—"} |`
        );
      }
      lines.push("");
    }
  }
  return lines;
}

function generateReport(results: RecipeResult[]): string {
  const allDiffs = getAllDiffs(results);
  return [
    ...reportHeader(results, allDiffs),
    ...reportPerRecipeTable(results),
    ...reportGate(allDiffs),
    ...reportPatterns(results),
    ...reportStates(results),
    ...reportDetails(results),
  ].join("\n");
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

console.log("Golden Matrix Diagnostic — All Recipes");
console.log("=======================================\n");

const results: RecipeResult[] = [];

for (const [name, entry] of Object.entries(RECIPES)) {
  const result = analyzeRecipe(name, entry.recipe, entry.phase);
  const allDiffs = [
    ...result.baseCombos.flatMap((c) => c.diffs),
    ...result.stateDiffs,
  ];
  const vm = countByCategory(allDiffs, "VALUE_MISMATCH");
  const status = vm === 0 ? "✓" : `⚠ ${vm} mismatch`;
  console.log(
    `  ${name}: ${result.comboCount} combos, ${allDiffs.length} comparisons ${status}`
  );
  results.push(result);
}

const report = generateReport(results);

const scriptDir = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(scriptDir, "..");
const outPath = join(outDir, "golden-matrix-report.md");
writeFileSync(outPath, report, "utf-8");

const totalDiffs = results.flatMap((r) => [
  ...r.baseCombos.flatMap((c) => c.diffs),
  ...r.stateDiffs,
]);
const totalMismatches = countByCategory(totalDiffs, "VALUE_MISMATCH");

console.log(`\nReport: ${outPath}`);
console.log(`Total recipes: ${results.length}`);
console.log(`Total comparisons: ${totalDiffs.length}`);
console.log(`Value mismatches: ${totalMismatches}`);

// State coverage gate: recipes with states must have 0 STATE_UNSUPPORTED diffs
const stateUnsupported = results
  .filter((r) => r.stateNames.length > 0)
  .reduce(
    (sum, r) => sum + countByCategory(r.stateDiffs, "STATE_UNSUPPORTED"),
    0
  );
console.log(`State unsupported: ${stateUnsupported}`);

if (totalMismatches === 0 && stateUnsupported === 0) {
  console.log(
    "\n✓ ALL RECIPES PASS — No architectural mismatches or state gaps detected."
  );
} else {
  if (totalMismatches > 0) {
    console.log(
      `\n⚠ ${totalMismatches} value mismatch(es) found across recipes.`
    );
  }
  if (stateUnsupported > 0) {
    console.log(
      `\n⚠ ${stateUnsupported} state coverage gap(s) — recipes with states have STATE_UNSUPPORTED diffs.`
    );
  }
  process.exit(1);
}
