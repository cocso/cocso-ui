# @cocso-ui/codegen

## 0.1.0

### Minor Changes

- cb5f977: Emit the SwiftUI and Compose style resolvers from the recipes.

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

### Patch Changes

- cb5f977: Add the mobile view layer: thirteen components matched on SwiftUI and Jetpack
  Compose — button, badge, card, alert, typography, avatar, skeleton, progress,
  spinner, checkbox, switch, input, and the `CCTouchTarget` primitive.

  Each takes its values from its generated style resolver and decides nothing
  about what a variant looks like — the same split the web has between a recipe
  and its `.tsx`. Their parameters mirror the web's props.

  Three gates cover the hand-written half, which the generators cannot keep in
  step. The two platforms carry the same components and expose the same variant
  dimensions. Every recipe-backed view calls its resolver rather than naming
  tokens itself, and the exemption list is derived from the emitted styles rather
  than hardcoded. Every value a resolver hands a view is read by it — carrying a
  value across and then ignoring it is the same loss as never carrying it, and
  quieter, because the generator reports success.
