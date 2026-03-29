# TODOS

## Figma generator codegen 마이그레이션 (Phase 2c)

**What:** 13개 Figma generator가 `resolveForFigma`를 직접 호출하는 대신, codegen의 Figma JSON descriptor를 소비하도록 전환.

**Why:** codegen이 모든 recipe를 build-time에 해석하므로, Figma generator도 같은 생성 파이프라인을 사용하면 일관성 확보.

**Context:** Phase 2b (React 마이그레이션) 완료. 현재 Figma는 동작에 문제 없이 resolveForFigma를 직접 사용 중. 긴급하지 않으나 아키텍처 일관성을 위해 진행 권장. resolveForFigma → codegen 의존성 구조(figma 패키지가 recipe에 직접 의존)가 복잡하여 별도 설계 필요.

**Depends on:** Phase 2b 완료 (✅).

## Visual regression 테스트

**What:** Storybook visual regression 또는 Playwright screenshot comparison 도입.

**Why:** CSS Module 수정 시 transition/animation 누락이 silent failure. 시각적 회귀를 자동 감지할 수 있는 테스트 필요.

**Context:** Eng review에서 critical gap으로 식별. P7 hover 수정이 적용되었으므로 시각적 검증 중요도 증가.

**Depends on:** Storybook 정상 동작.
