# cocso-ui 현재 문제점 및 개선 여지

> 작성일: 2026-03-29
> 최종 업데이트: 2026-03-30
> 기준: codegen pipeline 전면 도입 + BaseSlotProperties 구현 후 상태
> 비교 대상: seed-design (당근), kumo-ui (Cloudflare)

---

## 현재 상태 요약

19개 recipe, 16개 React 컴포넌트, 19개 Figma 생성기. Phase 1~2.5 + Phase 3 (BaseSlotProperties) + Direction B (codegen) + Phase 4 (6개 신규 컴포넌트) 전면 완료:
- `categoryOf()` 프로퍼티 분류, `_tokenRefs` 토큰 이름 보존, `addStateVariants()` 8개 컴포넌트 상태 생성, golden matrix CI gate, `rgbToTokenName` 제거.
- `@cocso-ui/codegen`: 빌드 타임 CSS/className 함수/TypeScript 타입 생성 (19개 recipe, 816 CSS lines, 409 parity tests).
- React에서 `@cocso-ui/recipe` 런타임 의존성 제거 — 생성된 산출물만 소비.
- `BaseSlotProperties` (35개 프로퍼티): recipe 작성 시 프로퍼티 이름 자동완성 + 타입 검증.
- Figma JSON descriptor 생성 + 19개 generator가 pre-resolved JSON 소비.
- Phase 4 신규 컴포넌트 (avatar, card, alert, progress, breadcrumb, skeleton) codegen 네이티브 완료.
- `StockQuantityStatus` 영문 enum 전환: `"여유"/"보통"/"부족"` → `"sufficient"/"normal"/"insufficient"`, `DISPLAY_LABELS` 매핑으로 한국어 UI 유지.

잘 동작하는 것: recipe SSOT, golden matrix 패리티 검증, _tokenRefs 정방향 바인딩, orthogonal state dimensions.

---

## 문제점

### ~~P1. 런타임 해석 비용~~ — ✅ 해결됨 (codegen 도입)

**증상**: `resolveStyleMap()`이 매 렌더마다 실행. recipe → base → variant → compound → state → camelCase→kebab 변환을 런타임에 수행.

**해결**: `@cocso-ui/codegen` 도입으로 빌드 타임 CSS 생성. React 컴포넌트는 생성된 className 함수만 호출 — **런타임 비용 제로**. `@cocso-ui/recipe` 런타임 의존성 완전 제거. 19개 recipe에서 816 CSS lines 생성, 409개 parity test로 정확성 검증.

---

### ~~P2. 프로퍼티 이름 타입 안전성 부재~~ — ✅ 해결됨 (BaseSlotProperties)

**증상**: `SlotStyles`의 key가 `Record<string, StyleValue>`로 정의. 프로퍼티 이름에 오타가 있어도 컴파일 타임에 잡히지 않음.

**해결**: `BaseSlotProperties` 인터페이스 도입 (35개 프로퍼티 타입화). 알려진 프로퍼티(`bgColor`, `fontColor`, `height` 등)는 자동완성 + 값 타입 제약, 커스텀 프로퍼티는 index signature 폴백으로 유지. 비파괴적으로 점진 도입 완료.

---

### ~~P3. React resolver 출력의 타입 정보 손실~~ — ✅ 해결됨 (codegen 도입)

**증상**: `resolveStyleMap()` 반환값이 `Record<string, string>`. 소비자가 어떤 CSS custom property가 존재하는지 컴파일 타임에 알 수 없음.

**해결**: codegen이 recipe에서 CSS 파일을 빌드 타임에 생성하여, CSS custom property 이름이 생성 시점에 결정됨. React 컴포넌트는 생성된 className 함수를 호출하며, 리터럴 유니온 타입의 variant props를 통해 타입 안전성 확보. `resolveStyleMap()`을 런타임에 호출하는 패턴 자체가 제거됨.

---

### P4. Figma 양방향 sync 부재

**증상**: cocso-ui는 Code → Figma 단방향. 디자이너가 Figma에서 토큰을 변경해도 코드에 반영되지 않음.

**비교**:
- seed-design: figma-extractor + GitHub Actions daily sync. Figma 변경 → CI가 Draft PR 자동 생성. 양방향.
- kumo-ui: 동일하게 단방향이지만, destructive sync로 Figma 상태를 강제 덮어씀.
- cocso-ui: Figma plugin이 recipe 기반으로 생성하지만, Figma → Code 경로 없음.

**영향**: 디자이너가 Figma에서 탐색적 작업을 하면 코드와 drift 발생. 현재는 디자이너가 수동으로 개발자에게 전달.

**개선 방향**: seed-design의 figma-extractor 패턴 참고. Figma REST API로 변수 컬렉션을 읽고 `tokens.json`과 비교하는 CI job. 차이가 있으면 Draft PR 생성. 양방향이 반드시 필요한 것은 아님 — code-first가 의도적 결정이라면 drift detection만으로도 충분.

---

### P5. CompoundBorder의 불완전한 Figma 해석

**증상**: recipe에서 `border: { _type: "border", color, style, width }`로 정의된 CompoundBorder가 Figma resolver에서 `strokeColor` + `strokeWeight`로 분해되지만, `borderStyle`(solid/dashed/dotted)은 손실됨.

**비교**:
- seed-design: CSS 생성이므로 `border-style` 포함.
- kumo-ui: Tailwind class가 `border-solid` 등을 직접 지정.
- cocso-ui: golden matrix에서 `COMPOUND_SPLIT` 카테고리로 추적하지만, Figma API에 `borderStyle` 대응이 없어 의도적 손실.

**영향**: 대부분의 컴포넌트가 `solid` border만 사용하므로 실질적 영향 낮음. dashed/dotted border가 필요한 컴포넌트가 추가되면 문제.

**개선 방향**: Figma의 `dashPattern` property를 활용하여 dashed/dotted를 근사 표현 가능. 현재는 WONTFIX 수준이지만 golden matrix가 추적 중이므로 문제 발생 시 감지됨.

---

### P6. CSS 리터럴의 Figma 표현 불가

**증상**: `transparent`, `currentColor`, `none`, `inherit` 같은 CSS 리터럴이 Figma resolver에서 무시됨. golden matrix에서 `SILENT_DROP`으로 분류.

**비교**:
- seed-design: CSS 생성이므로 리터럴 그대로 출력.
- kumo-ui: Tailwind class가 CSS 리터럴을 직접 표현 (`bg-transparent` 등).
- cocso-ui: Figma API에 대응 개념 없음 (transparent → fills=[], currentColor → 미지원).

**영향**: button의 `outline` variant에서 `bgColor: "transparent"`가 Figma에서 빈 fill로 처리됨 (시각적으로는 올바름). `currentColor`는 link의 `current` variant에서 사용되는데, Figma에서는 부모 색상 상속이 불가하므로 placeholder 색상이 필요.

**개선 방향**: `transparent` → `fills = []` 처리는 이미 올바름. `currentColor` → golden matrix에서 경고하고, Figma generator에서 fallback 색상(neutral-900)을 사용하는 것을 명시적으로 문서화.

---

### ~~P7. Mobile-first 상태 분리 미지원~~ — ✅ 해결됨

**증상**: cocso-ui의 hover state는 터치 디바이스에서도 동일하게 적용됨. `@media (hover: hover)` 분리 없음.

**해결**: CSS Module에서 `@media (hover: hover)` 분리 적용 완료. 모바일 hover sticky 문제 해결.

---

## 우선순위 평가

| 문제 | 상태 | 해결 방법 |
|------|------|-----------|
| P1. 런타임 해석 비용 | ✅ 해결 | `@cocso-ui/codegen` 빌드 타임 CSS 생성, 런타임 비용 제로 |
| P2. 프로퍼티 이름 타입 | ✅ 해결 | `BaseSlotProperties` (35개 프로퍼티 타입화) |
| P3. React 출력 타입 손실 | ✅ 해결 | codegen 생성 className 함수 + 리터럴 유니온 타입 |
| P4. Figma 양방향 sync | ❌ 의도적 수용 | code-first 철학 유지, drift detection으로 충분 |
| P5. CompoundBorder 손실 | ❌ WONTFIX | golden matrix가 추적 중, 실질적 영향 없음 |
| P6. CSS 리터럴 Figma | ❌ WONTFIX | transparent → fills=[] 처리 올바름, 문서화 완료 |
| P7. Mobile hover sticky | ✅ 해결 | CSS Module에서 `@media (hover: hover)` 분리 적용 |
| P8. .d.ts 타입 누출 | ✅ 해결 | devDependency re-export 제거, 인라인 타입 선언 |
| P9. 중복 CSS 셀렉터 | ✅ 해결 | `mergeRules()` 도입, 748→607줄 (19% 감소) |
| P10. multi-slot silent fail | ✅ 해결 | 명시적 에러 guard 추가 |

**해결됨**: P1, P2, P3, P7, P8, P9, P10 (codegen + BaseSlotProperties + CSS Module 수정 + 코드리뷰 대응 + Phase 4 신규 컴포넌트)
**의도적 수용**: P4, P5, P6 (현재 아키텍처의 트레이드오프)

---

## 코드리뷰 대응 (2026-03-30)

### ~~P8. 배포된 .d.ts에 devDependency 타입 누출~~ — ✅ 해결됨

**증상**: `spinner.tsx`, `radio-group.tsx`에서 `export type { SpinnerVariant } from "@cocso-ui/codegen/..."` 패턴이 `rollup-plugin-dts`에 의해 그대로 `.d.ts`에 포함됨. codegen이 `devDependency` + `private: true`이므로 외부 consumer에서 타입 resolve 불가.

**해결**: 타입 별칭을 React 소스 파일에 직접 인라인 선언. AGENTS.md에 방지 규칙 추가.

---

### ~~P9. 중복 CSS 셀렉터 미병합~~ — ✅ 해결됨

**증상**: 같은 셀렉터(e.g., `.cocso-button.cocso-button--variant-primary`)가 base/hover/active에서 각각 별도 룰 블록으로 출력. 불필요한 CSS 크기 증가.

**해결**: `formatCSS`에 `mergeRules()` 함수 추가. 동일 셀렉터의 프로퍼티를 하나의 룰 블록으로 병합. 748줄 → 607줄 (19% 감소, 13개 recipe 기준). Phase 4 완료 후 19개 recipe 기준 816 CSS lines. 409개 parity test 통과 확인.

---

### ~~P10. multi-slot recipe silent failure~~ — ✅ 해결됨

**증상**: `generateRuntime`과 `generateTypes`가 multi-slot recipe (slots.length > 1)에 대해 함수 body를 생성하지 않거나 잘못된 반환 타입을 선언. 현재 13개 recipe 모두 single-slot이라 트리거되지 않지만, `RecipeDefinition` 타입은 multi-slot을 모델링.

**해결**: multi-slot recipe에 대해 명시적 에러를 throw하도록 guard 추가. silent failure를 loud failure로 변환.
