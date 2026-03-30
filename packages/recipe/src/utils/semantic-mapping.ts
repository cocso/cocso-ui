/**
 * Semantic-to-primitive color token mapping table.
 *
 * Each entry maps a semantic token name (e.g., "interactive-primary") to its
 * underlying primitive token (e.g., "primary-950"). This mapping mirrors the
 * CSS custom property definitions in `packages/css/token.css` and is consumed
 * by the Figma resolver as a fallback chain when `tokens.json` does not
 * contain a direct entry for a semantic token.
 */
export const SEMANTIC_TO_PRIMITIVE: Readonly<Record<string, string>> = {
  // --- text ---
  "text-primary": "neutral-950",
  "text-secondary": "neutral-600",
  "text-tertiary": "neutral-400",
  "text-disabled": "neutral-400",
  "text-on-primary": "white",
  "text-muted": "neutral-500",

  // --- surface ---
  "surface-primary": "white",
  "surface-secondary": "neutral-50",
  "surface-inverse": "neutral-950",
  "surface-neutral": "neutral-100",

  // --- border ---
  "border-primary": "neutral-200",
  "border-secondary": "neutral-100",

  // --- interactive ---
  "interactive-primary": "primary-950",
  "interactive-primary-hover": "primary-800",
  "interactive-primary-active": "primary-700",
  "interactive-primary-muted": "primary-500",
  "interactive-secondary": "neutral-100",
  "interactive-secondary-hover": "neutral-200",
  "interactive-danger": "danger-500",
  "interactive-danger-hover": "danger-600",
  "interactive-danger-active": "danger-700",
  "interactive-danger-hover-subtle": "danger-400",
  "interactive-success": "success-500",
  "interactive-success-hover": "success-600",
  "interactive-success-active": "success-700",
  "interactive-success-hover-subtle": "success-400",
  "interactive-warning": "warning-300",
  "interactive-warning-hover": "warning-400",
  "interactive-warning-active": "warning-500",
  "interactive-warning-hover-subtle": "warning-400",
  "interactive-info": "info-500",
  "interactive-info-hover": "info-600",
  "interactive-info-active": "info-700",
  "interactive-info-hover-subtle": "info-400",

  // --- focus ---
  "focus-ring": "primary-950",

  // --- feedback ---
  "feedback-danger": "danger-500",
  "feedback-danger-subtle": "danger-50",
  "feedback-danger-text": "danger-600",
  "feedback-danger-border": "danger-200",
  "feedback-success": "success-500",
  "feedback-success-subtle": "success-50",
  "feedback-success-text": "success-600",
  "feedback-success-border": "success-200",
  "feedback-success-muted": "success-400",
  "feedback-warning": "warning-500",
  "feedback-warning-subtle": "warning-50",
  "feedback-warning-text": "warning-600",
  "feedback-warning-border": "warning-200",
  "feedback-info": "info-500",
  "feedback-info-subtle": "info-50",
  "feedback-info-text": "info-600",
  "feedback-info-border": "info-200",
};
