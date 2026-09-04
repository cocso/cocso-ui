# @cocso-ui/css

## 1.5.2

### Patch Changes

- cb5f977: 컨트롤의 테두리가 WCAG 1.4.11 의 3:1 을 넘도록 했습니다.

  `--cocso-color-border-strong` 이 `neutral-400` 에서 `neutral-500` 으로 한 단계
  내려갑니다. 이전 값은 페이지 위 3.08:1, 카드 위 2.82:1 로 — `strong` 이라는
  이름이 약속하는 기준을 넘지 못했습니다.

  입력·셀렉트·입력 트리거·OTP 슬롯·체크박스·라디오·스위치가 쉬는 상태에서
  `border-strong` 을 씁니다. 이전에는 `border-secondary`(흰 배경 1.23:1, 카드 위
  1.13:1)라 컨트롤의 경계가 보이지 않았고, 포커스를 받아야만 어디 있는지 알 수
  있었습니다.

  포커스는 `focus-ring` 으로 옮깁니다. 쉬는 상태가 `border-strong` 이 된 이상
  포커스도 같은 토큰이면 포커스 표시가 사라집니다(2.4.7).

  스위치는 꺼진 트랙이 `surface-neutral` 이라 페이지 위 1.23:1 이었습니다. 레시피가
  테두리를 갖게 되어 세 플랫폼이 같은 값을 그립니다.

  시각적으로 입력·체크박스·셀렉트·스위치의 외곽이 눈에 띄게 진해집니다.

- cb5f977: README에 본문 텍스트 색상의 대비 한계를 명시했습니다.

  `--cocso-color-text-tertiary`는 어떤 표면 위에서도 WCAG AA(4.5:1)를 넘지 못하며
  (흰 배경 3.08, 카드 2.82, 최악의 틴트 2.51) 본문용이 아닙니다. 두 소비 앱에서
  같은 오해가 독립적으로 발생해, 토큰 자체가 아니라 토큰이 어떻게 읽히는지가
  문제라는 것이 드러났습니다. 한 단계 어둡게 옮기는 것으로는 해결되지 않습니다 —
  `neutral-500`은 흰 배경만 통과하고 카드 위에서는 4.13으로 여전히 미달입니다.

  본문에 쓸 수 있는 단계는 `text-primary`와 `text-secondary` 둘입니다.

## 1.5.1

### Patch Changes

- 4af82b5: Generate `theme-dark.css` from the token sources.

  It was the only token artifact still written by hand, which meant the dark
  theme existed in the published CSS and nowhere else — the Figma token export
  reads the YAML, so Figma Variables only ever carried light values.

  Semantic color tokens now live in a `theme` collection with the modes `light`
  and `dark`; primitives stay in `global` with its single mode. `token.css` is
  the primitives plus the light theme; `theme-dark.css` is the same semantic
  tokens in their dark mode and nothing else, so the raw ramps are never
  re-emitted there and a consumer's `--cocso-color-primary-*` override still
  survives the theme flip.

  No token value changes. `theme-dark.css` grows from 51 declarations to 73: the
  22 tokens that deliberately do not move now say so explicitly, because the
  generator requires every token to declare a value for each of its collection's
  modes. That is the point — a semantic token can no longer ship without someone
  deciding what it does in the dark theme.

## 1.5.0

### Minor Changes

- 3248bbc: Point `interactive-info-text` at the 600 level in the light theme.

  It carried `info-500`, which clears AA on white by 0.05 and misses it on every
  other surface a link sits on: 4.17 on `surface-secondary`, 4.05 on a status
  tint, 3.70 on `interactive-primary-subtle`. The 600 level clears all of them
  (6.83 / 6.26 / 6.09 / 5.56). The dark theme is unchanged.

## 1.4.0

### Minor Changes

- b766293: Add `--cocso-color-interactive-info-text` and `-text-hover`, the text forms of
  the info role.

  The fixed-hue `interactive-*` fills are deliberately not redefined by the dark
  theme, because a saturated accent reads on either surface when it is a filled
  area. As a foreground the same values run backwards: on the dark
  `surface-primary`, `interactive-info` is 4.05:1 and `interactive-info-active` —
  the pressed-fill step — is 1.74:1. The new tokens carry the light theme's
  values unchanged (`info-500` and `info-700`) and flip to `info-300` and
  `info-200` in the dark theme, reaching 8.35:1 and 11.49:1.

## 1.3.0

### Minor Changes

- 1287ce0: Fix the dark theme's feedback colors and add theme-aware overlay tokens.

  `--cocso-color-feedback-danger`, `-info`, `-warning` and `-success` were never
  redefined for the dark theme, so they kept the light theme's 500 level — tuned
  against white — and landed at 3.96–4.05 on the dark `surface-primary`, under
  WCAG AA. `StockQuantityStatus` paints body-size text directly with these, so
  its "insufficient" and "sufficient" states were unreadable. They now step to
  the 400 level in the dark theme, clearing AA at 4.70–5.96 on both dark surfaces
  without shifting hue.

  Adds `--cocso-color-overlay-subtle`, `-muted` and `-strong` (`black-alpha-5/10/20`
  in light, `white-alpha-5/10/20` in dark), also exported as Tailwind's
  `overlay-subtle`/`-muted`/`-strong`. Use these for a translucent tint over an
  unknown background instead of `black-alpha-*`, which is raw scale and stays
  black in both themes so the Dialog scrim keeps working.

- 1287ce0: Export twelve semantic tokens to the Tailwind theme that `token.css` already
  defined but `tailwind4.css` did not: `border-strong`, `text-on-success`,
  `text-on-danger`, `text-on-info`, `text-on-warning`,
  `interactive-primary-subtle`, `interactive-primary-text`,
  `interactive-neutral`, `interactive-neutral-hover`,
  `interactive-neutral-active`, `interactive-danger-subtle-hover` and
  `interactive-danger-subtle-active`.

  They were written into `token.css` by hand and never made it back into
  `packages/baseframe-sources`, which is what generates both published files and
  the Figma token export — so the custom properties resolved, but the matching
  Tailwind utilities did not exist and Figma never saw the tokens. The sources
  now carry them, and `golden.test.ts` fails if the published CSS and the YAML
  disagree again.

## 1.2.1

### Patch Changes

- 6bfd0a4: Separate the dark theme's borders from its surfaces.

  `border-secondary` and `surface-secondary` both resolved to `neutral-900`, so a divider drawn on a card sat at **1.00:1** against it — the same colour, invisible. Row separators, list dividers, and in-card rules all vanished, and card outlines against the page background were only marginally better at 1.14:1.

  The light theme does not have this: surfaces take the two lightest neutral steps and borders the next two. The dark theme now mirrors that — `border-secondary` moves to `neutral-800` and `border-primary` to `neutral-700`, restoring a separation (1.34:1 on a card) comparable to the light theme's own (1.41:1).

  A test asserts no border token resolves to the same value as a container surface in either theme.

## 1.2.0

### Minor Changes

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

## 1.1.0

### Minor Changes

- 17504b4: Add a dedicated floating layer to the z-index scale so popups always render above modals.

  - Add `popover` (300) and `tooltip` (400) z-index tokens, above `dialog` (200).
  - Dropdown and Popover positioners now use `--cocso-z-index-popover`; Tooltip uses `--cocso-z-index-tooltip`. DayPicker/MonthPicker inherit the dropdown layer.
  - Fixes tooltips and dropdowns (incl. DayPicker/MonthPicker) being hidden behind dialog content when opened inside a Dialog.
  - Remove the redundant `z-index` on the Dropdown popup; the layer belongs on the Positioner per the floating component contract.

## 1.0.1

### Patch Changes

- b108361: Add an opt-in dark theme at `@cocso-ui/css/theme-dark.css`. Import it after
  `token.css` and set `data-theme="dark"` on a container to remap the semantic
  token layer (text, surface, border, interactive, focus, feedback surfaces) to
  dark tones. Raw color-scale tokens are untouched, so app-level scale overrides
  are preserved and existing light-only apps are unaffected.

## 1.0.0

### Major Changes

- 0ee7777: BREAKING: rename CSS custom property prefix from `--ds-*` to `--cocso-*` and
  rebase the color system. `primary` is now derived from the `neutral` scale and
  several token values changed.

  Migration:

  - Replace all `--ds-color-*` / `--ds-*` references with `--cocso-*`.
  - Re-check any hardcoded reliance on the previous blue `primary` palette; it now
    resolves to the neutral scale.

## 0.1.2

### Patch Changes

- 5cc3012: - 버튼 컴포넌트가 Active 상태일 때 Scale이 0.98로 축소되는 애니메이션 효과를 추가합니다.
- `textSecondary` 색상을 약간 더 어둡게 조정해 가독성을 향상합니다. (`neutral-500` → `neutral-600`)

## 0.1.1

### Patch Changes

- c385ce1: Badge 컴포넌트 추가

## 0.1.0

### Minor Changes

- 1e77fb6: 텍스트 색상 토큰을 추가합니다.

  버튼 컴포넌트 xs의 사이즈 토큰을 변경합니다.

  Settler 페이지에서 사용되는 `react-icons`을 추가합니다.

## 0.0.17

### Patch Changes

- e9a3e0a: spacing 토큰을 추가합니다.

  Body, Heading, Display 컴포넌트를 Typography 컴포넌트와 연결합니다.

## 0.0.16

### Patch Changes

- b0e3f2a: 사용되지 않는 디자인 토큰을 제거합니다.

## 0.0.15

### Patch Changes

- bee35ae: - Add icons related to `cocso-ui`
  - Change variant of button component

## 0.0.14

### Patch Changes

- 661270c: - Add icons related to `cocso-ui`
  - Change variant of button component

## 0.0.12

### Patch Changes

- 1ab213c: Add `colors.css` used in production project.
