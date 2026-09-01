---
"@cocso-ui/react": patch
"@cocso-ui/css": minor
---

Fix text that ships below WCAG AA.

**Dark theme**

`text-on-primary` and `text-primary` are redefined by the dark theme, because `interactive-primary` is. The status fills are not — `interactive-success`, `-danger`, `-info`, and `-warning` keep their hue in both themes — so pairing a foreground that flips with a fill that does not put a near-white label on bright amber. `Button variant="warning"` rendered at **1.67:1** in dark mode; `success`, `error`, and `info` sat at ~4.0:1, and `Avatar` initials at 3.92:1.

Fixed-hue fills now have foregrounds that do not flip: new `--cocso-color-text-on-success`, `-danger`, `-info` (white) and `-warning` (`neutral-950`), defined identically in both themes. `Avatar` initials move to `text-primary`.

**Interactive states**

A state that darkens a fill without moving its label walks the pairing toward the threshold. `Button` `secondary` crossed AA on hover (3.92:1 in dark) and when pressed (4.10:1 in light), so its label now steps to `text-primary` for both. `Button` `warning`'s pressed fill stops at the hover step: `interactive-warning-active` under the dark label is 3.96:1 and the amber ramp has no darker step that keeps the label readable.

**Light theme**

- `Field` rendered the "optional" marker in `text-tertiary` — 12px text at 3.08:1 on white, 2.82:1 on `surface-secondary`. Now `text-secondary`.
- `Breadcrumb` rendered crumbs in `text-muted` — 4.09:1 on the dark theme's surface and 4.13:1 on the light theme's `surface-secondary`, at 12/14/16px. Now `text-secondary`.
- `Breadcrumb` hardcoded `neutral-950` for the current crumb. That is the dark theme's own background colour, so the current page rendered at 1.0:1 and was invisible in dark mode. Now `text-primary`, which resolves to the same value in the light theme. Its separator moves off a hardcoded `neutral-300` to `text-tertiary` so it follows the theme, rendering slightly darker in the light theme.

**Tokens keep their values**

`text-tertiary` and `text-muted` are unchanged. Remapping them does not reach AA — the neutral ramp has no step that clears 4.5:1 in both themes without collapsing into `text-secondary` — so `docs/project-css.md` documents what each tier may carry, and a genuine third text tier is recorded as a ramp change on the roadmap.

A test resolves every recipe pairing of a fill and a foreground through both themes and asserts AA, so these cannot come back silently.
