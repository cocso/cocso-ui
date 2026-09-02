---
"@cocso-ui/react": patch
---

Stop StockQuantityStatus drawing a light grey track in the dark theme.

Its indicator wrote `fill="#D9D9D9"` into the SVG six times — the unfilled part
of the capsule, which resolved to `#dfdfdf` and stayed there when the theme
flipped, leaving a bright track behind the status colour on a dark surface. It
now reads `surface-neutral` from the CSS Module, within a shade of the old
light value and correctly dark in the dark theme.

Adds a guard so this class of defect stops reaching components: a component's
`.tsx` may name a semantic token and nothing else — no raw ramp entry from
`colors`, no colour literal, in an inline style or an SVG attribute. Checkbox,
Switch and StockQuantityStatus had each done it, and all three were found by
eye.
