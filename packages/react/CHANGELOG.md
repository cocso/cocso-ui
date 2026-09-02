# @cocso-ui/react

## 1.1.6

### Patch Changes

- 144c7f0: Fail if a component or CSS Module lands where the component guards do not look.

  `module-css-tokens`, `module-css-contrast` and `component-tsx-colors` all scan
  `src/components`. Inside it they widen on their own; outside it they see
  nothing, and nothing said so. Nothing lives outside it today — this asserts
  that rather than assuming it, because the day something does is the day all
  three go quiet at once.

  No runtime change.

## 1.1.5

### Patch Changes

- 3248bbc: Paint StockQuantityStatus with the text-level status tokens.

  All three states used the `feedback-*` base — the fill level, which clears AA
  on white by under 0.1 and misses it everywhere else: 4.17–4.19 on a card and
  3.70–3.72 on `interactive-primary-subtle`. They now use `feedback-*-text`,
  which clears every surface in both themes. `Link` moves with them via
  `interactive-info-text`.

  With this, no recipe in either theme paints text below AA on any surface,
  `text-disabled` aside, which WCAG 1.4.3 exempts.

- 30e8738: Enforce the "no body text in `text-tertiary`" rule per use rather than per
  token.

  `module-css-contrast.test.ts` exempted `text-tertiary` and `text-muted`
  outright, which turned the rule off inside the check meant to enforce it: they
  are exempt precisely because they miss AA everywhere, so nothing stopped a new
  component painting body text with one. The two existing uses — the breadcrumb
  separator glyph and the Select chevron — are non-text graphics and stay exempt
  by name. Any new use has to justify itself.

  No runtime change.

- Updated dependencies [3248bbc]
  - @cocso-ui/css@1.5.0

## 1.1.4

### Patch Changes

- 739aefd: Stop StockQuantityStatus drawing a light grey track in the dark theme.

  Its indicator wrote `fill="#D9D9D9"` into the SVG six times — the unfilled part
  of the capsule, which resolved to `#dfdfdf` and stayed there when the theme
  flipped, leaving a bright track behind the status colour on a dark surface. It
  now reads `surface-neutral` from the CSS Module, within a shade of the old
  light value and correctly dark in the dark theme.

  Adds a guard so this class of defect stops reaching components: a component's
  `.tsx` may name a semantic token and nothing else — no raw ramp entry from
  `colors`, no colour literal, in an inline style or an SVG attribute. Checkbox,
  Switch and StockQuantityStatus had each done it, and all three were found by
  eye.

## 1.1.3

### Patch Changes

- 0d348ee: Make the documented override path reachable, and fix three foregrounds it hid.

  Generated variant rules carried two classes — `.cocso-button.cocso-button--variant-outline`,
  specificity (0,2,0) — while the `--cocso-<component>-<property>` custom
  properties they define are what the Component Override Contract points
  consumers at. A consumer's single class is (0,1,0) and lost, so the documented
  entry point required `!important`; and because a module paints its base and
  hover states with two separate `background-color` declarations, an `!important`
  fill also deleted the hover state. Modifier classes are now wrapped in
  `:where()`, so every generated rule sits at the component class's specificity
  and a single consumer class wins with no `!important` and no collateral loss.

  Auditing the CSS Modules — which no contrast check had ever looked at — turned
  up three foregrounds:

  - `Field` painted validation messages with `feedback-danger`, the fill level,
    at 4.18:1 on `surface-secondary` in the light theme. Now `feedback-danger-text`.
  - `DayPicker` and `MonthPicker` used `surface-primary` as the foreground on an
    `interactive-primary` fill. Correct in the stock themes by coincidence, but
    the pair a consumer rebrands is `interactive-primary`/`text-on-primary`, so a
    rebranded fill left the foreground tracking the page — 3.23:1 in the dark
    theme against a blue fill, where `text-on-primary` is 5.70:1.

## 1.1.2

### Patch Changes

- b766293: Fix Link disappearing on hover in the dark theme.

  Link painted its text with `interactive-info` and its hover state with
  `interactive-info-active`. Both are fill tokens the dark theme leaves alone by
  design, and as text on the dark `surface-primary` they measured 4.05:1 and
  1.74:1 — hovering a link nearly erased it. It now uses
  `interactive-info-text`/`-text-hover`, which flip: 8.35:1 and 11.49:1 in the
  dark theme, with the light theme's rendering unchanged.

  The contrast test that exists to catch this covered six of nineteen recipes and
  did not include Link. It now covers all nineteen.

- Updated dependencies [b766293]
  - @cocso-ui/css@1.4.0

## 1.1.1

### Patch Changes

- 1287ce0: Fix three colors that kept their light-theme value when the theme flipped.

  **Checkbox** pinned its glyph to `colors.white` in an inline style while its
  fill is `interactive-primary`, which the dark theme flips to `primary-50`. That
  is a white check on a near-white box — 1.09:1, so a checked box and an
  unchecked one looked the same. It now uses `text-on-primary`, which is white in
  the light theme (nothing moves there) and `neutral-950` in the dark one
  (16.89:1). Because the value was inline, a consumer could not override it from
  CSS.

  **Switch** pinned its unchecked track to `colors.neutral100`, a raw ramp value,
  so the track stayed bright on a dark page. It now uses `surface-neutral`, which
  is `neutral-100` in the light theme and `neutral-800` in the dark one.

  **StockQuantityStatus** painted its `normal` state with
  `feedback-success-muted`, which is `success-400` and 3.09:1 on white — below AA
  for body-size text in the _light_ theme. It now uses `feedback-success`:
  4.57:1 in light, 5.96:1 in dark.

  `colors` gains `textOnPrimary` and `surfaceNeutral`, the two semantic tokens
  these fixes needed.

- Updated dependencies [1287ce0]
- Updated dependencies [1287ce0]
  - @cocso-ui/css@1.3.0

## 1.1.0

### Minor Changes

- 947e154: Make selection and focus colors themable, and add the Button/Badge/Typography variants that consumers were reproducing with `!important` utilities.

  **RadioGroup / Checkbox — tokens now actually reach the component**

  `RadioGroup.Item`, `RadioGroup.Indicator`, and the Checkbox focus ring hardcoded `--cocso-color-primary-950` inside CSS Modules, so a `--cocso-color-primary-*` override in a consumer `:root` did not reach them. The values now come from component-scoped custom properties emitted by the recipe:

  - `--cocso-radio-checked-color`, `--cocso-radio-border-color`, `--cocso-radio-bg-color`, `--cocso-radio-focus-ring-color`
  - `--cocso-checkbox-focus-ring-color`

  Both components also expose stable override hooks per the Component Override Contract: `data-cocso-component="radio-item"`, `"radio-indicator"`, `"checkbox"`, `"checkbox-control"`. Consumers matching content-hashed class names (`[class*='radio-group-module_item']`) can drop those selectors.

  Button, Link, Switch, and Pagination focus outlines now read `--cocso-color-focus-ring` instead of `--cocso-color-primary-950`. Same value in the light theme; the dark theme now gets a visible ring.

  **Button**

  - New `variant="neutral"` — filled neutral surface for quiet actions.
  - New `variant="error-ghost"` — destructive text/ghost action (transparent fill, danger text, tinted hover).
  - New `shape="sharp"` — square corners for menu rows and list items.
  - New `align` prop (`"center" | "start" | "between"`, default `"center"`) controlling label alignment.

  **Badge**

  - New `variant="primary-subtle"` — tinted background with primary-toned text, for lists where the filled primary badge is too loud.

  **Typography**

  - New `level` prop on `type="heading"` (`1`–`6`, default `2`) that selects the rendered `h1`–`h6` independently of the visual `size`, replacing `render={<h1>{title}</h1>}` for the common case.
  - `type="heading"` now accepts any size from the font scale in addition to the named steps, so `size={18}` is a heading rather than a reason to fall back to `type="custom"`. The named steps are unchanged. The scale has no section-heading step — `small` is 16, the same size as `body` `medium` — so consumers were reaching for `type="custom" size={18} weight="bold"`, which renders a `<p>` and drops the text out of the document outline.
  - Documented that Typography sets no colour of its own: without `color`, every mode inherits from the nearest ancestor that sets one. A consumer adding a dark theme found hardcoded ancestor colours surviving the switch at 1.14:1.

  **Tokens (`@cocso-ui/css`)**

  Added semantic tokens with light and dark values: `interactive-primary-subtle`, `interactive-primary-text`, `interactive-neutral`, `interactive-neutral-hover`, `interactive-neutral-active`, `interactive-danger-subtle-hover`, `interactive-danger-subtle-active`.

  The `--cocso-color-primary-*` ramp keeps its default alias to `neutral-*` — this release documents it as the supported theming entry point rather than changing it.

  **Floating positioner override hooks**

  `Dropdown`, `Popover`, and `Tooltip` now set `data-cocso-component="dropdown-positioner"`, `"popover-positioner"`, and `"tooltip-positioner"` on their `Positioner`. The positioner owns the stacking context, so a `z-index` on the popup alone is ignored — previously the only way to escape the z-index scale was matching a content-hashed class name (`[class*='_positioner__']`).

### Patch Changes

- 1f0ba5c: Fix text that ships below WCAG AA.

  **Dark theme**

  `text-on-primary` and `text-primary` are redefined by the dark theme, because `interactive-primary` is. The status fills are not — `interactive-success`, `-danger`, `-info`, and `-warning` keep their hue in both themes — so pairing a foreground that flips with a fill that does not put a near-white label on bright amber. `Button variant="warning"` rendered at **1.67:1** in dark mode; `success`, `error`, and `info` sat at ~4.0:1, and `Avatar` initials at 3.92:1.

  Fixed-hue fills now have foregrounds that do not flip: new `--cocso-color-text-on-success`, `-danger`, `-info` (white) and `-warning` (`neutral-950`), defined identically in both themes. `Avatar` initials move to `text-primary`.

  **Interactive states**

  A state that darkens a fill without moving its label walks the pairing toward the threshold. `Button` `secondary` crossed AA on hover (3.92:1 in dark) and when pressed (4.10:1 in light), so its label now steps to `text-primary` for both. `Button` `warning`'s pressed fill stops at the hover step: `interactive-warning-active` under the dark label is 3.96:1 and the amber ramp has no darker step that keeps the label readable.

  **Light theme**

  - `Field` rendered the "optional" marker in `text-tertiary` — 12px text at 3.08:1 on white, 2.82:1 on `surface-secondary`. Now `text-secondary`.
  - `Breadcrumb` rendered crumbs in `text-muted` — 4.09:1 on the dark theme's surface and 4.13:1 on the light theme's `surface-secondary`, at 12/14/16px. Now `text-secondary`.
  - `Breadcrumb` hardcoded `neutral-950` for the current crumb. That is the dark theme's own background colour, so the current page rendered at 1.0:1 and was invisible in dark mode. Now `text-primary`, which resolves to the same value in the light theme. Its separator moves off a hardcoded `neutral-300` to `text-tertiary` so it follows the theme, rendering slightly darker in the light theme.

  **Tokens keep their values**

  `text-tertiary` and `text-muted` are unchanged. Remapping them does not reach AA — the neutral ramp has no step that clears 4.5:1 in both themes without collapsing into `text-secondary` — so `docs/project-css.md` documents what each tier may carry, and a genuine third text tier is recorded as a ramp change on the roadmap.

  A test resolves every recipe pairing of a fill and a foreground through both themes and asserts AA, so these cannot come back silently.

  **`colors` export**

  The `colors` map was documented as "keyed by semantic name", which is only true of part of it: it mixes semantic tokens the dark theme redefines (`colors.textSecondary`) with raw ramp values it deliberately does not (`colors.primary600`), under one flat namespace. A consumer adding a dark theme found ramp values passed as text colours sitting at 2.7–3.1:1 against the flipped surface. Documented, no behaviour change.

- 16d0d73: Make component surfaces follow the theme.

  `theme-dark.css` redefines the semantic layer and deliberately leaves the raw scale alone, so a primitive color written into a CSS Module keeps its value when the theme flips. Six components did that, and two of them broke outright in the dark theme:

  - **`Dialog`** painted its panel `--cocso-color-white` with a `neutral-100` border. The panel stayed white on a dark page while its text followed the theme to near-white, leaving the content unreadable.
  - **`Switch`** painted its knob `--cocso-color-white`. The dark theme's checked track is near-white, so the knob sat at **1.09:1** and disappeared when the switch was on. It now uses `text-on-primary` — the foreground that belongs on a fill — which is 18.43:1 in light and 16.89:1 in dark.
  - **`Input`**, **`Select`**, and **`InputTrigger`** painted a white field background, a `neutral-950` value, `neutral-100` and `danger-500` rings and a `neutral-50` read-only fill.
  - **`Pagination`** hardcoded the active page's white label on a `primary-950` fill, overriding what its own recipe already declared semantically, plus `neutral-50`/`neutral-100` hover and pressed fills.
  - **`DayPicker`** hardcoded `info-600` and `danger-600`.

  Every one moves to the semantic token that resolves to the same value in the light theme, so light rendering is unchanged.

  Two placeholders were also below WCAG AA in the light theme: `Input` and `InputTrigger` rendered placeholder text in `neutral-400`, which is 3.08:1 on white. Both now use `text-secondary` (6.30:1 light, 5.98:1 dark).

  New `--cocso-color-border-strong` carries the field focus ring, which had no semantic token at its value. It is `neutral-400` in the light theme and `neutral-500` in the dark one — `neutral-600` would be 2.93:1 against the dark surface, under the 3:1 WCAG 1.4.11 asks of a focus indicator.

  A test now scans every CSS Module for primitive colors — no exceptions — so this class of defect cannot be reintroduced silently.

- Updated dependencies [1f0ba5c]
- Updated dependencies [947e154]
- Updated dependencies [16d0d73]
  - @cocso-ui/css@1.2.0

## 1.0.2

### Patch Changes

- 17504b4: Add a dedicated floating layer to the z-index scale so popups always render above modals.

  - Add `popover` (300) and `tooltip` (400) z-index tokens, above `dialog` (200).
  - Dropdown and Popover positioners now use `--cocso-z-index-popover`; Tooltip uses `--cocso-z-index-tooltip`. DayPicker/MonthPicker inherit the dropdown layer.
  - Fixes tooltips and dropdowns (incl. DayPicker/MonthPicker) being hidden behind dialog content when opened inside a Dialog.
  - Remove the redundant `z-index` on the Dropdown popup; the layer belongs on the Positioner per the floating component contract.

- Updated dependencies [17504b4]
  - @cocso-ui/css@1.1.0

## 1.0.1

### Patch Changes

- 65512ff: Fix `Dropdown` / `Popover` stacking and add positioning props.

  - Move the overlay `z-index` onto the floating `Positioner` (the element that
    owns the stacking context via its `transform`). Previously `z-index` lived on
    the inner popup, so a `position: fixed` sidebar could render on top of an open
    `Dropdown` and the popup could appear transparent.
  - `Dropdown.Content` now forwards `side`, `sideOffset`, `align`, `alignOffset`,
    and `arrowPadding` to its positioner, matching `Popover.Content`. Per-instance
    placement no longer needs global CSS overrides.

- a0d80ac: Add `InputTrigger` — a native `<button>` styled to look like an `Input`. Use it
  as the trigger for `Dropdown`, `DayPicker`, `MonthPicker`, etc. Because it is a
  real button, it avoids Base UI's `nativeButton` warning that fires when a plain
  `Input` is used as a trigger, while still presenting an input-like surface with
  a value/placeholder and optional `prefix`/`suffix` affix icons.
- df7317e: `Pagination` now accepts a `locale` prop (`"en" | "ko"`, default `"en"`) that
  supplies built-in accessible labels, so Korean apps no longer need to pass a
  full `labels` object on every instance. The `labels` prop still overrides
  individual strings.
- 0534c93: Add stable `data-cocso-component` attributes to themable surfaces (`Dropdown`,
  `Popover`, `Dialog`, `Tooltip`, `Select`, `Input`, `InputTrigger`) so global CSS
  overrides can target them without depending on content-hashed CSS Module class
  names. Also move the `Tooltip` overlay `z-index` onto its positioner, fixing the
  same stacking-context issue addressed for `Dropdown`/`Popover`.
- 4f3c468: Expose first-class prop types so consumers no longer need to import from
  `@base-ui/react`:

  - `Tab` now exports `TabProps`, `TabListProps`, `TabTriggerProps`, and
    `TabContentProps`.
  - A `RenderProp` type alias is re-exported from the package root for typing the
    `render` prop of polymorphic components (`Button`, `Link`, `Typography`).

- Updated dependencies [b108361]
  - @cocso-ui/css@1.0.1

## 1.0.0

### Major Changes

- 0ee7777: BREAKING: first stable v1 release.

  - Component primitives migrated from `@radix-ui/*` to `@base-ui/react`.
  - `Modal` removed and replaced by `Dialog`.
  - Design tokens rebased via `@cocso-ui/css@1` (primary now derives from neutral;
    `--ds-*` custom properties renamed to `--cocso-*`).
  - New components: alert, avatar, breadcrumb, card, field, input, progress,
    skeleton, tooltip.

  Migration:

  - Replace `Modal` imports/usages with `Dialog`.
  - Upgrade `@cocso-ui/css` and `@cocso-ui/react-icons` to v1 together with this
    package; mixing with 0.2.x is not supported.
  - Update any custom CSS referencing `--ds-*` tokens to `--cocso-*`.

### Patch Changes

- Updated dependencies [0ee7777]
- Updated dependencies [0ee7777]
  - @cocso-ui/css@1.0.0
  - @cocso-ui/react-icons@1.0.0

## 0.2.21

### Patch Changes

- Updated dependencies [6e35752]
  - @cocso-ui/react-icons@0.2.0

## 0.2.20

### Patch Changes

- 71725f6: - Badge 컴포넌트의 패딩값을 조정합니다.

## 0.2.19

### Patch Changes

- 9919aaf: - 모달 컴포넌트의 Title, Description 크기를 변경합니다.
  - 모달 컴포넌트의 Close 버튼에 `asChild` 속성을 추가합니다.
  - 패키지 의존성 버전을 업데이트합니다.
- Updated dependencies [9919aaf]
  - @cocso-ui/react-icons@0.1.6

## 0.2.18

### Patch Changes

- 13a2052: - `RadioGroup` 컴포넌트를 추가합니다.
  - `MonthPicker`, `DayPicker`에서 발생하던 Arrow Rotate 문제를 해결합니다.
  - `Pagination` 컴포넌트 버튼에 scale transform을 추가합니다.
- Updated dependencies [13a2052]
  - @cocso-ui/react-icons@0.1.5

## 0.2.17

### Patch Changes

- 5cc3012: - 버튼 컴포넌트가 Active 상태일 때 Scale이 0.98로 축소되는 애니메이션 효과를 추가합니다.
- `textSecondary` 색상을 약간 더 어둡게 조정해 가독성을 향상합니다. (`neutral-500` → `neutral-600`)

## 0.2.16

### Patch Changes

- 795bdef: `Checkbox` 컴포넌트의 아이콘 svg 스타일이 적용되지 않는 오류를 해결합니다.

## 0.2.15

### Patch Changes

- fb03cd2: `Checkbox` 컴포넌트의 토큰 오류를 수정합니다.

## 0.2.14

### Patch Changes

- 05928a1: DayPicker 컴포넌트에 day disabled 속성을 추가합니다.

## 0.2.13

### Patch Changes

- 135a868: `react-datepicker` 기반으로 Date Picker, Month Picker 컴포넌트를 개선합니다.

## 0.2.12

### Patch Changes

- f951318: Modal 컴포넌트의 `z-index`가 적용되지 않는 문제를 해결합니다.

## 0.2.11

### Patch Changes

- 875f462: MonthPicker 컴포넌트를 추가합니다.

## 0.2.10

### Patch Changes

- 9da5132: Switch 컴포넌트의 size 옵션을 sm, md로 변경합니다.

## 0.2.9

### Patch Changes

- 34cc4ab: Pagination 컴포넌트의 크기, 텍스트 토큰을 변경합니다.

## 0.2.8

### Patch Changes

- f1a14c8: README.md 파일을 업데이트 합니다.

## 0.2.7

### Patch Changes

- 01b6aac: Select 컴포넌트에 `stretch` prop을 추가하여 전체 너비(`width: 100%`) 설정을 지원합니다.
- 01b6aac: Select 컴포넌트의 `disabled` 상태 관리를 Button 컴포넌트와 동일한 패턴으로 `cx`를 통해 클래스 기반으로 변경합니다.

## 0.2.6

### Patch Changes

- 01b6aac: select 컴포넌트의 classname 값을 wrapper와 병합합니다.

## 0.2.5

### Patch Changes

- f622205: 버튼 컴포넌트에서 prefix, suffix를 포함하는 패딩 값을 수정합니다.

## 0.2.4

### Patch Changes

- 45e5e49: 버튼 컴포넌트 개선: `xs` 사이즈 버튼의 내부 콘텐츠 패딩을 제거하고, 가로 패딩을 2px에서 6px로 조정합니다. 또한, 모든 버튼 사이즈에서 prefix/suffix 요소의 `min-width` 속성을 제거합니다.

## 0.2.3

### Patch Changes

- 9113f15: Popover 컴포넌트의 디자인 토큰을 최신 명명 규칙에 맞게 업데이트하고, 그림자 스타일을 조정합니다.

## 0.2.2

### Patch Changes

- 0453d0d: 일부(Spinner) 컴포넌트의 토큰 값을 변경합니다.
- c385ce1: Badge 컴포넌트 추가

## 0.2.1

### Patch Changes

- 52672d5: 모달에 사용된 디자인 토큰을 변경합니다.

## 0.2.0

### Minor Changes

- 1e77fb6: 텍스트 색상 토큰을 추가합니다.

  버튼 컴포넌트 xs의 사이즈 토큰을 변경합니다.

  Settler 페이지에서 사용되는 `react-icons`을 추가합니다.

### Patch Changes

- Updated dependencies [1e77fb6]
  - @cocso-ui/react-icons@0.1.0

## 0.1.13

### Patch Changes

- 4b884b6: SettingsBackupRestore, SupervisedUserCircle, OutpatientMed, Medication 아이콘을 추가합니다.

  `react-icons` 패키지 빌드 전 `index.tsx` 생성 스크립트를 추가합니다.

- Updated dependencies [4b884b6]
  - @cocso-ui/react-icons@0.0.16

## 0.1.12

### Patch Changes

- 17387b0: `@cocso-ui/react` 패키지에 스타일 export 옵션을 추가합니다.
- Updated dependencies [17387b0]
  - @cocso-ui/react-icons@0.0.15

## 0.1.11

### Patch Changes

- 79e9f6d: 번들 툴링을 Rollup 기반으로 변경합니다.
- e9a3e0a: spacing 토큰을 추가합니다.

  Body, Heading, Display 컴포넌트를 Typography 컴포넌트와 연결합니다.

- Updated dependencies [79e9f6d]
  - @cocso-ui/react-icons@0.0.14

## 0.1.10

### Patch Changes

- b0e3f2a: 사용되지 않는 디자인 토큰을 제거합니다.

## 0.1.8

### Patch Changes

- 4bfd4e2: - 브랜드 로고를 추가하고, Horizontal Logo를 Text Logo로 변경합니다.
  - Button 컴포넌트에 asChild 옵션을 추가합니다.
- Updated dependencies [4bfd4e2]
  - @cocso-ui/react-icons@0.0.13

## 0.1.6

### Patch Changes

- 52fd725: `cocso-ui/react/button` 컴포넌트에 `xl` 사이즈를 추가합니다.

## 0.1.5

### Patch Changes

- c41daad: - `@cocso-ui/react`의 의존성 패키지를 변경합니다.
  - 빌드 생성 폴더를 변경합니다.
    - `lib` → `dist`
- Updated dependencies [c41daad]
  - @cocso-ui/react-icons@0.0.11

## 0.1.3

### Patch Changes

- bee35ae: - Add icons related to `cocso-ui`
  - Change variant of button component
- Updated dependencies [bee35ae]
  - @cocso-ui/react-icons@0.0.9

## 0.1.2

### Patch Changes

- 661270c: - Add icons related to `cocso-ui`
  - Change variant of button component
- Updated dependencies [661270c]
  - @cocso-ui/react-icons@0.0.8
