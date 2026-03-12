/**
 * Design token map for border-radius values.
 *
 * Each value is a CSS `var()` reference that resolves to the corresponding
 * `--cocso-radius-*` CSS custom property defined in the base-frame token
 * stylesheet. Scale runs from `r1` (2 px, tight corners) through `r6`
 * (16 px, reserved), with `full` (1000 px) for pill/circular shapes.
 */
export const radius = {
  r1: "var(--cocso-radius-1)",
  r2: "var(--cocso-radius-2)",
  r3: "var(--cocso-radius-3)",
  r4: "var(--cocso-radius-4)",
  r5: "var(--cocso-radius-5)",
  r6: "var(--cocso-radius-6)",
  full: "var(--cocso-radius-full)",
} as const;
