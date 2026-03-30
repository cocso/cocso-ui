# TODOS

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
