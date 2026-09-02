---
"@cocso-ui/css": minor
---

Add `--cocso-color-interactive-info-text` and `-text-hover`, the text forms of
the info role.

The fixed-hue `interactive-*` fills are deliberately not redefined by the dark
theme, because a saturated accent reads on either surface when it is a filled
area. As a foreground the same values run backwards: on the dark
`surface-primary`, `interactive-info` is 4.05:1 and `interactive-info-active` —
the pressed-fill step — is 1.74:1. The new tokens carry the light theme's
values unchanged (`info-500` and `info-700`) and flip to `info-300` and
`info-200` in the dark theme, reaching 8.35:1 and 11.49:1.
