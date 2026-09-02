---
"@cocso-ui/react": patch
---

Fix Link disappearing on hover in the dark theme.

Link painted its text with `interactive-info` and its hover state with
`interactive-info-active`. Both are fill tokens the dark theme leaves alone by
design, and as text on the dark `surface-primary` they measured 4.05:1 and
1.74:1 — hovering a link nearly erased it. It now uses
`interactive-info-text`/`-text-hover`, which flip: 8.35:1 and 11.49:1 in the
dark theme, with the light theme's rendering unchanged.

The contrast test that exists to catch this covered six of nineteen recipes and
did not include Link. It now covers all nineteen.
