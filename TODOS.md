# TODOS

## 완료된 항목

- [x] `@media (hover: hover)` 분리 — CSS Module에서 `@media (hover: hover) and (pointer: fine)` 래핑 적용 완료 (button, link, pagination, dropdown, day-picker, month-picker, OTP field)
- [x] Visual regression test baseline — US-002 complete. 109 snapshots across 30 story suites written to `apps/storybook/__snapshots__/`.
- [x] Semantic 토큰 레이어 확장 — 19개 recipe 전체 primitive→semantic 마이그레이션 완료. 52개 semantic color 토큰 체계 (기존 21 + 신규 31). `ColorTokenRef` 타입 확장, `--cocso-color-transparent` hotfix, Figma resolver semantic fallback chain 추가. golden-matrix 19 recipes / 2053 comparisons / 0 VALUE_MISMATCH.
- [x] Recipe 미보유 10개 컴포넌트 C1/C2/C3 적합성 평가 — 10개 전부 부적합 판정 (Tab/Toast: headless, Accordion: structural-only, Day-picker/Month-picker: 서드파티 래퍼, Tooltip/Popover/Dropdown: multi-slot 미지원, Field/OTP Field: C1 미충족). CSS Module primitive→semantic 교체 완료 (8개 컴포넌트).
- [x] Visual regression CI (Phase 2) — CI에 `visual-regression` job 추가. Playwright Chromium 고정 환경, `--ci` mode (baseline 존재 시), graceful skip (baseline 미존재 시 warning). `workflow_dispatch`로 Ubuntu baseline 생성/업데이트. diff artifact 업로드 (실패 시 7일 보존).

## 다음 PR 과제

아래 항목들은 순서대로 다음 PR에서 진행 예정.

### 1. Semantic 토큰 레이어 확장 (심화)

66개 semantic 토큰이 정의되어 있으나 (52 color + 5 shadow + 5 duration + 4 easing), 추가 확장이 필요한 영역:
- [x] Elevation/shadow semantic 토큰 추가 — `--cocso-shadow-thumb/card/dropdown/popover/dialog` 5개 정의 완료
- [ ] Spacing semantic 토큰 — 컴포넌트 간 일관된 spacing scale 정의 (현재 primitive 22개로 충분, 필요 시 추가)
- [ ] Typography semantic 토큰 — heading/body/caption 등 용도별 토큰화 (recipe 타입 시스템 변경 필요, 별도 PR)
- [x] Motion/transition semantic 토큰 — `--cocso-duration-fast/normal/slow/decorative/decorative-slow` + `--cocso-easing-default/soft/entrance/accordion` 9개 정의 완료. 16개 CSS 모듈 마이그레이션 완료.

### 2. Recipe 미보유 10개 컴포넌트 처리

C1/C2/C3 부적합 판정된 10개 컴포넌트에 대한 후속 조치:
- [ ] Tab — headless 패턴 유지, recipe 없이 CSS Module semantic 토큰 적용 확인
- [ ] Toast — headless 패턴 유지, 스타일 토큰 정리
- [ ] Accordion — structural-only, semantic 토큰 적용 완료 확인
- [ ] Day-picker / Month-picker — 서드파티 래퍼, 커스텀 스타일 오버라이드 정리
- [ ] Tooltip / Popover / Dropdown — multi-slot 미지원, CSS variable 기반 테마 대응 검토
- [ ] Field / OTP Field — C1 미충족, primitive→semantic 교체 완료 확인

### 3. table/data-table

XL 복잡도, 별도 프로젝트 문서 필요:
- [ ] `docs/project-table.md` 작성 — 요구사항, 스코프, API 설계
- [ ] 기존 테이블 패턴 리서치 (Tanstack Table, AG Grid 등)
- [ ] 컴포넌트 설계 및 recipe 정의
- [ ] 구현 및 스토리 작성

## 먼 미래 과제

아래 항목들은 위 과제들이 모두 완료된 후 진행. 우선순위가 가장 낮음.

- [ ] 다크 모드 — `light-dark()` 함수 + baseframe dark token (semantic 토큰 완성됨, 즉시 착수 가능)
- [ ] 양방향 Figma sync — figma-extractor + CI daily sync. Figma tokens.json에 semantic 토큰 추가 필요.

## Visual regression test infrastructure

**Status:** CI integrated (Phase 2 complete). Baseline generation via `workflow_dispatch`.

### CI Job (`visual-regression` in `.github/workflows/ci.yml`)

- Standalone job, runs in parallel with lint/test/icons/build
- Playwright Chromium with browser caching (`actions/cache`)
- Builds Storybook, serves static on port 6006
- Graceful baseline check: if no PNGs → warning + skip; if PNGs exist → `--ci` mode
- On failure: uploads diff artifacts (7-day retention)

### Baseline Management (`Update Visual Regression Baselines` workflow)

- `workflow_dispatch` trigger with branch input
- Generates Ubuntu baselines and auto-commits
- Use for: initial bootstrap, intentional UI changes

### How to run locally

```bash
# 1. Build Storybook
pnpm --filter @cocso-ui/storybook build

# 2. Serve the build (separate terminal)
npx serve apps/storybook/storybook-static -p 6006

# 3. Run visual tests
pnpm --filter @cocso-ui/storybook test:visual

# 4. Update baselines after intentional UI changes
pnpm --filter @cocso-ui/storybook test:visual -- --updateSnapshot
```

**Note:** Local (macOS) results may differ from CI (Ubuntu) due to font rasterizer differences. CI baselines are the source of truth. Local visual tests are advisory only.

**Snapshot location:** `apps/storybook/__snapshots__/`
**Failure threshold:** 0.01% pixel diff (configured in `.storybook/test-runner.ts`)
