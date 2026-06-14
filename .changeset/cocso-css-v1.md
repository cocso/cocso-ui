---
"@cocso-ui/css": major
---

BREAKING: rename CSS custom property prefix from `--ds-*` to `--cocso-*` and
rebase the color system. `primary` is now derived from the `neutral` scale and
several token values changed.

Migration:
- Replace all `--ds-color-*` / `--ds-*` references with `--cocso-*`.
- Re-check any hardcoded reliance on the previous blue `primary` palette; it now
  resolves to the neutral scale.
