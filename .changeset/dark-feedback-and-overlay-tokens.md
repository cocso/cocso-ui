---
"@cocso-ui/css": minor
---

Fix the dark theme's feedback colors and add theme-aware overlay tokens.

`--cocso-color-feedback-danger`, `-info`, `-warning` and `-success` were never
redefined for the dark theme, so they kept the light theme's 500 level — tuned
against white — and landed at 3.96–4.05 on the dark `surface-primary`, under
WCAG AA. `StockQuantityStatus` paints body-size text directly with these, so
its "insufficient" and "sufficient" states were unreadable. They now step to
the 400 level in the dark theme, clearing AA at 4.70–5.96 on both dark surfaces
without shifting hue.

Adds `--cocso-color-overlay-subtle`, `-muted` and `-strong` (`black-alpha-5/10/20`
in light, `white-alpha-5/10/20` in dark), also exported as Tailwind's
`overlay-subtle`/`-muted`/`-strong`. Use these for a translucent tint over an
unknown background instead of `black-alpha-*`, which is raw scale and stays
black in both themes so the Dialog scrim keeps working.
