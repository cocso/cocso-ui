---
"@cocso-ui/codegen": minor
---

Emit the SwiftUI and Compose style resolvers from the recipes.

`pnpm --filter @cocso-ui/codegen generate:mobile` writes `CocsoStyles.swift`
and `CocsoStyles.kt` from `packages/recipe` — the same recipes the CSS comes
from. A variant added to `button.recipe.ts` reaches web, iOS and Android
without three people remembering to add it.

Each recipe becomes an enum per variant dimension, a style struct, and a
resolver that applies base, then per-dimension variants, then compound
variants. That precedence is the cascade the CSS relies on; neither platform
has one, so it is a function.

Twenty-one properties are not carried across, each named with its reason —
`transparent` and `currentColor`, which both platforms express themselves;
composite borders; and CSS padding shorthand that is not two lengths.
