# TODOS

## Figma generator codegen 마이그레이션 (Phase 2c)

**What:** 13개 Figma generator가 `resolveForFigma`를 직접 호출하는 대신, codegen의 Figma JSON descriptor를 소비하도록 전환.

**Why:** codegen이 모든 recipe를 build-time에 해석하므로, Figma generator도 같은 생성 파이프라인을 사용하면 일관성 확보 + resolveForFigma 런타임 호출 제거.

**Context:** Phase 2b (React 마이그레이션) 완료. 현재 Figma는 동작에 문제 없이 resolveForFigma를 직접 사용 중. 긴급하지 않으나 아키텍처 일관성을 위해 진행 권장. 디자인 문서의 eng review에서 resolveForFigma를 build-time에 호출하여 JSON serialize하는 방식 결정됨.

**Depends on:** Phase 2b 완료 (✅).

## Visual regression 테스트

**What:** Storybook visual regression 또는 Playwright screenshot comparison 도입.

**Why:** Phase 2b에서 CSS Module의 structural CSS 분리 시 transition/animation 누락이 silent failure. 시각적 회귀를 자동 감지할 수 있는 테스트 필요.

**Context:** Eng review에서 critical gap으로 식별. CSS Module은 미변경이지만, 향후 P7(@media hover) 적용 시 CSS Module 수정이 발생하면 시각적 회귀 리스크 증가.

**Depends on:** Storybook 정상 동작.

## P7: Mobile hover sticky 해결

**What:** CSS Module의 `:hover` 규칙을 `@media (hover: hover) and (pointer: fine)` 으로 래핑.

**Why:** 터치 디바이스에서 hover 스타일이 탭 후 고착되는 문제 (hover sticky). seed-design은 이미 적용.

**Context:** codegen CSS에 state-suffixed 속성으로 생성 완료 (--cocso-button-bg-color-hover). CSS Module이 이를 `:hover` pseudo-selector에서 참조. `@media` 래핑은 CSS Module만 수정하면 됨.

**Depends on:** Phase 2b 완료 (✅).

## CI codegen freshness 검증

**What:** CI에서 `pnpm --filter @cocso-ui/codegen generate && git diff --exit-code packages/codegen/generated/` 실행하여 생성 파일이 recipe와 동기화되어 있는지 검증.

**Why:** recipe 변경 후 codegen을 실행하지 않으면 stale 생성 파일이 커밋될 수 있음.

**Context:** turbo.json에 `generate` task 추가됨. CI workflow에 검증 단계 추가 필요.

**Depends on:** turbo.json generate task (✅).

## Direction B 완료 후 recipe runtime dep 제거

**What:** `@cocso-ui/react`의 dependencies에서 `@cocso-ui/recipe`를 제거하여 runtime 번들에서 recipe resolver 코드 제거.

**Why:** codegen 마이그레이션 완료 후 recipe는 build-time 전용. spinner의 `getSpinnerGeometry`를 codegen 생성으로 이동하면 완전 제거 가능.

**Context:** 현재 spinner.tsx가 `getSpinnerGeometry`를 recipe에서 직접 import하는 1건 남음. 이 함수를 codegen generated에 포함시키거나, spinner에 인라인하면 recipe dep 완전 제거 가능.

**Depends on:** spinner getSpinnerGeometry 처리 방안 결정.
