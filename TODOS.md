# TODOS

## Pre-fix: 코드리뷰 대응 — ✅ 완료 (PR #152)

### Codegen

- [x] **인라인 타입 동기화 검증**: `inline-type-sync.test.ts` 추가. SpinnerVariant, SpinnerSize, RadioSize가 recipe variant 키와 일치하는지 CI에서 자동 검증.
- [x] **multi-slot guard 위치 개선**: `generate.ts` 진입점에서 모든 recipe의 slot 수를 사전 검증. partial write 방지.
- [x] **parity test compound-selector 파서 강화**: dimension 이름에 dash 금지 convention을 AGENTS.md에 문서화 + `defineRecipe()`에서 경고.

### Figma

- [x] **resolveColorToken silent fallback 제거**: 미등록 토큰에 `console.warn` + 마젠타(`{r:1, g:0, b:1}`) fallback으로 변경.
- [x] **resolveRadiusToken silent fallback 제거**: 미등록 토큰에 `console.warn` 추가.

### Recipe

- [x] **resolveStyleValue 토큰 오타 감지**: 토큰 패턴(`word-digits`)과 일치하지만 인식되지 않는 문자열에 `console.warn` 추가.

### React 컴포넌트

- [x] **DayPicker locale prop 추가**: `locale` + `dateFormat` prop 추가. MonthPicker도 동일 적용. MonthPicker dateFormat 버그 수정 (`"yyyy년 MM월 dd일"` → `"yyyy년 MM월"`).
- [x] **DayPicker trigger 기본값**: 기본 `<Button>` trigger 제공 + `disabled` prop 전달. MonthPicker도 동일 적용.
- [x] **Pagination null 반환**: `""` → `null` 변경.
- [x] **StockQuantityStatus 영문 enum 전환**: `"여유"/"보통"/"부족"` → `"sufficient"/"normal"/"insufficient"`. `DISPLAY_LABELS` 매핑으로 한국어 UI 유지.

### Storybook

- [x] **Visual regression timeout 개선**: `waitForTimeout(300)` → `waitForLoadState('networkidle')` 변경.

## Phase 4: 신규 컴포넌트 — ✅ 완료 (PR #152)

6개 컴포넌트를 codegen 네이티브로 구축 (Tag는 Badge와 기능 중복으로 제외):

- [x] avatar — size (xs–xl), shape (circle/square)
- [x] card — variant (elevated/outlined/filled), padding (sm–lg)
- [x] alert — variant (info/success/warning/error), icon + close
- [x] progress — variant (primary–info), size (sm–lg)
- [x] breadcrumb — size (sm–lg), ChevronRightIcon separator
- [x] skeleton — variant (text/circular/rectangular), animation (pulse/wave/none)
- [x] ~~tag~~ — Badge와 기능 중복으로 제거

각 컴포넌트: recipe → codegen → React + CSS module → Storybook stories → Figma generator → parity test + unit test.

19 recipes, 816 CSS lines, 409 React tests.

## Visual regression 테스트 baseline 생성

**What:** `pnpm --filter @cocso-ui/storybook test:visual`로 baseline 스크린샷 생성.

**Why:** CSS 변경 시 시각적 회귀를 자동 감지.

**Context:** test-runner.ts가 `waitForLoadState('networkidle')` 기반으로 개선됨. 첫 실행 시 baseline 자동 생성.

**Depends on:** Storybook 빌드 성공 + Playwright 설치.

## 후속 과제 (다음 사이클)

- [ ] `@media (hover: hover)` 분리 — 모바일 hover sticky 방지
- [ ] Recipe 없는 10개 컴포넌트 (accordion, tab, toast 등) recipe 마이그레이션 — SSOT 커버리지 67%→83%
- [ ] 다크 모드 — `light-dark()` 함수 + baseframe dark token
- [ ] 양방향 Figma sync — figma-extractor + CI daily sync
- [ ] table/data-table — XL 복잡도, 별도 프로젝트 문서 필요
