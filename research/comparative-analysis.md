# cocso-ui vs seed-design vs kumo-ui 비교 분석

> 작성일: 2026-03-29
> 최종 업데이트: 2026-03-30
> 기준: cocso-ui codegen pipeline 전면 도입 + BaseSlotProperties 구현 후
> 비교 대상: seed-design (당근/Karrot), kumo-ui (Cloudflare)

---

## 아키텍처 개요

```
                seed-design (당근)        cocso-ui               kumo-ui (Cloudflare)
                ════════════════          ════════               ════════════════════
Token 원천       YAML (rootage DSL)       YAML (baseframe)       TypeScript config
Variant 원천     YAML + TS recipe         TS recipe (전용 pkg)    TS inline const
코드 생성        rootage AST → CSS/JS/TS  recipe → CSS/className/DTS/Figma JSON  theme-gen → CSS vars
스타일 소비       생성 CSS + className fn  생성 CSS + className fn  Tailwind v4 + cn()
Figma 동기화     양방향 (REST API sync)    단방향 (plugin + JSON)  단방향 (plugin)
상태 관리        YAML state taxonomy      recipe states           Tailwind pseudo
타입 안전성       매우 강 (생성 리터럴)     강 (생성 리터럴 + BaseSlotProperties)  강/약 혼합
```

---

## 1. 스타일 정의 방식

### seed-design: YAML DSL + 코드 생성

```yaml
# packages/rootage/components/action-button.yaml (~300줄)
variants:
  variant: { values: { brandSolid, neutralSolid, ... } }
  size: { values: { xsmall, small, medium, large } }
variant=brandSolid:
  enabled:
    root: { color: $color.bg.brand-solid }
  pressed:
    root: { color: $color.bg.brand-solid-pressed }
```

YAML 파싱 → AST → CSS/JS/TS 생성. 런타임 비용 제로. 단, 복잡한 컴포넌트의 YAML이 300줄 이상. recipe 정의(qvism-preset)와 YAML 사이의 이중 관리 부담.

### cocso-ui: TypeScript recipe + 런타임 해석

```typescript
// packages/recipe/src/recipes/button.recipe.ts (~106줄)
export const buttonRecipe = defineRecipe({
  variants: { variant: { primary: { root: { bgColor: "primary-950" } } } },
  states: { hover: { variant: { primary: { root: { bgColor: "primary-800" } } } } },
});
```

recipe 정의가 가장 간결. 13개 중 가장 복잡한 button도 ~106줄. SSOT (Single Source of Truth)이 진짜 하나의 파일. 대신 `resolveStyleMap`이 매 렌더에 실행되는 런타임 비용.

### kumo-ui: Tailwind class string + inline const

```typescript
// component 파일 내 (~20줄)
export const KUMO_BUTTON_VARIANTS = {
  variant: {
    primary: { classes: "bg-kumo-brand !text-white hover:bg-kumo-brand-hover ..." },
  },
} as const;
```

가장 간결하고 co-located. 단 class string이 타입 검증 없는 plain string. Tailwind class 오타를 컴파일 타임에 잡을 수 없음. oxlint rule로 부분 보완.

### 비교

| 기준 | seed-design | cocso-ui | kumo-ui |
|------|------------|----------|---------|
| 정의 간결성 | 낮음 (YAML 300+줄) | 높음 (TS ~106줄) | 매우 높음 (TS ~20줄) |
| 원천 수 | 2개 (YAML + recipe) | 1개 (recipe) | 1개 (VARIANTS const) |
| 동기화 리스크 | YAML ↔ recipe 불일치 가능 | 없음 (SSOT) | 없음 (SSOT) |
| 런타임 비용 | 제로 (사전 생성) | 제로 (사전 생성, codegen 도입) | cn() class merge/렌더 |
| 학습 비용 | 높음 (rootage DSL 학습) | 중간 (recipe API 학습) | 낮음 (Tailwind 지식 활용) |

---

## 2. 타입 안전성

### seed-design

```
YAML 토큰 참조 ($color.bg.brand-solid)
  → AST 파싱 시 존재 여부 검증
  → 생성된 TS: type Variant = "brandSolid" | "neutralSolid" | ...
  → 생성된 CSS: .seed-action-button--variant_brandSolid { ... }
  → Recipe: autocomplete + literal type 검증
```

모든 계층에서 타입 검증. YAML 파싱 → AST → 생성 코드 → recipe → CSS 전체 체인이 타입화.

### cocso-ui

```
recipe 정의: StyleValue 유니온 타입 (ColorTokenRef | RadiusTokenRef | ...)
  → template literal 타입: "primary-950" 유효, "invalid-999" 컴파일 에러
  → BUT 프로퍼티 key는 string (bgColor 오타 감지 불가)
  → resolver 출력: Record<string, string> (타입 정보 손실)
  → categoryOf() 휴리스틱: 런타임에 프로퍼티 분류
```

값(StyleValue)은 강타입, 키(프로퍼티 이름)는 약타입. 해석 후 출력은 string으로 평탄화.

### kumo-ui

```
variant 정의: as const + keyof typeof (variant 값 강타입)
  → Tailwind class string (타입 없는 plain string)
  → cn() merge 결과도 string
  → 보완: oxlint no-primitive-colors, enforce-variant-standard rules
```

variant 값은 강타입, class 문자열은 무타입. lint rule이 안전망.

### 비교

| 검증 지점 | seed-design | cocso-ui | kumo-ui |
|-----------|------------|----------|---------|
| 토큰 참조 유효성 | YAML 파싱 시 | template literal 타입 | lint rule |
| 프로퍼티 이름 | 생성된 리터럴 유니온 | `BaseSlotProperties` (35개 타입화) + index signature 폴백 | Tailwind class (무검증) |
| Variant 값 | 생성된 리터럴 유니온 | 생성된 리터럴 유니온 (codegen) | `as const` keyof |
| 해석 출력 | 타입화된 CSS 변수 | 생성된 className 함수 (리터럴 유니온 타입) | className (string) |
| Recipe → 실제 CSS | 1:1 생성 보장 | 1:1 생성 보장 (codegen, CI freshness gate) | 직접 참조 (Tailwind) |

**cocso-ui 위치 (업데이트)**: codegen 도입으로 seed-design과 동등한 수준의 타입 안전성 달성. `BaseSlotProperties`로 프로퍼티 이름도 타입화. `categoryOf()` 휴리스틱은 Figma resolver에서 여전히 활용.

---

## 3. Figma 통합

### seed-design: 양방향 sync + codegen plugin

```
Figma → Code (figma-extractor):
  Figma REST API → NormalizedSceneNode → GitHub Actions daily sync → Draft PR

Code → Figma (Codegen Plugin):
  Designer selects component → Plugin reads Figma properties
  → ComponentHandler maps to React props → JSX output

특징:
- 양방향: 디자이너가 Figma에서 토큰 변경 → CI가 코드에 반영
- ComponentHandler 패턴: 컴포넌트별 매핑 로직 타입화
- 약점: Figma 명명 규칙(emoji prefix)에 의존, 복잡한 shape codegen 불가
```

### cocso-ui: recipe → ComponentSetNode

```
Code → Figma:
  recipe → resolveForFigma(recipe, combo, { state })
  → FigmaNodeSpec + _tokenRefs
  → addStateVariants() → figma.combineAsVariants()
  → ComponentSetNode (단일 컴포넌트, 모든 variant + state)
  → createBoundPaint() → Figma Variable 바인딩

특징:
- _tokenRefs로 토큰 이름 직접 전달 (역방향 조회 없음)
- golden matrix: React ↔ Figma resolver 패리티 자동 검증 (CI)
- ComponentSetNode per component: 디자이너가 variant panel에서 전환
- 약점: Figma → Code 경로 없음 (단방향)
```

### kumo-ui: Tailwind parser → Figma node

```
Code → Figma:
  KUMO_*_VARIANTS → variant-parser.ts (regex)
  → component-registry.json
  → parseTailwindClasses() → Figma attributes
  → ComponentSet (light + dark sections)
  → bindFillToVariable() → Figma Variable 바인딩

특징:
- destructive sync: Figma 상태를 매번 코드 기준으로 덮어씀
- Tailwind class → Figma 속성 변환은 regex 기반 (불완전)
- drift detection CI test
- 약점: parser가 임의 값, 반응형 접두사 미지원
```

### 비교

| 기능 | seed-design | cocso-ui | kumo-ui |
|------|------------|----------|---------|
| 방향 | 양방향 | 단방향 | 단방향 |
| Token binding | Figma Variables (REST) | `_tokenRefs` → `createBoundPaint` | `bindFillToVariable` |
| Component 생성 | Figma → React codegen | recipe → ComponentSetNode | Tailwind → Figma node |
| State 표현 | Figma property (designer UI) | ComponentSetNode variant | light/dark section |
| 패리티 검증 | 없음 (codegen이므로 불필요) | golden matrix (0 MISMATCH) | drift detection |
| State parsing | YAML에서 선언 | recipe states에서 직접 해석 | Tailwind class regex 파싱 |

**cocso-ui 차별점**:
- **Golden matrix**는 세 프로젝트 중 유일. React resolver와 Figma resolver의 출력을 속성 수준에서 비교.
- **`_tokenRefs` 정방향 전달**이 kumo-ui의 regex 파싱보다 정확. kumo는 `parseTailwindClasses("hover:bg-kumo-brand-hover")`에서 hover state를 regex로 추출하는데, 복잡한 표현식에서 실패할 수 있음.
- **ComponentSetNode**으로 디자이너가 variant panel에서 State를 직접 전환 가능. kumo는 light/dark section 분리 방식.

---

## 4. 상태 관리

### seed-design

```yaml
# 4단계 state taxonomy
variant=brandSolid:
  enabled:   { root: { color: $color.bg.brand-solid } }
  pressed:   { root: { color: $color.bg.brand-solid-pressed } }
  disabled:  { root: { color: $color.bg.disabled } }
  loading:   { root: { color: $color.bg.brand-solid } }
```

- 모든 variant × state 조합을 YAML에서 명시적 선언
- CSS 생성: `@media (hover: hover)` + `@media (hover: none)` 분리
- mobile-first: 터치에서 hover sticky 방지
- pseudo utility: `engaged`, `disabled`, `loading` → CSS pseudo selector 자동 매핑

### cocso-ui

```typescript
// recipe states
states: {
  hover: { variant: { primary: { root: { bgColor: "primary-800" } } } },
  active: { variant: { primary: { root: { bgColor: "primary-700" } } } },
}
// Figma: addStateVariants() → ComponentSetNode State=Default/Hover/Active
```

- recipe states로 선언, resolver가 해석
- orthogonal dimensions: checkbox(State × Status), switch(State × Checked × Variant)
- 8개 recipe에 states 정의 (button, link, checkbox, input, select, radio, switch, pagination)
- `@media (hover: hover)` 분리 없음 (P7 개선 과제)

### kumo-ui

```typescript
// Tailwind pseudo selector 인라인
"hover:bg-kumo-brand-hover disabled:cursor-not-allowed focus:ring-kumo-focus"
```

- Tailwind `:` modifier로 state 표현
- 명시적 state taxonomy 없음
- 구조화되지 않아 state 누락 감지 어려움

### 비교

| 기준 | seed-design | cocso-ui | kumo-ui |
|------|------------|----------|---------|
| State 정의 | YAML 명시적 4단계 | recipe states (2-3단계) | Tailwind class inline |
| Mobile 대응 | `@media (hover: hover)` | 없음 (개선 과제) | Tailwind 자동 |
| 교차 상태 | flat list | orthogonal dimensions | 없음 |
| State 누락 감지 | YAML 스키마 검증 | golden matrix STATE_UNSUPPORTED gate | drift detection |
| Loading state | 지원 | 미지원 | 미지원 |

**cocso-ui의 orthogonal state dimensions** (State × Checked, State × Status)는 세 프로젝트 중 유일한 접근. seed-design은 flat state list로 모든 조합을 수동 열거하고, kumo-ui는 구조화 없이 class string에 나열. cocso-ui는 compoundVariants로 교차 조건을 처리하여 조합 폭발을 피함.

---

## 5. 빌드 파이프라인

### seed-design

```
rootage YAML → AST parser → codegen
  → packages/css/recipes/*.css (순수 CSS)
  → packages/css/recipes/*.mjs (className 함수)
  → packages/css/recipes/*.d.ts (타입)
  → packages/react (소비)

엄격한 순서: rootage → qvism → css → react
빌드 시간: 전체 생성 필요 (incremental 지원)
```

### cocso-ui

```
baseframe YAML → generate-tokens.ts → tokens.json
recipe TS → 빌드 없음 (tsc만)
figma: tokens.json + recipe → plugin bundle

순서: baseframe → recipe build → figma generate
빌드 시간: 가벼움 (recipe는 tsc, figma는 esbuild)
```

### kumo-ui

```
config.ts → theme-generator → theme-kumo.css (CSS vars)
KUMO_*_VARIANTS → variant-parser.ts → component-registry.json
Tailwind v4: theme.css 읽고 JIT 생성

순서: config → theme-gen → Tailwind (병렬 가능)
빌드 시간: 가벼움 (Tailwind v4 JIT)
```

### 비교

| 기준 | seed-design | cocso-ui | kumo-ui |
|------|------------|----------|---------|
| 빌드 복잡도 | 높음 (순서 엄격) | 중간 (recipe build → codegen → react) | 낮음 |
| 코드 생성 필요 | 필수 | 필수 (recipe → CSS/className/DTS) | CSS vars만 |
| Incremental build | 지원 | CI freshness gate (git diff) | Tailwind JIT |
| CI 시간 영향 | 중간 | 낮음 (816 CSS lines, 빠른 생성) | 낮음 |

---

## 6. 확장성

| 기준 | seed-design | cocso-ui | kumo-ui |
|------|------------|----------|---------|
| 새 컴포넌트 추가 | YAML + recipe + handler | recipe + codegen generate + generator | VARIANTS const + generator |
| 새 토큰 추가 | YAML 한 줄 | baseframe YAML | config.ts 한 줄 |
| 새 variant 추가 | YAML + recipe 동기화 | recipe 한 곳 (SSOT) | VARIANTS 한 곳 |
| 새 state 추가 | YAML state 블록 | recipe states + golden matrix 자동 검증 | class string에 추가 |
| 20+ 컴포넌트 | 검증됨 (당근 프로덕션) | 미검증 (현재 19) | 검증됨 (37 generators) |
| 다크 모드 | 지원 (YAML modes) | 미지원 (계획됨) | 지원 (light-dark()) |

---

## 7. 종합 점수

```
               타입안전  DX     런타임   Figma통합  State관리  확장성   SSOT순도  컴포넌트커버리지  테스트체계
seed-design    ★★★★★  ★★★   ★★★★★  ★★★★    ★★★★★  ★★★★   ★★★    ★★★★          ★★★
cocso-ui       ★★★★   ★★★★  ★★★★★  ★★★★    ★★★★   ★★★★   ★★★★★  ★★★           ★★★★★
kumo-ui        ★★★    ★★★★★ ★★★★   ★★★     ★★★    ★★★★   ★★★★   ★★★★★         ★★
```

> **점수 변경 내역 (2026-03-30, Phase 4 완료 후)**
>
> - **확장성 ★★★→★★★★**: 20 recipes 실증 완료. recipe 903줄 → CSS 836줄 (20개 파일) 생성 검증. "13개에서 30개로 갈 때"라는 이전 전망이 20개 달성으로 현실화됨. seed-design(30+)·kumo-ui(39)는 여전히 우위.
>
> - **컴포넌트커버리지 (신규 차원)**: 절대 수 기준 cocso-ui 20 recipes / 30 React components ★★★ — seed-design ~30+ ★★★★ — kumo-ui 39 ★★★★★. 단, cocso-ui의 30 React components 중 10개는 recipe 없이 독립 구현(accordion, day-picker, dropdown, field, month-picker, OTP field, popover, tab, toast, tooltip)이어서 SSOT 커버리지는 67%(20/30).
>
> - **테스트체계 (신규 차원)**: cocso-ui ★★★★★ — 3개 CI gate 실증. (1) golden-matrix: 모든 recipe에 대해 React resolver ↔ Figma resolver 속성 수준 비교. (2) inline-type-sync: Spinner/RadioGroup codegen 생성 타입 동기화 검증. (3) multi-slot pre-validation guard: slot 선언 전 조기 차단. seed-design ★★★ (YAML 스키마 검증). kumo-ui ★★ (drift-detection 단일 게이트).
>
> - **이전 변경 유지**: 타입안전 ★★★★ (codegen 생성 리터럴 유니온 + BaseSlotProperties), 런타임 ★★★★★ (빌드 타임 CSS 생성, 제로 런타임 해석).

---

## 8. cocso-ui가 잘 하고 있는 것

1. **Recipe SSOT 순도 (★★★★★)**: 진짜 하나의 파일이 진실의 원천. 20개 recipe 파일(평균 45줄, 최대 113줄)이 CSS·className·DTS·Figma JSON을 모두 공급. seed-design은 YAML+recipe 이중 관리, kumo-ui는 component 파일에 분산 co-located.

2. **테스트체계 깊이 (★★★★★)**: 세 시스템 중 가장 많은 3개 CI gate. golden-matrix로 React↔Figma resolver 패리티를 속성 수준에서 검증하는 것은 seed-design·kumo-ui 어디에도 없는 구조. inline-type-sync gate는 codegen 결과물이 소스에서 떠내려가는 drift를 컴파일 시점에 차단.

3. **Golden matrix**: 20개 recipe 전체에 대해 React resolver 출력과 Figma resolver 출력을 비교. VALUE_MISMATCH·STATE_UNSUPPORTED가 0이어야 CI 통과.

4. **`_tokenRefs` 정방향 바인딩**: resolver가 토큰 이름을 직접 전달. kumo-ui는 Tailwind class string에서 regex로 추출(복잡 표현식에서 실패 가능), seed-design은 YAML 참조를 AST로 해석. cocso-ui가 가장 직접적이고 오류 범위가 작음.

5. **Orthogonal state dimensions**: checkbox(State × Status), switch(State × Checked × Variant) 패턴이 compoundVariants로 구현됨. seed-design은 모든 교차 상태를 YAML에 수동 열거, kumo-ui는 구조화 없이 class string에 나열. cocso-ui만 조합 폭발 없이 N×M 상태를 표현.

6. **정의 간결성**: button recipe 113줄 vs seed-design ActionButton YAML 300+줄. 동일한 시각 사양을 1/3 미만 분량으로 표현. 20개 recipe 전체 합계 903줄 — recipe당 평균 45줄.

7. **컴포넌트 계층 분리**: 20 recipes(SSOT) + 10 headless-only components(recipe 없는 독립 구현) 구조가 recipe 도입 여부를 컴포넌트 복잡도에 따라 선택적으로 결정할 수 있게 함.

## 9. cocso-ui가 배울 수 있는 것

### seed-design에서

1. ~~**제로 런타임 CSS 생성**~~: ✅ 달성 — `@cocso-ui/codegen`이 빌드 타임 CSS를 생성하여 런타임 해석 제거.

2. **`@media (hover: hover)` 분리**: mobile-first hover 처리는 CSS Module 수정만으로 도입 가능. seed-design의 pseudo utility 패턴이 참고 자료.

3. **양방향 Figma sync**: figma-extractor + daily CI sync로 디자이너 변경을 자동 감지. cocso-ui가 디자이너 협업을 강화하려면 이 경로가 필요.

4. ~~**프로퍼티 이름 타입화**~~: ✅ 달성 — `BaseSlotProperties` (35개 프로퍼티)로 recipe 작성 시 자동완성 + 타입 검증.

### kumo-ui에서

1. **Lint rule 기반 안전망**: oxlint `no-primitive-colors`, `enforce-variant-standard` 패턴. cocso-ui도 biome 커스텀 rule로 recipe 컨벤션 강제 가능.

2. **Destructive Figma sync**: "Figma 상태 = 코드 상태" 보장. cocso-ui의 Figma plugin은 이미 이 방식이지만, 명시적 policy로 문서화하면 디자이너 기대 관리에 유용.

3. **다크 모드 `light-dark()` 함수**: CSS Level 5의 `light-dark()` 함수로 단일 CSS 파일에서 테마 전환. cocso-ui의 다크 모드 계획 시 참고.

---

## 10. cocso-ui의 전략적 위치

cocso-ui는 Phase 4 완료 후 20 recipes + 30 React components 규모로 성장하여, seed-design의 "모든 것을 생성" 접근과 동등한 빌드 타임 파이프라인을 갖추면서 recipe SSOT 순도와 golden matrix 패리티 검증이라는 독자적 강점을 유지.

**핵심 강점**: (1) recipe 하나로 React와 Figma를 모두 공급하는 SSOT 순도 (★★★★★). (2) 3개 CI gate(golden matrix, inline-type-sync, multi-slot guard)로 패리티를 자동 검증하는 체계 (★★★★★). 이 두 가지는 seed-design과 kumo-ui 어디에도 없는 cocso-ui만의 것.

**잔여 격차**:

| 격차 항목 | 현황 | 다음 단계 |
|-----------|------|-----------|
| 컴포넌트 수 | 19 recipes, 29 React | 추가 recipe 커버리지 확대 |
| ~~`@media (hover: hover)` 분리~~ | ✅ 완료 | — |
| ~~Semantic 토큰 마이그레이션~~ | ✅ 완료 (52개 semantic 토큰, 19개 recipe 전체 primitive 0건) | — |
| 다크 모드 | 미지원 (semantic 토큰 인프라 완성, 즉시 착수 가능) | `light-dark()` 함수 + token.css semantic 값 교체 |
| 양방향 Figma sync | 단방향 | figma-extractor + CI daily sync |

**권고 우선순위**:
1. (단기) 다크 모드 — semantic 토큰 인프라 완성으로 `light-dark()` 함수 기반 즉시 착수 가능
2. (중기) 양방향 Figma sync — 디자이너 협업 강화
3. (장기) table/data-table — XL 복잡도, 별도 프로젝트 문서 필요

**요약**: 19 recipes로 실증된 codegen 파이프라인 + 52개 semantic 토큰 체계 완성, 세 시스템 중 가장 깊은 테스트체계, SSOT 순도 최고. 다크 모드가 성숙도의 마지막 관문.
