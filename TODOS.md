# TODOS

## Direction B (코드 생성) 재평가

**What:** 컴포넌트가 20개 이상으로 성장하면 Direction B(빌드 타임 코드 생성, seed-design 패턴) 재평가.

**Why:** sub-approach 2b(프로퍼티 이름 기반 자동 추론)의 PROPERTY_CATEGORIES 유지 부담이 컴포넌트 수에 비례해 증가. 코드 생성은 이 부담을 제거하고, 제로 런타임 + 최강 타입 안전성을 제공.

**Context:** 현재 13개 recipe, 10개 React 컴포넌트. Phase 1-4(Evolutionary Fix + Golden Matrix 검증)가 성공적으로 완료된 후, 규모 확대 시 자연스럽게 코드 생성으로 진화하는 경로가 확보됨. 디자인 문서 `~/.gstack/projects/cocso-cocso-ui/haklee-v1-design-20260328-192845.md`의 Approach B 섹션에 상세 분석 있음. research/refactoring-recommendation.md에 seed-design과의 비교 분석 포함.

**Depends on:** Phase 1-4 완료 + recipe 컴포넌트 20개 이상 도달.

## PR2: Figma State Variant Generation (5개 컴포넌트)

**What:** button, link, checkbox, input, select에 hover/active/focus states 추가. 단일 ComponentSetNode per component. `addStateVariants` 공유 유틸리티 구축. `rgbToTokenName` 제거.

**Why:** 디자이너가 Figma variant panel에서 상태를 전환하고 시각적 차이를 확인할 수 있어야 함.

**Context:** PR1(Token Binding) 완료. 디자인 문서 `~/.gstack/projects/cocso-cocso-ui/haklee-v1-design-20260329-143653.md` (eng review 반영). checkbox는 State × Checked orthogonal dimension. input/select는 State=Focus 포함.

**Depends on:** PR1 (Token Binding) 완료.

## PR3: 나머지 컴포넌트 State Variant (radio, switch, pagination)

**What:** radio-group, switch, pagination에 state variant 추가. recipe 구조 확장 필요.

**Why:** PR2에서 구축한 addStateVariants 유틸리티를 나머지 stateful 컴포넌트에 적용하여 일관된 상태 모델 완성.

**Context:** radio-group은 recipe에 color token이 없어 base variant에 borderColor/bgColor 추가 필요. switch는 unchecked 배경 토큰(switchBgColor) 추가 필요. pagination은 기존 `state` variant dimension(active/inactive/disabled)과 interaction state 이름 충돌 — `InteractionState` 별도 property 또는 `state` → `pageState` rename 필요. 디자이너 피드백 후 결정. 디자인 문서 `~/.gstack/projects/cocso-cocso-ui/haklee-v1-design-20260329-143653.md`의 Open Questions 참조.

**Depends on:** PR2 완료 + 디자이너 피드백.
