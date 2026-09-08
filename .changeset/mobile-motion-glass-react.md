---
"@cocso-ui/react": minor
---

`Card` and `Button` gain `variant="glass"`: `surface-glass` over a 16px `backdrop-filter` blur with a `border-glass` edge, `text-primary` ink; the button thins to `surface-glass-active` on hover and press. The same variant reaches SwiftUI (on `.ultraThinMaterial`) and Compose (composited over the page surface, so it reads as a solid there) from the recipe.
