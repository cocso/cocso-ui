# Project: Mobile

## Goal

Give SwiftUI and Jetpack Compose the same design system the web has, from the same source.

`@cocso-ui/css` publishes the token layer as CSS custom properties, which native platforms cannot read. Today a native app either hardcodes values or maintains its own copy that drifts — `cocso/mobile` did the latter, and its copy silently lost 55 of 59 colours the day the source grew a second theme mode, without failing.

The source of truth is already platform-neutral: `packages/baseframe-sources` is YAML, and since the dark theme moved into it, it carries both modes for every semantic colour. CSS is one artifact generated from it. This project adds two more.

## Path

- `ecosystem/baseframe/` — the generator. Already owns CSS emission from the same AST; gains Swift and Kotlin emitters.
- `packages/swiftui/` — *planned*. Swift package: `Sources/CocsoUI/`.
- `packages/compose/` — *planned*. Gradle module: `src/main/kotlin/ai/cocso/ui/`.

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
- Theme resolution that follows the platform's own mechanism — `ColorScheme` on SwiftUI, `isSystemInDarkTheme` on Compose — rather than a cocso-specific switch.
- A parity gate: the two platforms expose the same token names, and both match the CSS.

## Out of Scope

- **Views.** The style layer is generated; the SwiftUI `View` and the Compose `@Composable` that consume it are not, which mirrors the web's split between a recipe and its `.tsx`.
- **Components.** Deliberately later. `cocso/mobile` has fifteen (`CC*`) that work and are parity-checked; duplicating them before the token layer is settled would mean porting them twice.
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
pnpm --filter @cocso-ui/baseframe generate:mobile   # planned
pnpm --filter @cocso-ui/baseframe test
```

CI expectations:

- `golden.test.ts` compares every generated artifact to the sources, and fails when a published file and the YAML disagree. The mobile artifacts join the CSS ones there.
- A parity assertion: the Swift and Kotlin token sets are identical to each other and to the CSS. That is the check `cocso/mobile` did not have, and its absence is why 55 colours could go missing without anything failing.

## Roadmap

1. **Token layer, both themes.** This milestone.
2. Consumption in `cocso/mobile` — replace its hand-written `sync_tokens_from_cocso_ui.py` with this artifact, and delete the converter.
3. Components, if the case is made. Fifteen exist in `cocso/mobile` and are parity-checked by opencross; the question is whether they move here or stay there, and it does not have to be answered to ship tokens.

## Open Questions

- Where the generated files live once components arrive. `packages/swiftui/Sources/CocsoUI/` assumes a Swift package; if `cocso/mobile` consumes by path first, the package manifest can wait.
- Whether composite shadows get platform-specific semantic tokens (`shadow-card` as an iOS `.shadow` modifier and a Compose `Elevation`) or stay out. They are the one part of the CSS layer with no single-value equivalent.
- Whether opencross's parity harness should cover this repository too, or whether the CSS-side golden gate is the right home for a check that is about generated artifacts rather than about two platform implementations.
