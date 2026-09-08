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

- Nothing from the recipe layer, any more: all nineteen recipes have a view on both platforms.
- React Native. `@cocso-ui/react-native-icons` exists for icons; a full RN component layer is a separate decision.
- Nothing about distribution, any more — see Publishing.
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
- The SwiftUI CI job also builds the iOS slice with `xcodebuild -destination 'generic/platform=iOS Simulator'`. `swift test` compiles macOS only, and an API present on one platform and not the other passed there and failed in the app.
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

Compose has no backdrop blur of its own, so the module uses Haze (1.5.x, the
line built against Compose 1.7): the app marks the content that scrolls beneath
with `Modifier.hazeSource(state)` and provides the same `HazeState` through
`LocalCocsoHazeState`; every glass surface — `ccGlass`, `CCGlassBar`, the glass
card and button — then blurs what is behind it at the web's 16dp (API 31+;
Haze draws a scrim below that). With no state provided, glass is the tint over
`surface-primary`, a solid of the same tone — which is what a screen that opts
out gets, and what the render tests draw, since Robolectric has no
`RenderEffect`.

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
they worked. `ComponentInteractionTests.swift` is the SwiftUI half: `swift
test` has no UI-test host, so ViewInspector (a test-only dependency) walks each
view's body and fires its `Button` the way a finger would — the same nine
scenarios, plus a check that the Korean string table is in the bundle.

## Publishing

One version for both packages: `VERSION_NAME` in
`packages/compose/gradle.properties`. The `Mobile Release` workflow runs on a
push to `main` that touches either package (or by hand); if no tag with that
version exists it publishes the Compose module to GitHub Packages and tags
`main` with the plain semver, which SwiftPM reads. A push that does not bump
the version is a no-op; a bump releases once. Bump it in the change that
alters what a package ships.

- SwiftUI: `.package(url: "https://github.com/cocso/cocso-ui", from: "1.0.0")`.
  The root `Package.swift` points at `packages/swiftui/Sources/CocsoUI` and
  carries no test target, so a consumer's graph holds only what ships —
  `packages/swiftui/Package.swift` (path consumption, tests, ViewInspector)
  stays for `cocso/mobile` and CI. The CI SwiftUI job builds both.
- Compose: `implementation("ai.cocso.ui:cocso-ui-compose:1.0.0")` from
  `maven { url = uri("https://maven.pkg.github.com/cocso/cocso-ui") }`. GitHub
  Packages needs a token with `read:packages` even for a public repository;
  the composite build by path remains for a consumer that would rather not.

## Roadmap

1. **Token layer, both themes.** This milestone.
2. **Consumption in `cocso/mobile`.** Done. Its converter reads `CocsoTokens.swift` — the generated, golden-tested artifact — rather than parsing the YAML and re-deriving identifiers, and its CI checks the sync. Dark mode is adopted without touching its 1,157 call sites (`UIColor(dynamicProvider:)` on iOS, a `@Composable` getter on Android). Its 22 app-only tokens sit in `design/tokens.local.json`; whether any belong here is a design question.

3. **Views.** All nineteen recipes have one, matched on both platforms, plus five primitives: `CCTouchTarget`, `CCMotion`, `CCGlass`, `CCShadow`, `CCStrings`. `CCButton` takes `prefix`/`suffix` icons as the web's does. The last four — `CCLink`, `CCBreadcrumb`, `CCPagination` (the web's truncation, pinned by a test on both platforms), `CCStockQuantityStatus` (the web's glyph from the same SVG path data, parsed on each platform) — are web navigation and a domain badge.

   The three added last — the ones an app reaches for first and had been drawing itself:
   - `CCDialogPanel` / `.ccDialog(isPresented:)` (SwiftUI) and `CCDialog` / `CCDialogPanel` (Compose): the web's scrim (`black-alpha-30`), `shadow-dialog`, and entrance on the entrance curve. Drawn in place on SwiftUI so it animates on the design system's curve; a `Dialog` window on Compose with its own dim turned off so the two scrims do not stack.
   - `CCSelect`: the web's `<select>` trigger — chosen title or `text-secondary` placeholder, selector glyph at the recipe's `iconRight`, `border-strong` at rest, `focus-ring` focused — opening the platform's menu (`Menu` / `DropdownMenu`).
   - `CCRadioGroup` / `CCRadio`: the file is `CCRadio` because the recipe is named `radio`. The web's radio — the page's fill, a 2px ring that takes `checkedColor` when selected, a `checkedColor` dot popping in on the entrance curve; `selectableGroup` / `.isSelected` for a screen reader. The recipe's `selected` values had filled the whole circle, which the web never read; they now say what the web draws.

   API parity with the web's props, beyond the variant dimensions the parity test checks: `CCInput(description:)`, `CCSwitch(labelPosition:)` (the web's `position`), `CCAlert(icon:onClose:)`, `CCButton(prefix:suffix:)`, and `CCAvatar(image:)` on both platforms.

   `cocso/mobile` consumes them by path — `.cocso-ui/packages/{swiftui,compose}`, a symlink locally and a checkout in CI — as an SPM path package and a Gradle composite build (the Compose module carries `group`/`version` for that). Its `CCButton` is now an adapter over ours: same name and API, so its 59 and 60 call sites did not change, and what a variant looks like is decided here. That took one addition on this side — `x-large` (56px, radius following size to 16), the height the app had drawn by hand — and it surfaced one defect on this side: the Compose button dimmed only its label when disabled, because `alpha` sat below `background`. A guard now holds that order.

   Next in the app: the four remaining overlapping components (Badge, Card, ProgressBar, TextField) the same way; the nine app-only ones (TabBar, NavBar, TopBar, Gallery, ListRow, FAB, ScreenHeader, EmptyState, Logo) stay theirs but read `CocsoTokens`/`CocsoStyles` — and the bars sit on `CCGlassBar`.

## Open Questions

- Test-only dependencies leak into consumers. `ViewInspector` is a
  `testTarget` dependency, but Xcode's SPM integration resolves a path
  package's whole graph, so `cocso/mobile`'s build fetches it too (seen in its
  `workspace-state.json`). Harmless today — its CI already reaches GitHub for
  `swift-snapshot-testing` — but the next heavy test dependency ties the app's
  iOS build to that repository's availability. When one arrives, move the view
  tests to their own package (`packages/swiftui-tests`) that depends on
  `CocsoUI`, so the shipped package's graph holds only what it ships.

- Where the generated files live once components arrive. `packages/swiftui/Sources/CocsoUI/` assumes a Swift package; if `cocso/mobile` consumes by path first, the package manifest can wait.
- Whether opencross's parity harness should cover this repository too, or whether the CSS-side golden gate is the right home for a check that is about generated artifacts rather than about two platform implementations.
