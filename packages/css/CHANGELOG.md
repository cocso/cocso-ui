# @cocso-ui/css

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
