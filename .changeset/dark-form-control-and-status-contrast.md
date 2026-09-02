---
"@cocso-ui/react": patch
---

Fix three colors that kept their light-theme value when the theme flipped.

**Checkbox** pinned its glyph to `colors.white` in an inline style while its
fill is `interactive-primary`, which the dark theme flips to `primary-50`. That
is a white check on a near-white box — 1.09:1, so a checked box and an
unchecked one looked the same. It now uses `text-on-primary`, which is white in
the light theme (nothing moves there) and `neutral-950` in the dark one
(16.89:1). Because the value was inline, a consumer could not override it from
CSS.

**Switch** pinned its unchecked track to `colors.neutral100`, a raw ramp value,
so the track stayed bright on a dark page. It now uses `surface-neutral`, which
is `neutral-100` in the light theme and `neutral-800` in the dark one.

**StockQuantityStatus** painted its `normal` state with
`feedback-success-muted`, which is `success-400` and 3.09:1 on white — below AA
for body-size text in the *light* theme. It now uses `feedback-success`:
4.57:1 in light, 5.96:1 in dark.

`colors` gains `textOnPrimary` and `surfaceNeutral`, the two semantic tokens
these fixes needed.
