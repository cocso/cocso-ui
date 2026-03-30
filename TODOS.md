# TODOS

## Pre-fix: 코드리뷰 대응 (다음 PR)

### Codegen

- [ ] **인라인 타입 동기화 검증**: `SpinnerVariant`, `SpinnerSize`, `RadioSize` 인라인 타입이 codegen 생성 타입과 일치하는지 자동 검증 추가. CI freshness gate는 `generated/`만 검사하므로 React 소스의 인라인 타입은 drift 가능.
- [ ] **multi-slot guard 위치 개선**: `generateRuntime`/`generateTypes` 내부에서 throw하면 CSS는 이미 써진 후. `generate.ts` 진입점에서 모든 recipe의 slot 수를 사전 검증하여 partial write 방지.
- [ ] **parity test compound-selector 파서 강화**: `cascadeForCombo`가 첫 번째 `-`로 dimension/value를 분리. dash 포함 dimension 이름(e.g., `font-size`)에서 오파싱 가능. convention 의존이므로 dimension 이름 제약을 문서화하거나 파서 개선.

### Figma

- [ ] **resolveColorToken silent fallback 제거**: 알 수 없는 색상 토큰에 `{r:0, g:0, b:0}` (검정) 반환 대신 경고 로그 또는 에러. 토큰 오타 시 Figma 출력이 silent하게 검정으로 렌더링됨.
- [ ] **resolveRadiusToken silent fallback 제거**: 미등록 radius 토큰에 0 반환 대신 경고. `RADIUS_MAP`이 1-6만 커버.

### Recipe

- [ ] **resolveStyleValue 토큰 오타 감지**: 인식되지 않는 문자열이 그대로 CSS custom property 값으로 출력됨. dev-mode 경고 또는 알려진 패턴(color/radius/spacing/fontWeight/CSS literal) 매칭 실패 시 경고 추가.

### React 컴포넌트

- [ ] **DayPicker locale prop 추가**: 현재 한국어(`ko`) 하드코딩. 문서는 영어 기본이라고 명시. `locale` prop 노출하거나 문서 수정.
- [ ] **DayPicker trigger 기본값**: `trigger` prop 미전달 시 `Dropdown.Trigger`에 `undefined` 전달되어 크래시 가능. MonthPicker처럼 기본 trigger 제공.
- [ ] **Pagination null 반환**: 범위 밖 페이지에 `""` 대신 `null` 반환. 빈 문자열은 DOM에 불필요한 텍스트 노드 생성.
- [ ] **StockQuantityStatus 영문 enum 전환 검토**: variant 값이 `"보통" | "여유" | "부족"` (한국어). AGENTS.md 규칙("Write all code in English") 위반 여부 확인. 의도적 결정이면 예외 문서화.

### Storybook

- [ ] **Visual regression timeout 개선**: `test-runner.ts`의 `waitForTimeout(300)` → `waitForLoadState('networkidle')` 등 조건 기반 대기로 교체. flaky test 위험.

## Phase 4: 신규 컴포넌트 (avatar, card, alert, tag, progress, breadcrumb, skeleton)

**What:** 일반적 디자인 시스템에서 기대되는 7개 컴포넌트를 codegen 네이티브로 구축.

**Why:** 내부 제품 UI 커버리지를 높여 cocso-ui만으로 실제 제품 개발이 가능하도록.

**Context:** codegen 파이프라인이 완성되어 새 컴포넌트 추가 프로세스가 확립됨: recipe 정의 → `pnpm generate` → React 컴포넌트 → Storybook → Figma generator → golden matrix. table/data-table은 XL 복잡도로 별도 프로젝트 문서 필요.

**우선순위:** avatar → card → alert → tag → progress → breadcrumb → skeleton

**Depends on:** codegen 파이프라인 완료 (✅).

## Visual regression 테스트 baseline 생성

**What:** `pnpm --filter @cocso-ui/storybook test:visual`로 baseline 스크린샷 생성.

**Why:** CSS 변경 시 시각적 회귀를 자동 감지.

**Context:** test-runner.ts + jest-image-snapshot 설정 완료. 첫 실행 시 baseline 자동 생성.

**Depends on:** Storybook 빌드 성공 + Playwright 설치.
