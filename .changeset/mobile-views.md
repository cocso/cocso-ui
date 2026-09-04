---
"@cocso-ui/codegen": patch
---

Add the first mobile views: `CCButton`, `CCBadge`, `CCCard`, `CCAlert` on both
SwiftUI and Jetpack Compose.

Each takes its values from its generated style resolver and decides nothing
about what a variant looks like — the same split the web has between a recipe
and its `.tsx`. Their parameters mirror the web's props.

`mobile-views.test.ts` compares the two platforms: a component present on one
and not the other fails, as does one whose variant dimensions differ, as does a
view that reaches past its resolver to pick tokens by hand.
