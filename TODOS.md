# TODOS

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
