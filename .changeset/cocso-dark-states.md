---
"@cocso-ui/css": patch
---

The cocso brand's dark states stop colliding. `interactive-primary-muted` was the same value as `interactive-primary-active`, so a disabled control read as a pressed one; it is now a desaturated navy. The four `feedback-*-border` tokens move from the ramp's `*-800` to `*-500`, the first rung that clears 3:1 on the brand's dark surfaces — a destructive action's outline had fallen to 1.12 on the page. `feedback-warning-text` drops a step so the warning ink stops outshouting the danger ink in dark. The base theme is unchanged.
