# TODOS

## 완료된 항목

- [x] `@media (hover: hover)` 분리 — CSS Module에서 `@media (hover: hover) and (pointer: fine)` 래핑 적용 완료 (button, link, pagination, dropdown, day-picker, month-picker, OTP field)
- [x] Visual regression test baseline — US-002 complete. 109 snapshots across 30 story suites written to `apps/storybook/__snapshots__/`.

## 후속 과제 (다음 사이클)

- [ ] Recipe 미보유 10개 컴포넌트 (accordion, tab, toast, tooltip, popover, dropdown, field, OTP field, day-picker, month-picker) C1/C2/C3 적합성 평가 — 현재 전체 커버리지 19/29 (65.5%), visual-recipe 커버리지 19/19 (100%)
- [ ] Semantic 토큰 레이어 확장 — 기존 19개 recipe의 primitive→semantic 마이그레이션
- [ ] 다크 모드 — `light-dark()` 함수 + baseframe dark token (semantic 토큰 완성 후)
- [ ] 양방향 Figma sync — figma-extractor + CI daily sync
- [ ] table/data-table — XL 복잡도, 별도 프로젝트 문서 필요
- [ ] Visual regression CI (Phase 2) — add a CI job running `test:visual --ci` after `build`. Requires pinned Chromium environment for consistent rendering across machines.

## Visual regression test infrastructure (US-002)

**Status:** Baseline generated. 109 snapshots across 30 story suites.

### What was done

- Upgraded `@storybook/test-runner` from 0.22.1 to 0.24.3 to fix async `serverRequire` incompatibility with Storybook 10 (v0.22.x used synchronous `serverRequire` but Storybook 10 made it return a Promise, causing config to load as `{}`).
- Moved `test-runner.ts` from the app root into `.storybook/test-runner.ts` — the test-runner discovers config by calling `getInterpretedFile(<configDir>/test-runner)`, so the file must live inside `configDir`.
- Added `--config-dir .storybook` to the `test:visual` script so the test-runner resolves the correct Storybook config in the monorepo context.

### CI strategy: Phase 1 — local-only

Visual regression tests are intentionally NOT wired into CI at this stage. Reasons:

- PNG snapshots are committed to the repo. CI would need a consistent Chromium environment with pinned fonts to avoid flaky pixel-diff failures across different machines/OS versions.
- The `--ci` flag (fail on missing snapshots instead of writing them) is required for safe CI integration but needs the baseline to be stable first.

**Phase 2 (future CI job):**
```yaml
- name: Build Storybook
  run: pnpm --filter @cocso-ui/storybook build
- name: Visual regression tests
  run: pnpm --filter @cocso-ui/storybook test:visual -- --ci
  # Requires: Playwright Chromium installed, Storybook served on port 6006
```

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

**Snapshot location:** `apps/storybook/__snapshots__/` (109 PNG files, committed to repo)
**Failure threshold:** 0.01% pixel diff (configured in `.storybook/test-runner.ts`)
