---
"@cocso-ui/baseframe": minor
---

Shadows reach the mobile artifacts as layers: `CocsoTokens.Shadow.card(scheme)` / `CocsoTokens.Shadow.card()` return `[CocsoShadowLayer]` / `List<CocsoShadowLayer>`, themed because the layers name `alpha-shadow*`, which the dark theme deepens. References embedded in composite values now resolve. New `mobile.generateTokensJson` emits `packages/css/tokens.json`.
