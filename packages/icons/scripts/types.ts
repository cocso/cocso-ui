export interface RegistryIcon {
  aliases: string[];
  category: string;
  colorStrategy: string;
  componentName: string;
  name: string;
  source: string;
  tags: string[];
  useStaticIds?: boolean;
  viewBox: string;
}

export interface Registry {
  icons: RegistryIcon[];
}

export type ColorStrategy = "stroke" | "fill" | "mixed" | "hardcoded";

/** Convert PascalCase to kebab-case: "ArrowDown" → "arrow-down". */
export function pascalToKebab(str: string): string {
  return str
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1-$2")
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .toLowerCase();
}

/** Convert kebab-case to PascalCase: "arrow-down" → "ArrowDown". */
export function kebabToPascal(str: string): string {
  return str
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

const LEADING_DIGIT = /^\d/;

/** Validate that a component name follows the PascalCase convention. */
export function validateComponentName(name: string): void {
  if (LEADING_DIGIT.test(name)) {
    throw new Error(
      `Icon name "${name}" starts with a digit and would produce an invalid TypeScript identifier. Use a name that starts with a letter (e.g., "icon-${name}").`
    );
  }
}

/** Detect whether an SVG icon uses currentColor or hardcoded fill colors. */
export function detectColorStrategy(content: string): ColorStrategy {
  const hasStroke = content.includes('stroke="currentColor"');
  const hasFillCurrent = content.includes('fill="currentColor"');

  if (hasStroke && hasFillCurrent) {
    return "mixed";
  }
  if (hasStroke) {
    return "stroke";
  }
  if (hasFillCurrent) {
    return "fill";
  }
  return "hardcoded";
}
