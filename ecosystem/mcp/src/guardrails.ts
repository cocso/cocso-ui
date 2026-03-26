import { IMPORT_PACKAGE_BY_PLATFORM } from "./config.js";
import type { PlatformId } from "./types.js";

export interface GuardrailRule {
  id: string;
  rationale: string;
  rule: string;
}

/**
 * Returns usage guardrails and best practices for the given platform.
 * Rules enforce design-system-first patterns and prevent local component duplication.
 */
export function getUsageGuardrails(platform: PlatformId): GuardrailRule[] {
  const targetPackage = IMPORT_PACKAGE_BY_PLATFORM[platform];

  return [
    {
      id: "SEARCH_FIRST",
      rule: "Always call component discovery tools before writing JSX or React Native view code.",
      rationale:
        "Prevents duplicate component creation when a design-system component already exists.",
    },
    {
      id: "PACKAGE_FIRST",
      rule: `If a matching component exists, import it from ${targetPackage} and do not create a local duplicate.`,
      rationale:
        "Keeps UI behavior and styling aligned with the design system.",
    },
    {
      id: "SPEC_FIRST",
      rule: "Read component markdown/API spec before usage to align props, variants, and accessibility behavior.",
      rationale: "Avoids hallucinated props and inconsistent interactions.",
    },
    {
      id: "ESCALATE_GAP",
      rule: "When no matching component exists, explicitly document the gap and propose extension in @cocso-ui package first.",
      rationale:
        "Consolidates component evolution in the shared design-system package.",
    },
  ];
}
