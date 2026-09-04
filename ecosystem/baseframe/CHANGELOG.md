# @cocso-ui/baseframe

## 0.1.0

### Minor Changes

- cb5f977: Emit the design tokens for SwiftUI and Jetpack Compose.

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

## 0.0.7

### Patch Changes

- Updated dependencies [17504b4]
  - @cocso-ui/baseframe-sources@0.2.0

## 0.0.6

### Patch Changes

- 9919aaf: - 모달 컴포넌트의 Title, Description 크기를 변경합니다.
  - 모달 컴포넌트의 Close 버튼에 `asChild` 속성을 추가합니다.
  - 패키지 의존성 버전을 업데이트합니다.

## 0.0.5

### Patch Changes

- e9a3e0a: spacing 토큰을 추가합니다.

  Body, Heading, Display 컴포넌트를 Typography 컴포넌트와 연결합니다.

## 0.0.4

### Patch Changes

- b0e3f2a: 사용되지 않는 디자인 토큰을 제거합니다.
