# Project: Mobile

## Goal

Give SwiftUI and Jetpack Compose the same design system the web has, from the same source.

`@cocso-ui/css` publishes the token layer as CSS custom properties, which native platforms cannot read. Today a native app either hardcodes values or maintains its own copy that drifts — `cocso/mobile` did the latter, and its copy silently lost 55 of 59 colours the day the source grew a second theme mode, without failing.

The source of truth is already platform-neutral: `packages/baseframe-sources` is YAML, and since the dark theme moved into it, it carries both modes for every semantic colour. CSS is one artifact generated from it. This project adds two more.

## Path

- `ecosystem/baseframe/` — the generator. Already owns CSS emission from the same AST; gains Swift and Kotlin emitters.
- `packages/swiftui/` — Swift package: `Sources/CocsoUI/`.
- `packages/compose/` — Gradle module: `src/main/kotlin/ai/cocso/ui/`.

## Runtime and Language

- iOS: Swift 5.9+, SwiftUI, iOS 16.0 minimum.
- Android: Kotlin 2.0+, Jetpack Compose, API 26 minimum.
- Generator: TypeScript on Node.js 22, inside `@cocso-ui/baseframe`.

Both minimums match `cocso/mobile`, the first consumer, so nothing this emits is unreachable there.

## Users

- Native app teams inside cocso, starting with `cocso/mobile`.
- Designers, indirectly: the Figma token export and the mobile artifacts come from one source, so a token decided once reaches all three.

## In Scope

- **Design tokens for both platforms**, carrying both themes. Colour, spacing, radius, typography, motion.
- **Generated style resolvers** for every recipe, so a variant added on the web reaches both platforms without anyone re-typing it.
- **Views**, hand-written, consuming those resolvers — the same split the web has between a recipe and its `.tsx`. A view decides structure and behaviour; it never decides what a variant looks like.
- Theme resolution that follows the platform's own mechanism — `ColorScheme` on SwiftUI, `isSystemInDarkTheme` on Compose — rather than a cocso-specific switch.
- A parity gate: the two platforms expose the same token names, and both match the CSS.

## Out of Scope

- **The recipes with no view yet.** Twelve components exist, matched on both platforms. Every recipe has a generated style already; what the rest still need is a view, and those are added as they are wanted rather than all at once.
- React Native. `@cocso-ui/react-native-icons` exists for icons; a full RN component layer is a separate decision.
- Shipping to package registries. The first consumer is in the same organisation and can consume by path or git ref; SPM and Maven publication waits until there is a second.
- Alpha colours and composite shadows. The CSS carries `rgba()` scrims and multi-layer shadows that have no single-value equivalent on either platform. They are excluded and named, not silently dropped.

## Architecture

```
packages/baseframe-sources/     YAML, single source of truth
  primitive/*.yaml              collection: global, mode: default
  semantic/color.yaml           collection: theme,  modes: light, dark
        │
        ▼
ecosystem/baseframe/            one validated AST, three emitters
  src/core/builders/css-vars    → token.css, theme-dark.css
  src/core/builders/tailwind    → tailwind4.css
  src/core/builders/mobile      → CocsoTokens.swift / .kt

packages/recipe/                variant → token, platform-neutral
        │
        ▼
ecosystem/codegen/
  src/mobile-recipes            → CocsoStyles.swift / .kt
        │
        ▼
packages/swiftui/  packages/compose/
```

Emitting from the same AST is the point. The AST is validated — a token missing a value for a mode its collection declares is rejected — so the mobile artifacts inherit that guarantee rather than reimplementing it. A hand-written converter reading the YAML directly is what drifted in `cocso/mobile`.

## Interfaces

Token names are the contract, and they are the same three ways:

| CSS | Swift | Kotlin |
|---|---|---|
| `--cocso-color-text-primary` | `CocsoTokens.Color.textPrimary` | `CocsoTokens.Color.textPrimary` |
| `--cocso-spacing-4` | `CocsoTokens.Spacing.s4` | `CocsoTokens.Spacing.s4` |
| `--cocso-radius-3` | `CocsoTokens.Radius.r3` | `CocsoTokens.Radius.r3` |

Naming rules, applied by the generator rather than by hand:

- `kebab-case` → `camelCase`. `text.on-primary` → `textOnPrimary`.
- A name starting with a digit takes its scale letter. `spacing.4` → `s4`, `radius.3` → `r3`.
- Theme-dependent colours resolve at read time from the platform's colour scheme; single-mode tokens are plain constants.

## Storage

None. Everything is generated at build time and committed, the way `token.css` is.

## Security

None specific. No secrets, no network, no user data. The generator reads YAML from this repository and writes source files into it.

## Logging

The generator prints what it wrote and what it excluded, with the reason — the same shape `generate:css` uses. Silent exclusion is the failure this project exists to stop.

## Build and Test

```bash
pnpm --filter @cocso-ui/baseframe generate:mobile
pnpm --filter @cocso-ui/codegen generate:mobile-styles
pnpm --filter @cocso-ui/baseframe test
pnpm --filter @cocso-ui/codegen test
(cd packages/swiftui && swift build)
(cd packages/compose && ./gradlew :compileDebugKotlin)
```

CI expectations:

- `golden.test.ts` compares every generated artifact to the sources, and fails when a published file and the YAML disagree. The mobile artifacts join the CSS ones there.
- A parity assertion: the Swift and Kotlin token sets are identical to each other and to the CSS. That is the check `cocso/mobile` did not have, and its absence is why 55 colours could go missing without anything failing.
- `mobile-views.test.ts` covers the hand-written layer, which the generators cannot keep in step: the two platforms carry the same components, each exposes the same variant dimensions, and every recipe-backed view resolves its generated style rather than naming tokens itself. The exemption list is derived from the emitted styles and then checked against the one name expected to be in it, so a resolver that stops being emitted fails rather than silently excusing its view.

## Roadmap

1. **Token layer, both themes.** This milestone.
2. **Consumption in `cocso/mobile`.** Done for values and names: its converter now reads `CocsoTokens.swift` — the generated, golden-tested artifact — instead of parsing the YAML and re-deriving identifiers, which is what let the same token hold two names (`rFull` here, `full` there) and what silently dropped 55 colours when the source grew a second mode. Its CI checks the sync, so that drift now fails a build.

   Not done, and a separate decision: the app is light-only, and its 1,157 call sites take a constant rather than passing a colour scheme. Adopting dark mode there is a change to the app, not to this pipeline. Its 22 app-only tokens — brand colours and a type scale — sit in `design/tokens.local.json`; whether any belong in the design system is a design question, not a migration one.
3. **Views.** Twelve are done — button, badge, card, alert, typography, avatar, skeleton, progress, spinner, checkbox, switch, input — plus the `CCTouchTarget` primitive. The rest follow as they are wanted; `cocso/mobile`'s `CC*` set is the source of what to build and in what order, and what it should be replaced by, since theirs pick colours per variant by hand.

## Open Questions

- Where the generated files live once components arrive. `packages/swiftui/Sources/CocsoUI/` assumes a Swift package; if `cocso/mobile` consumes by path first, the package manifest can wait.
- Whether composite shadows get platform-specific semantic tokens (`shadow-card` as an iOS `.shadow` modifier and a Compose `Elevation`) or stay out. They are the one part of the CSS layer with no single-value equivalent.
- Whether opencross's parity harness should cover this repository too, or whether the CSS-side golden gate is the right home for a check that is about generated artifacts rather than about two platform implementations.
