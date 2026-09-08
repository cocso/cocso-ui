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

- **The recipes with no view yet.** Fifteen components exist, matched on both platforms. Every recipe has a generated style already; the four without a view (`link`, `pagination`, `breadcrumb`, `stock-quantity-status`) are web navigation and a domain badge, added if wanted rather than all at once.
- React Native. `@cocso-ui/react-native-icons` exists for icons; a full RN component layer is a separate decision.
- Shipping to package registries. The first consumer is in the same organisation and can consume by path or git ref; SPM and Maven publication waits until there is a second.
- Nothing from the token layer, any more. Alpha colours and composite shadows were excluded at first; both cross now (`overlay-*`, `surface-glass`; `Shadow.card` as layers). The one token still skipped is `$color.transparent`, which both platforms already have.

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
- `mobile-views.test.ts` covers the hand-written layer, which the generators cannot keep in step: the two platforms carry the same components, each exposes the same variant dimensions, and every recipe-backed view resolves its generated style rather than naming tokens itself. The exemption list is derived from the emitted styles and then checked against the five names expected to be in it (`CCTouchTarget`, `CCMotion`, `CCGlass`, `CCShadow`, `CCStrings` — primitives with no variant to resolve), so a resolver that stops being emitted fails rather than silently excusing its view. It also fails a view that animates without honouring reduced motion or with a literal duration, and one that speaks a literal string.

## Brands

The base `interactive-primary` is neutral-950 — the `primary-*` ramp aliases the
neutral ramp, so the design system itself carries no brand colour. cocso.co.kr
is blue (the info ramp), medicaldb-website is the base black, and both consume
this system. A brand is therefore a theme, not a change to the base.

`packages/baseframe-brands/<brand>/` holds a brand's overrides of semantic
tokens, in both modes. `generate:brand` builds each as its own AST — the colour
primitives plus the brand file, never the base semantic layer, because the
resolver keys tokens by name and two declarations of `$color.interactive.primary`
would make the last one win silently. It emits `theme-<brand>.css`
(`[data-brand="<brand>"]`, and `[data-brand][data-theme="dark"]` so the brand's
dark value outranks theme-dark.css) and `CocsoBrand<Brand>.swift` / `.kt` with
the same names as `CocsoTokens`, resolved per scheme.

The views read the brand, not the app. An overlay the views never read would
leave the app's own `interactivePrimary` blue while every design-system view
kept drawing the base black — two primaries on one screen. So for each themed
token a brand overrides, the base function takes a brand and delegates:

- SwiftUI: `CocsoTokens.Color.interactivePrimary(scheme, brand:)`, and every
  resolver's `resolve(..., scheme:, brand:)`. Views read
  `@Environment(\.cocsoBrand)` and pass it through; the app sets
  `.environment(\.cocsoBrand, .cocso)` once at its root.
- Compose: brand-aware tokens read `LocalCocsoBrand.current` themselves, so no
  call site changes; the app wraps its root in
  `CompositionLocalProvider(LocalCocsoBrand provides CocsoBrand.Cocso)`.

The `primary-*` ramp stays a constant in the base even though a brand overrides
it: no recipe reads a ramp directly, the semantic tokens carry the brand, and
turning a constant into a function would hide that the ramp is single-mode.

`brand.test.ts` asserts the overlay names every token against one the base has
(an override of nothing cannot ship), that exactly the base-themed tokens a
brand overrides gain a brand case on both platforms, and that a token no brand
touches gains none. The render tests on both platforms draw the primary button
under the cocso brand and read the fill back from pixels.

## Motion

The motion tokens cross as what they are. `CocsoTokens.Duration.*` is
`TimeInterval` seconds on Swift and `Int` milliseconds on Kotlin — the unit each
platform's animation API takes. It had been emitted as a length (`CGFloat`, and
`0.15.dp` on Compose), which nothing could use, so every view timed itself: the
spinner turned in `0.8`, the skeleton pulsed in `1000`, numbers that matched
nothing on the web. `CocsoTokens.Easing.*` is new: each CSS easing as its
control points, `Animation.timingCurve(…, duration:)` on Swift and
`CubicBezierEasing` on Kotlin. `mobile.test.ts` asserts every `--cocso-duration-*`
and `--cocso-easing-*` the CSS has is present on both platforms.

The views animate through `CCMotion`, four pairings that are the web's:

| | duration | easing | used for |
|---|---|---|---|
| `colour` | `fast` | `default` | pressed fills, borders, a dimmed control |
| `movement` | `fast` | `soft` | the switch thumb, the pressed scale |
| `fill` | `normal` | `soft` | the progress bar |
| `entrance` | `slow` | `entrance` | an error message, a checkbox glyph |

Every one is `nil` (SwiftUI) or `snap()` (Compose) under reduced motion —
`accessibilityReduceMotion`, and the animator duration scale at zero on
Android — because the web sets `transition: none` there and motion in every
view is decoration. The skeleton's pulse and wave and the spinner's turn read
`duration-decorative(-slow)` directly, the way the web's keyframes do; under
reduced motion the spinner pulses in place (the web's `spinner-reduced-pulse`)
and the skeleton holds still. `mobile-views.test.ts` fails a view that
animates without reading the setting, or that writes a duration as a number.

A pressed touchable also scales to `CCMotion.pressedScale` (0.97). The web has
no equivalent — a pointer does not press — so it is small enough to be felt
rather than seen.

## Glass

Glass is for the layers that float over content and stay put while it moves:
a tab bar, a navigation bar, a composer's buttons, a card over a photo. Three
tokens carry it, `surface-glass` (the tint: 80% white light, 60% black dark),
`surface-glass-active` (pressed: the pane thins to 60% / 40%) and
`border-glass` (the edge), chosen so `text-primary` on the pane clears AA over
any backdrop — a tab bar cannot choose its photo. The `card` and `button`
recipes have a `glass` variant on all three platforms; the web adds a 16px
`backdrop-filter`, SwiftUI puts `.ultraThinMaterial` under the tint.

`CCGlass` is the primitive the app-owned bars use: `ccGlass()` /
`Modifier.ccGlass()` for the surface, and `CCGlassBar(edge:)` for a bar with
the hairline on its inner edge. On SwiftUI place it with
`.safeAreaInset(edge: .bottom)` and the glass runs under the home indicator;
on Compose it pads for the system bar itself. The items are the app's — which
tabs there are is not a design-system decision — and this is the surface they
sit on.

Compose has no backdrop blur: `Modifier.blur` blurs a layer's own content, and
blurring what is behind a layer needs the app to draw that content into the
layer (a compositor pass — what the `haze` library does). An unblurred
translucent pane over a busy screen is mud, so on Android the tint sits on
`surface-primary` and glass reads as a solid of the same tone — iOS glass,
Android solid, one colour on both. That is the one visible difference between
the platforms and it is deliberate; it is also the pairing the platforms' own
apps have settled on.

## Shadows

`$shadow.*` are composite `box-shadow` lists, and the emitter refused them as
"no single-value equivalent" for as long as it existed — so the elevated card,
the variant whose whole meaning is its shadow, was a flat rectangle on both
platforms. They now cross as layers: `CocsoTokens.Shadow.card(scheme)` /
`CocsoTokens.Shadow.card()` return a list of `CocsoShadowLayer` (offset, blur,
spread, colour). They are themed even though the shadow tokens live in the
single-mode `global` collection, because the layers name `$color.alpha.shadow*`
and the dark theme deepens those; the emitter follows references embedded in a
composite in the mode being emitted, the way `var()` does in the CSS.

`CCShadow` draws them: SwiftUI applies each layer as a `.shadow` (blur halved —
a CSS blur is a diameter, SwiftUI's radius a sigma); Compose has one shadow per
node from an elevation, so `Modifier.ccShadow` collapses the layers to the
softest one. The elevated card and the switch thumb use them, as the web does.

## tokens.json

`packages/css/tokens.json` is the same resolution as data, published with
`@cocso-ui/css`: every token, `values` per mode (`light`/`dark`, or `default`),
each brand's override under `brands`, the CSS custom-property name and the
platform identifier, and `skipped` with reasons. `cocso/mobile` synced its
token layer by parsing `CocsoTokens.swift` with regular expressions and had to
follow every signature change; a consumer that is a program reads this instead.
`mobile.test.ts` holds the published file to the generator, checks every
`--cocso-*` in `token.css` appears, and that identifiers match the Swift.

## Strings

The views speak through `CCStrings` — `Localizable.strings` in the Swift
package (`Bundle.module`, en and ko) and `res/values/strings.xml` in the
Compose module (`values` and `values-ko`). Accessibility labels, values and
states ("On", "Off", "Mixed", "Close"), and the default label parameters
("Loading", "Progress", "Select") all come from there; a label the caller
passes is the caller's to localise. `mobile-views.test.ts` fails a view that
writes a literal into any of those places, and the Compose interaction test
runs one control under the `ko` qualifier and hears Korean.

## Interaction tests

`ComponentInteractionTest.kt` drives each control the way a finger does and
reads the callback and the semantics back: a button calls `onClick` and a
loading one does not; a checkbox and a switch toggle and announce on/off; a
radio selects exactly one; a select opens its menu and picks; a dialog's close
asks to dismiss. The render tests said the controls were drawn; nothing said
they worked. There is no SwiftUI counterpart — XCTest cannot tap a SwiftUI
view without a UI-test host, which `swift test` does not provide — so the iOS
views are covered by rendering and by their bindings' types.

## Roadmap

1. **Token layer, both themes.** This milestone.
2. **Consumption in `cocso/mobile`.** Done. Its converter reads `CocsoTokens.swift` — the generated, golden-tested artifact — rather than parsing the YAML and re-deriving identifiers, and its CI checks the sync. Dark mode is adopted without touching its 1,157 call sites (`UIColor(dynamicProvider:)` on iOS, a `@Composable` getter on Android). Its 22 app-only tokens sit in `design/tokens.local.json`; whether any belong here is a design question.

3. **Views.** Fifteen exist here, matched on both platforms, plus five primitives: `CCTouchTarget`, `CCMotion`, `CCGlass`, `CCShadow`, `CCStrings`. `CCButton` takes `prefix`/`suffix` icons as the web's does.

   The three added last — the ones an app reaches for first and had been drawing itself:
   - `CCDialogPanel` / `.ccDialog(isPresented:)` (SwiftUI) and `CCDialog` / `CCDialogPanel` (Compose): the web's scrim (`black-alpha-30`), `shadow-dialog`, and entrance on the entrance curve. Drawn in place on SwiftUI so it animates on the design system's curve; a `Dialog` window on Compose with its own dim turned off so the two scrims do not stack.
   - `CCSelect`: the web's `<select>` trigger — chosen title or `text-secondary` placeholder, selector glyph at the recipe's `iconRight`, `border-strong` at rest, `focus-ring` focused — opening the platform's menu (`Menu` / `DropdownMenu`).
   - `CCRadioGroup` / `CCRadio`: the file is `CCRadio` because the recipe is named `radio`. Ring recolours on the colour curve, the `text-on-primary` dot pops in on the entrance curve; `selectableGroup` / `.isSelected` for a screen reader.

   `cocso/mobile` consumes them by path — `.cocso-ui/packages/{swiftui,compose}`, a symlink locally and a checkout in CI — as an SPM path package and a Gradle composite build (the Compose module carries `group`/`version` for that). Its `CCButton` is now an adapter over ours: same name and API, so its 59 and 60 call sites did not change, and what a variant looks like is decided here. That took one addition on this side — `x-large` (56px, radius following size to 16), the height the app had drawn by hand — and it surfaced one defect on this side: the Compose button dimmed only its label when disabled, because `alpha` sat below `background`. A guard now holds that order.

   Next in the app: the four remaining overlapping components (Badge, Card, ProgressBar, TextField) the same way; the nine app-only ones (TabBar, NavBar, TopBar, Gallery, ListRow, FAB, ScreenHeader, EmptyState, Logo) stay theirs but read `CocsoTokens`/`CocsoStyles` — and the bars sit on `CCGlassBar`.

## Open Questions

- Where the generated files live once components arrive. `packages/swiftui/Sources/CocsoUI/` assumes a Swift package; if `cocso/mobile` consumes by path first, the package manifest can wait.
- Whether opencross's parity harness should cover this repository too, or whether the CSS-side golden gate is the right home for a check that is about generated artifacts rather than about two platform implementations.
