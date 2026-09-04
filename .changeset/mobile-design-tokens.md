---
"@cocso-ui/baseframe": minor
---

Emit the design tokens for SwiftUI and Jetpack Compose.

`pnpm --filter @cocso-ui/baseframe generate:mobile` writes
`packages/swiftui/Sources/CocsoUI/CocsoTokens.swift` and
`packages/compose/src/main/kotlin/ai/cocso/ui/CocsoTokens.kt` from
`packages/baseframe-sources` — the same validated AST the CSS comes from, so
the three platforms cannot disagree about what a token is.

Neither platform can read a CSS variable, so these carry values rather than
references: every `var()` chain is resolved, once per theme mode. A semantic
colour becomes a function of the platform's colour scheme
(`CocsoTokens.Color.textPrimary(scheme)` on SwiftUI,
`CocsoTokens.Color.textPrimary()` on Compose); a raw ramp entry stays a
constant, which is what keeps an app's ramp override intact in both themes.

Fourteen tokens are not emitted, each named with its reason — composite
shadows, easing curves, and `transparent`, none of which has a single-value
equivalent. Translucent colours are emitted with their alpha.
