# TODOS

## Direction B (코드 생성) 재평가

**What:** 컴포넌트가 20개 이상으로 성장하면 Direction B(빌드 타임 코드 생성, seed-design 패턴) 재평가.

**Why:** sub-approach 2b(프로퍼티 이름 기반 자동 추론)의 PROPERTY_CATEGORIES 유지 부담이 컴포넌트 수에 비례해 증가. 코드 생성은 이 부담을 제거하고, 제로 런타임 + 최강 타입 안전성을 제공.

**Context:** 현재 13개 recipe, 10개 React 컴포넌트. Phase 1-4(Evolutionary Fix + Golden Matrix 검증)가 성공적으로 완료된 후, 규모 확대 시 자연스럽게 코드 생성으로 진화하는 경로가 확보됨. 디자인 문서 `~/.gstack/projects/cocso-cocso-ui/haklee-v1-design-20260328-192845.md`의 Approach B 섹션에 상세 분석 있음. research/refactoring-recommendation.md에 seed-design과의 비교 분석 포함.

**Depends on:** Phase 1-4 완료 + recipe 컴포넌트 20개 이상 도달.
