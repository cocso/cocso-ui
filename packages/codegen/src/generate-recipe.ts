import type { RecipeDefinition, SlotStyles, StyleValue } from "@cocso-ui/recipe";
import { resolveStyleValue } from "@cocso-ui/recipe/resolvers/react";

/**
 * Convert camelCase to kebab-case: "bgColor" -> "bg-color"
 */
function camelToKebab(str: string): string {
  return str.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);
}

/**
 * Get all variant combinations for a recipe as an array of objects.
 * e.g., [{ variant: "primary", size: "large", shape: "square" }, ...]
 */
export function getAllCombinations<
  V extends Record<string, Record<string, Partial<Record<S, SlotStyles>>>>,
  S extends string,
>(recipe: RecipeDefinition<V, S>): Record<string, string>[] {
  const dimensions = Object.entries(recipe.variants).map(([dim, values]) => ({
    dim,
    values: Object.keys(values as Record<string, unknown>),
  }));

  const combos: Record<string, string>[] = [];
  function walk(idx: number, current: Record<string, string>) {
    if (idx === dimensions.length) {
      combos.push({ ...current });
      return;
    }
    const { dim, values } = dimensions[idx];
    for (const val of values) {
      current[dim] = val;
      walk(idx + 1, current);
    }
  }
  walk(0, {});
  return combos;
}

/**
 * Resolve slot styles into a CSS custom property map.
 * Reuses resolveStyleValue from the recipe package.
 */
function resolveSlotProps(
  prefix: string,
  slots: readonly string[],
  slotMap: Partial<Record<string, SlotStyles>>,
): Record<string, string> {
  const result: Record<string, string> = {};
  for (const slot of slots) {
    const styles = slotMap[slot];
    if (!styles) continue;
    for (const [prop, value] of Object.entries(styles)) {
      result[camelToKebab(`${prefix}-${prop}`)] = resolveStyleValue(value);
    }
  }
  return result;
}

interface CSSRule {
  selector: string;
  properties: Record<string, string>;
  mediaQuery?: string;
}

/**
 * Generate CSS rules for a single recipe.
 *
 * Generates per-dimension rules (not Cartesian product), keeping CSS compact:
 * - Base styles → .cocso-button { ... }
 * - Per-dimension → .cocso-button--variant-primary { ... }
 * - Compound variants → .cocso-button--shape-square.cocso-button--size-large { ... }
 * - State overrides → @media (hover: hover) { .cocso-button--variant-primary:hover { ... } }
 */
export function generateCSS<
  V extends Record<string, Record<string, Partial<Record<S, SlotStyles>>>>,
  S extends string,
>(recipe: RecipeDefinition<V, S>): string {
  const name = `cocso-${recipe.name}`;
  const prefix = `--cocso-${recipe.name}`;
  const rules: CSSRule[] = [];

  // 1. Base styles
  if (recipe.base) {
    const props = resolveSlotProps(prefix, recipe.slots, recipe.base);
    if (Object.keys(props).length > 0) {
      rules.push({ selector: `.${name}`, properties: props });
    }
  }

  // 2. Per-dimension variant styles (orthogonal — no Cartesian product)
  for (const [dim, values] of Object.entries(recipe.variants)) {
    for (const [val, slotMap] of Object.entries(values as Record<string, Partial<Record<string, SlotStyles>>>)) {
      const props = resolveSlotProps(prefix, recipe.slots, slotMap);
      if (Object.keys(props).length > 0) {
        rules.push({
          selector: `.${name}.${name}--${dim}-${val}`,
          properties: props,
        });
      }
    }
  }

  // 3. Compound variants
  if (recipe.compoundVariants) {
    for (const cv of recipe.compoundVariants) {
      const conditions = cv.conditions as Record<string, string | string[]>;
      const props = resolveSlotProps(prefix, recipe.slots, cv.styles);
      if (Object.keys(props).length === 0) continue;

      // Expand array conditions into separate rules
      const selectorSets = expandConditions(name, conditions);
      for (const selector of selectorSets) {
        rules.push({ selector, properties: { ...props } });
      }
    }
  }

  // 4. State-suffixed properties (e.g., --cocso-button-bg-color-hover)
  //    These are set alongside base properties so CSS Modules can reference them
  //    via :hover { background-color: var(--cocso-button-bg-color-hover) }
  if (recipe.states) {
    for (const [state, stateMap] of Object.entries(recipe.states)) {
      const typedStateMap = stateMap as Record<string, Record<string, Partial<Record<string, SlotStyles>>> | undefined>;
      for (const [dim, dimValues] of Object.entries(typedStateMap)) {
        if (!dimValues) continue;
        for (const [val, slotMap] of Object.entries(dimValues)) {
          const props = resolveSlotProps(prefix, recipe.slots, slotMap as Partial<Record<string, SlotStyles>>);
          if (Object.keys(props).length === 0) continue;
          // Suffix each property key with the state name
          const suffixedProps: Record<string, string> = {};
          for (const [key, value] of Object.entries(props)) {
            suffixedProps[`${key}-${state}`] = value;
          }
          rules.push({
            selector: `.${name}.${name}--${dim}-${val}`,
            properties: suffixedProps,
          });
        }
      }
    }
  }

  return formatCSS(rules);
}

/**
 * Expand compound variant conditions with array values into multiple CSS selectors.
 * e.g., { shape: "square", size: ["large", "medium"] }
 * → [".cocso-button--shape-square.cocso-button--size-large",
 *    ".cocso-button--shape-square.cocso-button--size-medium"]
 */
function expandConditions(
  name: string,
  conditions: Record<string, string | string[]>,
): string[] {
  const entries = Object.entries(conditions);
  const results: string[] = [];

  function walk(idx: number, parts: string[]) {
    if (idx === entries.length) {
      results.push(`.${name}${parts.join("")}`);
      return;
    }
    const [dim, value] = entries[idx];
    const values = Array.isArray(value) ? value : [value];
    for (const v of values) {
      walk(idx + 1, [...parts, `.${name}--${dim}-${v}`]);
    }
  }
  walk(0, []);
  return results;
}

function formatCSS(rules: CSSRule[]): string {
  const lines: string[] = [];
  lines.push("/* Generated by @cocso-ui/codegen — do not edit */");
  lines.push("");

  // Group media-query rules
  const normalRules = rules.filter((r) => !r.mediaQuery);
  const mediaGroups = new Map<string, CSSRule[]>();
  for (const rule of rules) {
    if (rule.mediaQuery) {
      const group = mediaGroups.get(rule.mediaQuery) ?? [];
      group.push(rule);
      mediaGroups.set(rule.mediaQuery, group);
    }
  }

  for (const rule of normalRules) {
    lines.push(`${rule.selector} {`);
    for (const [prop, value] of Object.entries(rule.properties)) {
      lines.push(`  ${prop}: ${value};`);
    }
    lines.push("}");
    lines.push("");
  }

  for (const [query, groupRules] of mediaGroups) {
    lines.push(`@media ${query} {`);
    for (const rule of groupRules) {
      lines.push(`  ${rule.selector} {`);
      for (const [prop, value] of Object.entries(rule.properties)) {
        lines.push(`    ${prop}: ${value};`);
      }
      lines.push("  }");
      lines.push("");
    }
    lines.push("}");
    lines.push("");
  }

  return lines.join("\n");
}

/**
 * Generate a className composition function for a recipe.
 * For single-slot: returns a string.
 * For multi-slot: returns an object with slot keys.
 */
export function generateRuntime<
  V extends Record<string, Record<string, Partial<Record<S, SlotStyles>>>>,
  S extends string,
>(recipe: RecipeDefinition<V, S>): string {
  const name = `cocso-${recipe.name}`;
  const dims = Object.entries(recipe.variants).map(([dim, values]) => ({
    dim,
    values: Object.keys(values as Record<string, unknown>),
  }));
  const defaults = recipe.defaultVariants ?? {};
  const isSingleSlot = recipe.slots.length === 1;

  const lines: string[] = [];
  lines.push("/* Generated by @cocso-ui/codegen — do not edit */");
  lines.push("");

  // Generate the props type
  const typeName = pascalCase(recipe.name) + "VariantProps";
  lines.push(`export interface ${typeName} {`);
  for (const { dim, values } of dims) {
    const unionType = values.map((v) => `"${v}"`).join(" | ");
    const defaultVal = (defaults as Record<string, string>)[dim];
    const isOptional = defaultVal !== undefined;
    lines.push(`  ${dim}${isOptional ? "?" : ""}: ${unionType};`);
  }
  lines.push("}");
  lines.push("");

  const fnName = camelCase(recipe.name);
  if (isSingleSlot) {
    lines.push(`export function ${fnName}(props: ${typeName} = {}): string {`);
    lines.push(`  const {`);
    for (const { dim } of dims) {
      const defaultVal = (defaults as Record<string, string>)[dim];
      if (defaultVal) {
        lines.push(`    ${dim} = "${defaultVal}",`);
      } else {
        lines.push(`    ${dim},`);
      }
    }
    lines.push(`  } = props;`);
    lines.push(`  return [`);
    lines.push(`    "${name}",`);
    for (const { dim } of dims) {
      lines.push(`    ${dim} && \`${name}--${dim}-\${${dim}}\`,`);
    }
    lines.push(`  ].filter(Boolean).join(" ");`);
    lines.push("}");
  }

  lines.push("");
  return lines.join("\n");
}

/**
 * Generate TypeScript type declarations for a recipe.
 */
export function generateTypes<
  V extends Record<string, Record<string, Partial<Record<S, SlotStyles>>>>,
  S extends string,
>(recipe: RecipeDefinition<V, S>): string {
  const dims = Object.entries(recipe.variants).map(([dim, values]) => ({
    dim,
    values: Object.keys(values as Record<string, unknown>),
  }));
  const defaults = recipe.defaultVariants ?? {};

  const lines: string[] = [];
  lines.push("/* Generated by @cocso-ui/codegen — do not edit */");
  lines.push("");

  const typeName = pascalCase(recipe.name) + "VariantProps";
  lines.push(`export interface ${typeName} {`);
  for (const { dim, values } of dims) {
    const unionType = values.map((v) => `"${v}"`).join(" | ");
    const defaultVal = (defaults as Record<string, string>)[dim];
    const isOptional = defaultVal !== undefined;
    lines.push(`  ${dim}${isOptional ? "?" : ""}: ${unionType};`);
  }
  lines.push("}");
  lines.push("");

  // Export individual type aliases for convenience
  for (const { dim, values } of dims) {
    const typeName = pascalCase(recipe.name) + pascalCase(dim);
    const unionType = values.map((v) => `"${v}"`).join(" | ");
    lines.push(`export type ${typeName} = ${unionType};`);
  }
  lines.push("");

  lines.push(`export declare function ${camelCase(recipe.name)}(props?: ${typeName}): string;`);
  lines.push("");

  return lines.join("\n");
}

function pascalCase(str: string): string {
  return str
    .split(/[-_]/)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join("");
}

const JS_RESERVED = new Set([
  "break", "case", "catch", "continue", "debugger", "default", "delete",
  "do", "else", "finally", "for", "function", "if", "in", "instanceof",
  "new", "return", "switch", "this", "throw", "try", "typeof", "var",
  "void", "while", "with", "class", "const", "enum", "export", "extends",
  "import", "super", "implements", "interface", "let", "package", "private",
  "protected", "public", "static", "yield",
]);

function camelCase(str: string): string {
  const pascal = pascalCase(str);
  const result = pascal.charAt(0).toLowerCase() + pascal.slice(1);
  return JS_RESERVED.has(result) ? `${result}Styles` : result;
}
