---
"@cocso-ui/css": patch
"@cocso-ui/recipe": patch
"@cocso-ui/react": patch
---

Two colour fixes the mobile app found.

`button`'s `ghost` variant is see-through. It filled `surface-primary`, which is invisible on a white page and a white pill on anything else — next to `error-ghost`, which is already `transparent`, the two read as different weights. The hover state still fills `surface-secondary`, so nothing changes on a white page.

The cocso brand's `interactive.primary-muted` is `info-200` in light and `info-700` in dark. It was `info-500` in both, which is the same value the brand gives `interactive.primary` in light: a muted control was pixel-for-pixel a live one. The base tokens had the relationship right; only the brand overlay lost it.
