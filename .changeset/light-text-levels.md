---
"@cocso-ui/css": minor
---

Point `interactive-info-text` at the 600 level in the light theme.

It carried `info-500`, which clears AA on white by 0.05 and misses it on every
other surface a link sits on: 4.17 on `surface-secondary`, 4.05 on a status
tint, 3.70 on `interactive-primary-subtle`. The 600 level clears all of them
(6.83 / 6.26 / 6.09 / 5.56). The dark theme is unchanged.
