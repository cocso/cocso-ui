# TODOS

> All items from the Direction B codegen plan have been completed.
> Remaining items are follow-up improvements.

## Visual regression 테스트 baseline 생성

**What:** Storybook test-runner + jest-image-snapshot 설정 완료. Storybook을 빌드/실행하고 `pnpm --filter @cocso-ui/storybook test:visual`로 baseline 스크린샷 생성 필요.

**Why:** CSS Module 수정이나 codegen CSS 변경 시 시각적 회귀를 자동 감지.

**Context:** test-runner.ts 설정 + jest-image-snapshot 의존성 추가됨. 첫 실행 시 __snapshots__/ 디렉토리에 baseline이 자동 생성됨. CI에 visual test 단계 추가는 baseline 안정화 후 진행.

**Depends on:** Storybook 빌드 성공 + Playwright 설치.
