# cocso-ui 스타일 시스템 리팩토링 전략

> 작성일: 2026-03-28
> 최종 업데이트: 2026-03-30
> 상태: **전체 완료** — Phase 1~2.5 (방향 A) + Phase 3 (BaseSlotProperties) + Phase 4 (Direction B 코드 생성 전면 도입) + Phase 4 신규 컴포넌트 (avatar, card, alert, progress, breadcrumb, skeleton) 모두 달성. `@cocso-ui/codegen` 패키지가 빌드 타임에 CSS/className/타입을 생성하고, React는 생성된 산출물만 소비 (런타임 recipe 의존성 제거). Figma도 pre-resolved JSON descriptor를 소비. codegen 파이프라인이 19 recipe 규모에서 실증됨 (816 CSS lines, 409 parity tests).
> 기반 조사: research-seed-design.md, research-kumo-ui.md, research-cocso-ui.md
> 후속 문서: cocso-ui-issues-and-improvements.md (현재 문제점 및 개선 과제), comparative-analysis.md (seed-design/kumo-ui 비교)

---

## 현재 문제 진단

cocso-ui의 recipe 시스템은 **내부적으로 풍부한 타입 정보**를 가지고 있으나, **해석 경계(resolution boundary)에서 모든 의미론적 정보가 손실**된다.

### 문제 1: StyleValue의 풍부한 타입이 해석 후 사라짐

Recipe 정의 시점에는 정교한 유니온 타입이 존재한다:

```typescript
// packages/recipe/src/types.ts:68-76
export type StyleValue =
  | ColorTokenRef    // "primary-950", "neutral-100" 등
  | RadiusTokenRef   // "radius-1" ~ "radius-full"
  | SpacingTokenRef  // "spacing-4" 등
  | FontWeightRef    // "semibold", "bold" 등
  | CSSLiteral       // "none", "100%" 등
  | number           // 40 → "40px"
  | CompoundBorder   // { _type: "border", color, style, width }
  | ComponentRef;    // 컴포넌트 간 참조
```

그러나 React resolver의 출력은:

```typescript
// packages/recipe/src/resolvers/react.ts:76
export function resolveForReact(...): Record<string, string> {
  // "primary-950" (ColorTokenRef) → "var(--cocso-color-primary-950)" (string)
  // 40 (number) → "40px" (string)
  // 모든 것이 string으로 평탄화됨
}
```

### 문제 2: CSS 프로퍼티 이름이 비타입화

```typescript
// packages/recipe/src/types.ts:79
export type SlotStyles = Record<string, StyleValue>;
//                              ^^^^^^ 단순 string — 어떤 키든 허용
```

`bgColor`, `fontColor`, `height`, `paddingInline` 등의 프로퍼티 이름은 타입으로 제한되지 않는다. 이로 인해:
- 오타(`bgColr`)를 컴파일 타임에 잡을 수 없음
- `bgColor`에 숫자 `40`을 할당해도 타입 에러 없음 (`bgColor: 40` 허용)

### ~~문제 3: Figma resolver가 프로퍼티 종류를 추론하기 위해 하드코딩에 의존~~ (해결됨)

**해결**: `COLOR_KEYS`, `isColorKey`, `isRadiusKey`를 제거하고, `@cocso-ui/recipe/utils/property-categories`의 `categoryOf()` 함수로 교체.
- 명시적 맵(8개 color + 2개 radius) + 이름 기반 휴리스틱 추론(`key.includes("color")` 등)
- `Object.hasOwn()` 가드로 prototype pollution 방지
- 27개 단위 테스트 커버리지
- PR: cocso/cocso-ui#148

### ~~문제 4: Figma에서 hover/active 상태 미표현~~ (해결됨)

**해결**: `resolveForFigma`에 `options?: FigmaResolveOptions` 추가. `{ state: "hover" }` 또는 `{ state: "active" }`로 상태별 오버라이드 적용.
- React resolver의 `applyStateOverrides`와 동일 패턴
- 6개 테스트 (hover/active, 전체 variant, unknown state, stateless recipe)
- PR: cocso/cocso-ui#148

참고로 React는 상태를 지원한다:

```typescript
// packages/recipe/src/resolvers/react-styles.ts:89-100
for (const state of options?.states ?? []) {
  const stateResolved = resolveForReact(recipe, variants, { state });
  // hover, active 키 추가
}
```

Button recipe에는 8개 variant x 2개 상태(hover, active)의 풍부한 데이터가 존재하지만 (`button.recipe.ts:82-106`), Figma에서는 접근 불가.

### ~~문제 5: Figma에서 토큰 이름 손실~~ (해결됨)

**해결**: `FigmaNodeSpec._tokenRefs?: Record<string, string>` 필드 추가. 색상/반경 토큰 해석 시 원본 토큰 이름을 함께 기록.
- 예: `{ bgColor: "primary-950", borderRadius: "radius-4", strokeColor: "neutral-100" }`
- `Object.freeze(tokenRefs)`로 소비자 mutation 방지
- `Reflect.deleteProperty()`로 덮어쓰기 시 stale ref 정리
- 7개 테스트 커버리지
- PR: cocso/cocso-ui#148

### 영향 범위

| 영역 | 개수 | 파일 위치 |
|------|------|-----------|
| Recipe 정의 | 13개 | `packages/recipe/src/recipes/*.ts` |
| React 소비자 | 10개 | `packages/react/src/components/*/` (resolveStyleMap 사용) |
| Figma 생성기 | 13개 | `packages/figma/src/generators/components/` |
| CSS Module | 10개 | `packages/react/src/components/*/*.module.css` |

---

## 방향 A: Resolver 출력 강화 (Evolutionary)

### 개요

현재의 recipe 중심 아키텍처를 유지하면서, **해석 경계에서 프로퍼티 카테고리 메타데이터를 보존**하는 타입화된 중간 표현(Typed Intermediate Representation)을 도입한다.

### 핵심 변경

#### 1. 타입화된 프로퍼티 정의 도입

```typescript
// 새로운 타입 정의 (packages/recipe/src/types.ts 확장)
type PropertyCategory = "color" | "radius" | "spacing" | "dimension" | "fontWeight" | "cssLiteral" | "border";

interface TypedProperty<C extends PropertyCategory, V extends StyleValue> {
  category: C;
  value: V;
}

// 사용 예:
type ColorProperty = TypedProperty<"color", ColorTokenRef>;
type DimensionProperty = TypedProperty<"dimension", number>;
type RadiusProperty = TypedProperty<"radius", RadiusTokenRef | CSSLiteral>;
```

#### 2. SlotStyles 타입화 (두 가지 접근 가능)

**접근 2a — 프로퍼티별 카테고리 어노테이션 (최소 변경)**:
```typescript
// 기존: Record<string, StyleValue>
// 변경: 값에 카테고리 메타데이터를 함께 전달하는 헬퍼 함수
const color = (v: ColorTokenRef) => ({ _cat: "color" as const, value: v });
const dim = (v: number) => ({ _cat: "dimension" as const, value: v });

// Recipe에서:
primary: { root: { bgColor: color("primary-950"), height: dim(40) } }
```

**접근 2b — 프로퍼티 이름 기반 자동 추론 (무변경 마이그레이션)**:
```typescript
// 프로퍼티 이름 → 카테고리 매핑을 중앙화
const PROPERTY_CATEGORY_MAP: Record<string, PropertyCategory> = {
  bgColor: "color", fontColor: "color", borderColor: "color",
  height: "dimension", paddingInline: "dimension", fontSize: "dimension",
  borderRadius: "radius", cornerRadius: "radius",
  fontWeight: "fontWeight",
};
```

#### 3. Figma resolver 개선

```typescript
// COLOR_KEYS 제거, 카테고리 메타데이터 사용
function applyStyleValue(spec: MutableSpec, key: string, value: StyleValue, category: PropertyCategory): void {
  switch (category) {
    case "color": spec[key] = resolveColorToken(value as string); break;
    case "radius": spec[key] = resolveRadiusToken(value as string); break;
    case "dimension": spec[key] = value; break;
    // ...
  }
}
```

#### 4. Figma 상태 지원 추가

```typescript
// resolveForFigma에 state 파라미터 추가
export function resolveForFigma(recipe, variants, options?: { state?: string }): FigmaNodeSpec {
  // react-styles.ts:89-100 패턴과 동일한 상태 오버라이드 로직
}
```

#### 5. Figma 토큰 이름 보존

```typescript
// FigmaNodeSpec에 토큰 참조 보존 필드 추가
interface FigmaNodeSpecWithTokens extends FigmaNodeSpec {
  _tokenRefs?: Record<string, string>; // key → 토큰 이름 매핑
}
```

### 마이그레이션 범위

| 변경 대상 | 범위 | 하위 호환 |
|-----------|------|-----------|
| `packages/recipe/src/types.ts` | 타입 추가/확장 | 기존 타입 유지 가능 |
| `packages/recipe/src/recipes/*.ts` (13개) | 접근 2b면 무변경, 2a면 헬퍼 함수 적용 | 2b는 완전 호환 |
| `packages/recipe/src/resolvers/react.ts` | 내부 로직 변경, 출력 타입은 유지 | `Record<string, string>` 출력 유지 |
| `packages/recipe/src/resolvers/react-styles.ts` | 변경 없음 | 완전 호환 |
| `packages/figma/src/generators/recipe-resolver.ts` | 카테고리 기반으로 리팩토링 | 내부 변경 |
| `packages/react/src/components/` (10개) | **변경 없음** | 완전 호환 |
| `packages/react/src/components/*/*.module.css` (10개) | **변경 없음** | 완전 호환 |

### 장점

1. **하위 호환성**: React 컴포넌트와 CSS Module 변경 불필요
2. **점진적 마이그레이션**: 프로퍼티 카테고리를 단계적으로 추가 가능
3. **낮은 리스크**: 기존 아키텍처 유지, 해석 로직만 개선
4. **Figma 즉시 개선**: `COLOR_KEYS` 하드코딩 제거, 상태 지원, 토큰 이름 보존
5. **코드 생성으로의 진화 경로**: 타입화된 중간 표현이 향후 코드 생성의 입력이 될 수 있음

### 단점

1. **런타임 해석 비용 유지**: 여전히 매 렌더에서 `resolveStyleMap` 실행
2. **React 출력은 여전히 `Record<string, string>`**: 소비 측에서 키 존재를 타입으로 보장하지 못함
3. **프로퍼티 카테고리 유지 부담**: 새 프로퍼티 추가 시 카테고리 등록 필요 (접근 2b)
4. **근본적 한계**: `SlotStyles`의 키가 `string`인 문제는 접근 2a를 선택하지 않으면 해결되지 않음

---

## 방향 B: 코드 생성 (seed-design 패턴)

### 개요

seed-design의 아키텍처를 참고하여, recipe 정의에서 **빌드 타임에 CSS, JS 런타임, TypeScript 타입, Figma 디스크립터를 생성**한다. 런타임 해석을 완전히 제거한다.

### 핵심 변경

#### 1. 코드 생성 파이프라인 구축

```
packages/recipe/src/recipes/*.ts (기존 recipe 정의)
    ↓ pnpm recipe:generate
packages/css/recipes/
    ├─ button.css          (순수 CSS — BEM-like 클래스)
    ├─ button.mjs          (className 합성 함수)
    ├─ button.d.ts         (타입 정의)
    └─ button.figma.json   (Figma용 타이핑된 디스크립터)
```

#### 2. 생성 CSS 예시

```css
/* 생성됨: packages/css/recipes/button.css */
.cocso-button { display: inline-flex; align-items: center; /* base */ }
.cocso-button--variant_primary {
  background-color: var(--cocso-color-primary-950);
  color: var(--cocso-color-white);
}
.cocso-button--variant_primary:hover {
  background-color: var(--cocso-color-primary-800);
}
.cocso-button--size_medium { height: 36px; padding-inline: 12px; font-size: 14px; }
```

#### 3. 생성 JS 런타임 예시

```typescript
// 생성됨: packages/css/recipes/button.d.ts
interface ButtonVariant {
  variant: "primary" | "secondary" | "outline" | "ghost" | "success" | "error" | "warning" | "info";
  size: "large" | "medium" | "small" | "x-small";
  shape: "square" | "circle" | "rounded";
}
export declare const button: (props?: Partial<ButtonVariant>) => string;
```

#### 4. React 소비 방식 변경

```typescript
// 현재 (button.tsx:65-69):
const resolved = resolveStyleMap(buttonRecipe, { variant, size, shape }, { states: ["hover", "active"] });
const style = { ..._style, ...resolved, ... } as CSSProperties;
<button style={style} className={styles.button}>

// 변경 후:
import { button } from "@cocso-ui/css/recipes/button";
const recipeClassName = button({ variant, size, shape });
<button className={cn(recipeClassName, className)}>
```

#### 5. 생성 Figma 디스크립터

```json
{
  "variant=primary,size=medium,shape=square": {
    "properties": {
      "bgColor": { "category": "color", "tokenRef": "primary-950", "rgb": [0.05, 0.05, 0.14] },
      "fontColor": { "category": "color", "tokenRef": "white", "rgb": [1, 1, 1] },
      "height": { "category": "dimension", "value": 36 },
      "borderRadius": { "category": "radius", "tokenRef": "radius-4", "value": 8 }
    },
    "states": {
      "hover": { "bgColor": { "category": "color", "tokenRef": "primary-800", "rgb": ["..."] } },
      "active": { "bgColor": { "category": "color", "tokenRef": "primary-700", "rgb": ["..."] } }
    }
  }
}
```

### 마이그레이션 범위

| 변경 대상 | 범위 | 하위 호환 |
|-----------|------|-----------|
| 새 패키지/도구 | 코드 생성기 구축 (신규) | 해당 없음 |
| `packages/recipe/src/recipes/*.ts` (13개) | 구조 변경 가능성 | recipe 자체는 유지 가능 |
| `packages/react/src/components/` (10개) | **전면 재작성** — style injection -> className | **호환 불가** |
| `packages/react/src/components/*/*.module.css` (10개) | **삭제** — 생성 CSS로 대체 | **호환 불가** |
| `packages/figma/src/generators/recipe-resolver.ts` | **삭제** — 생성 JSON으로 대체 | 내부 변경 |
| `packages/figma/src/generators/components/` (13개) | 생성 JSON 기반으로 재작성 | 내부 변경 |
| 빌드 파이프라인 | `turbo.json` + `package.json` scripts 추가 | 설정 변경 |

### 장점

1. **런타임 비용 제로**: 사전 생성된 CSS + className 반환 함수만 사용
2. **최강 타입 안전성**: 생성된 타입이 유니온 리터럴로 모든 variant 값 제한
3. **Figma 완벽 지원**: 생성된 JSON에 카테고리, 토큰 이름, 상태, RGB 모두 포함
4. **seed-design 검증된 패턴**: 당근(Karrot)에서 프로덕션 사용 중인 아키텍처
5. **CSS 표준 준수**: 순수 CSS 파일로 프레임워크 독립적

### 단점

1. **초기 투자 비용 높음**: 코드 생성기 구축 (2-4주), React 컴포넌트 전면 재작성 (2-3주)
2. **빌드 파이프라인 복잡도**: `recipe -> CSS/JS/DTS/JSON` 생성 단계 추가, 순서 의존성
3. **디버깅 어려움**: 생성된 CSS에서 문제 발생 시 원천(recipe)과 생성기 양쪽 확인 필요
4. **프로토타이핑 속도 저하**: 스타일 변경 -> 생성 -> 확인 주기
5. **현재 CSS Module 패턴과 단절**: 인라인 스타일 + CSS custom property 방식 완전 포기
6. **seed-design과의 차이**: seed-design은 rootage(YAML DSL)라는 추가 원천이 있어 recipe와 1:1 대응이 아님

---

## 방향 C: Tailwind + 인라인 배리언트 (kumo-ui 패턴)

### 개요

kumo-ui의 아키텍처를 참고하여, **Tailwind CSS v4 유틸리티 클래스 기반**으로 전환하고 variant 정의를 컴포넌트 파일에 인라인으로 배치한다.

### 핵심 변경

#### 1. 테마 토큰 재정의

```typescript
// 새로운 config 구조
export const THEME_CONFIG = {
  color: {
    "cocso-primary-950": { light: "oklch(21% 0.04 270)", dark: "..." },
    "cocso-neutral-50": { light: "oklch(98% 0.001 260)", dark: "..." },
  },
  // -> 자동 생성: theme-cocso.css (CSS 변수) -> Tailwind v4 유틸리티
};
```

#### 2. 컴포넌트 내 인라인 배리언트

```typescript
// packages/react/src/components/button/button.tsx (완전 재작성)
export const COCSO_BUTTON_VARIANTS = {
  variant: {
    primary: {
      classes: "bg-cocso-primary-950 text-white hover:bg-cocso-primary-800 active:bg-cocso-primary-700",
      description: "Primary action button",
    },
    secondary: {
      classes: "bg-cocso-neutral-50 text-cocso-neutral-600 hover:bg-cocso-neutral-100",
      description: "Secondary action button",
    },
  },
  size: {
    medium: { classes: "h-9 px-3 text-sm rounded-lg", description: "Default size" },
    // ...
  },
} as const;
```

#### 3. cn() 기반 소비

```typescript
export function buttonVariants({ variant = "primary", size = "medium" }) {
  return cn(
    "inline-flex items-center justify-center cursor-pointer transition-colors",
    COCSO_BUTTON_VARIANTS.variant[variant].classes,
    COCSO_BUTTON_VARIANTS.size[size].classes,
  );
}
```

#### 4. Figma 파이프라인 재구축

```
COCSO_*_VARIANTS -> variant-parser.ts (regex 추출) -> component-registry.json
    -> Figma Plugin: parseTailwindClasses("bg-cocso-primary-950 h-9 px-3 rounded-lg")
    -> { fillVariable: "color-cocso-primary-950", height: 36, ... }
```

### 마이그레이션 범위

| 변경 대상 | 범위 | 하위 호환 |
|-----------|------|-----------|
| `packages/recipe/` | **전체 삭제** | **호환 불가** |
| `packages/css/` | 테마 토큰 -> CSS 변수 -> Tailwind 전환 | **호환 불가** |
| `packages/react/src/components/` (모두) | **전면 재작성** | **호환 불가** |
| `packages/react/src/components/*/*.module.css` (모두) | **전체 삭제** | **호환 불가** |
| `packages/figma/` | **전면 재작성** — Tailwind 파서 필요 | **호환 불가** |
| 빌드 인프라 | Tailwind v4 설정, 테마 코드젠 | 설정 재구축 |
| 린트 규칙 | 시맨틱 토큰 강제 린트 규칙 신규 작성 | 신규 |
| 테스트 | 모든 스냅샷/유닛 테스트 재작성 | **호환 불가** |

### 장점

1. **DX 우수**: Tailwind의 유틸리티 클래스는 빠른 프로토타이핑에 최적
2. **상태 표현 자연스러움**: `hover:bg-cocso-primary-800` — CSS pseudo 클래스가 Tailwind에 내장
3. **강력한 생태계**: tailwind-merge, clsx, Tailwind IntelliSense 등
4. **Figma 상태 파싱 가능**: `hover:` 접두사를 파싱하여 Figma에 상태 정보 전달 (kumo-ui 검증)
5. **다크 모드 단순화**: CSS `light-dark()` 함수로 처리, `dark:` 접두사 불필요
6. **응집도**: 배리언트 정의와 컴포넌트가 같은 파일에 존재

### 단점

1. **완전한 재작성**: 모든 패키지가 영향을 받음 (recipe 삭제, CSS 재구축, 컴포넌트 재작성, Figma 재구축)
2. **Tailwind 클래스 문자열은 비타입**: `"bg-cocso-prmiary-950"` (오타)를 타입 시스템이 잡지 못함
3. **Recipe의 선언적 순수성 상실**: "variant X일 때 bgColor는 primary-950" 같은 명시적 매핑이 Tailwind 클래스 문자열에 묻힘
4. **Figma 파서 복잡도**: 모든 Tailwind 유틸리티의 Figma 변환 로직을 새로 작성해야 함
5. **토큰-프로퍼티 매핑 암묵적**: `bg-cocso-primary-950`은 "배경색이 primary-950"이라는 것을 파서가 추론해야 함
6. **기존 투자 손실**: 13개 recipe + resolver 시스템의 설계 투자가 완전히 소멸
7. **학습 곡선**: Tailwind v4 + Base UI 패턴 학습 필요

---

## 비교 매트릭스

| 평가 기준 | 방향 A (Evolutionary) | 방향 B (코드 생성) | 방향 C (Tailwind) |
|-----------|:--------------------:|:------------------:|:-----------------:|
| **마이그레이션 노력** | 중 (2-4주) | 대 (6-10주) | 최대 (8-12주) |
| **파괴적 변경 범위** | 낮음 (Figma 내부만) | 높음 (React 전면) | 최고 (전체 시스템) |
| **Figma 파이프라인 개선** | 높음 | 최고 | 높음 |
| **타입 안전성 개선** | 중-높음 | 최고 | 낮음 (문자열 기반) |
| **런타임 성능** | 현상 유지 | 최고 (제로 런타임) | 좋음 (Tailwind JIT) |
| **팀 학습 곡선** | 낮음 | 중 (코드젠 이해) | 높음 (패러다임 전환) |
| **기존 코드 재사용** | 최고 | 중 (recipe 유지) | 최저 |
| **프로토타이핑 속도** | 현상 유지 | 약간 저하 | 향상 |
| **Figma 상태 지원** | 가능 | 가능 | 가능 |
| **토큰 이름 보존 (Figma)** | 가능 | 가능 | 가능 |
| **향후 확장성** | 높음 (B로 진화 가능) | 최고 | 높음 (Tailwind 생태계) |

---

## 추천 방향 및 근거

### 추천: 방향 A (Evolutionary) + 방향 B의 선택적 도입

**방향 A를 주 전략으로, Figma 파이프라인에 한해 방향 B의 코드 생성을 선택적으로 도입한다.**

#### 근거

1. **ROI 최적**: 핵심 문제(Figma의 타입 정보 손실, 하드코딩, 상태 미지원)를 가장 적은 변경으로 해결
2. **리스크 최소**: React 컴포넌트(10개)와 CSS Module(10개) 변경 불필요
3. **점진적 진화**: 타입화된 중간 표현은 향후 코드 생성의 입력으로 재활용 가능
4. **검증된 기반**: 현재의 recipe 아키텍처는 13개 컴포넌트에서 안정적으로 동작 중
5. **Figma 즉시 개선**: 가장 시급한 문제(COLOR_KEYS 하드코딩, 상태 미지원, 토큰 이름 손실)를 Phase 1에서 해결

#### 방향 B/C를 주 전략으로 선택하지 않는 이유

- **방향 B**: 코드 생성의 이점(제로 런타임, 최강 타입)은 매력적이나, React 컴포넌트 전면 재작성(인라인 스타일 -> className)의 비용이 현재 규모(10개 컴포넌트)에서는 과투자. 컴포넌트가 20개 이상으로 성장하면 재평가 가치 있음.
- **방향 C**: 완전한 패러다임 전환. 기존 recipe 시스템의 설계 투자를 모두 폐기하는 것은 현재 시점에서 정당화하기 어려움. Tailwind 클래스 문자열의 비타입 문제는 오히려 현재보다 타입 안전성이 후퇴.

#### 반론 및 종합 판단

> **방향 B 옹호론**: seed-design은 전 레이어에서 생성된 타입으로 `Record<string, unknown>` 없이 동작한다. 방향 A는 React resolver의 `Record<string, string>` 경계를 그대로 두며, 프로퍼티 카테고리 어노테이션이라는 새로운 유지 부담을 만든다. 컴포넌트가 20개를 넘으면 코드 생성의 선투자가 기하급수적으로 회수된다.

> **종합**: 방향 A를 즉시 전략(Phase 1-2)으로 채택하고, 타입화된 중간 표현이 향후 코드 생성의 입력 스키마 역할을 할 수 있도록 설계한다. 이는 방향 B의 Figma 파이프라인 이점을 React 소비 재작성 없이 얻는 것이며, 규모 확대 시 자연스럽게 방향 B로 진화하는 경로를 확보한다.

---

## 단계별 마이그레이션 계획

### Phase 1: Figma Resolver 타입 강화 — ✅ 완료 (2026-03-28)

**목표**: `COLOR_KEYS` 하드코딩 제거, Figma resolver에서 프로퍼티 카테고리를 자동 판별

**선택한 접근**: 2b (프로퍼티 이름 기반 자동 추론, recipe 정의 무변경)

**실제 구현**:
- `packages/recipe/src/types.ts` — `PropertyCategory` 타입 추가 (`"color" | "radius" | "dimension" | "string" | "unknown"`)
- `packages/recipe/src/utils/property-categories.ts` — `categoryOf(key)` 함수 (명시적 맵 + 이름 기반 휴리스틱 + `Object.hasOwn` 가드)
- `packages/recipe/package.json` — `./utils/property-categories` export 경로 추가
- `packages/figma/src/generators/recipe-resolver.ts` — `COLOR_KEYS`, `isColorKey`, `isRadiusKey` 제거, `categoryOf` 사용
- `packages/recipe/src/__tests__/property-categories.test.ts` — 27개 테스트

**계획 대비 차이**:
- 모든 프로퍼티를 명시적 등록하는 대신 **명시적 맵(color/radius만) + 이름 기반 휴리스틱**으로 단순화. dimension/fontWeight/cssLiteral 프로퍼티는 별도 카테고리 없이 기존 로직(number → 직접 할당, string → passthrough)으로 처리.
- `getPropertyCategory` 대신 `categoryOf`로 명명. 반환 타입에 `undefined` 대신 `"unknown"` fallback.

**검증**: 골든 매트릭스 진단 (13 recipes, 237 combos, 1623 comparisons, 0 VALUE_MISMATCH)

### Phase 2: Figma 상태 지원 + 토큰 이름 보존 — ✅ 완료 (2026-03-28)

**목표**: Figma에서 hover/active 상태 표현, 토큰 이름을 FigmaNodeSpec에 보존

**실제 구현**:
- `FigmaNodeSpec._tokenRefs?: Record<string, string>` — 토큰 이름 보존 (color, radius, CompoundBorder strokeColor)
- `FigmaResolveOptions.state?: string` — 단일 state 옵션으로 hover/active 적용
- `applyStateOverrides()` 함수 — React resolver와 동일 패턴
- `Object.freeze(tokenRefs)` — 소비자 mutation 방지
- `Reflect.deleteProperty()` — 덮어쓰기 시 stale ref 정리
- 13개 테스트 (state 6 + _tokenRefs 7)

**계획 대비 차이**:
- `_states?: Record<string, FigmaNodeSpec>` (다중 상태 일괄 해석)는 구현하지 않음. 대신 `state?: string` (단일 상태)로 단순화. 소비자가 필요한 state마다 개별 호출.
- `preserveTokenRefs` 옵션 없이 항상 토큰 참조 수집 (토큰이 없으면 `_tokenRefs` 필드 자체가 생략됨).

### Phase 2.5: Figma State Variant Generation — ✅ 완료 (2026-03-29, PR #150)

**목표**: 모든 stateful 컴포넌트의 Figma 생성기를 ComponentSetNode 기반으로 마이그레이션. 디자이너가 variant panel에서 State를 전환할 수 있게 함.

**실제 구현**:
- `addStateVariants()` 공유 유틸리티 (`shared.ts`) — base nodes + recipe states → `figma.combineAsVariants()` → 단일 ComponentSetNode per component
- `rgbToTokenName` 역방향 조회 완전 제거 — `_tokenRefs` 정방향 전파로 100% 대체
- 8개 generator 마이그레이션: button(288 nodes), link(6), checkbox(18), input(12), select(12), radio(12), switch(60), pagination(6)
- 6개 recipe state 정의 추가: checkbox(hover), input(hover/focus), select(hover/focus), radio-group(hover), switch(hover), pagination(hover)
- Recipe 구조 확장:
  - radio-group: `selected` variant dimension 추가 (bgColor/borderColor per selected)
  - switch: `checked` variant dimension + `switchBgColor` base + compoundVariants (variant별 checked color). `checkedBgColor` 유지 (React 호환)
  - pagination: `state` → `pageState` rename (interaction state 이름 충돌 해소). React 미사용이므로 안전.
- Golden matrix: STATE_UNSUPPORTED = 0 gate 추가 (CI)
- 테스트: 16개 신규 state resolution tests (총 221 figma tests, 131 recipe tests)

**아키텍처 결정**:
- 단일 ComponentSetNode per component (모든 variant × state = 하나의 Figma 컴포넌트)
- checkbox: State × Status orthogonal dimensions
- addStateVariants는 generator 레벨 유틸리티 (factory에 넣지 않음 — explicit > clever)
- icon/label/disabled/arrow demo rows는 flat ComponentNode 유지 (state variant 미적용)

### Phase 3: SlotStyles 타입 강화 — ✅ 완료 (2026-03-30, "Phase 5a"로 구현)

**목표**: recipe 정의 시점에서 프로퍼티 이름 오타 방지, 프로퍼티-값 타입 제약

**변경 파일**:
- `packages/recipe/src/types.ts` — `TypedSlotStyles` 타입 추가
- `packages/recipe/src/recipes/*.ts` (13개) — 점진적으로 `TypedSlotStyles` 사용으로 마이그레이션

**핵심 설계**:
```typescript
// 기본 프로퍼티 타입 (공통)
interface BaseSlotProperties {
  bgColor?: ColorTokenRef;
  fontColor?: ColorTokenRef;
  borderColor?: ColorTokenRef;
  height?: number;
  width?: number;
  paddingInline?: number;
  paddingLeft?: number;
  paddingRight?: number;
  fontSize?: number;
  fontWeight?: FontWeightRef;
  borderRadius?: RadiusTokenRef | CSSLiteral;
  cornerRadius?: RadiusTokenRef | CSSLiteral;
  border?: CompoundBorder;
  contentPadding?: CSSLiteral;
}

// 컴포넌트별 확장
interface SwitchSlotProperties extends BaseSlotProperties {
  checkedBgColor?: ColorTokenRef;
  checkedThumbColor?: ColorTokenRef;
  thumbSize?: number;
  thumbOffset?: number;
  switchBgColor?: ColorTokenRef;
}

// 하위 호환: 기존 SlotStyles도 여전히 허용
type SlotStyles = BaseSlotProperties | Record<string, StyleValue>;
```

**실제 구현**: `BaseSlotProperties` 인터페이스로 35개 프로퍼티를 타입화. 알려진 프로퍼티는 자동완성 + 값 타입 제약, 커스텀 프로퍼티는 index signature 폴백. 커밋 `1772bf9`에서 "Phase 5a"로 구현됨.

### Phase 4: 코드 생성 — ✅ 완료 (2026-03-30, Direction B 전면 도입)

**목표**: Phase 1-2에서 구축한 타입 메타데이터를 기반으로, Figma 디스크립터의 빌드 타임 생성 가능성 평가

**평가 기준**:
- 런타임 `resolveForFigma` 대비 빌드 타임 생성의 성능 이점이 유의미한가?
- 생성된 JSON이 Figma Plugin의 단일 입력 소스로 충분한가?
- 생성 파이프라인의 유지보수 비용이 런타임 해석 대비 합리적인가?

**실제 구현**: 원래 "컴포넌트 20개 도달 시 재평가"로 계획했으나, Direction B (코드 생성)를 전면 도입:
- `@cocso-ui/codegen` 패키지 신설: `generate-recipe.ts` (코어 엔진) + `generate.ts` (오케스트레이터)
- 13개 recipe에서 CSS 클래스 + className 함수 + TypeScript 타입 빌드 타임 생성 (748 CSS lines)
- React 컴포넌트에서 `@cocso-ui/recipe` 런타임 의존성 완전 제거 — 생성된 산출물만 소비
- Figma JSON descriptor 생성 (`generate-figma-json.ts`) + 9개 generator 마이그레이션
- CI freshness gate: `pnpm codegen generate && git diff --exit-code`
- 276개 codegen parity tests
- `docs/project-codegen.md` 문서화

---

## 리스크 및 완화 전략

### 리스크 1: 프로퍼티 카테고리 맵의 불완전성 — 완화됨

**리스크**: `PROPERTY_CATEGORIES`에 등록되지 않은 새 프로퍼티가 추가될 때 Figma에서 잘못 처리될 수 있음.

**실제 완화** (구현됨):
- `categoryOf()`가 이름 기반 휴리스틱 폴백을 제공 (`key.includes("color")` → `"color"`, `key.includes("radius")` → `"radius"`)
- 명시적 등록은 이름 기반 추론이 불가능한 경우에만 필요 (현재 모든 color/radius 프로퍼티는 이름에 "color"/"radius"를 포함)
- 골든 매트릭스 진단 (`pnpm --filter @cocso-ui/figma golden-matrix`)이 전 recipe의 resolver 패리티를 검증 — CI 등록 가능
- `isColorToken()` 폴백 유지됨

### 리스크 2: Figma 상태 지원의 UI 복잡도 — resolver 수준 해결, 플러그인 수준 미결

**리스크**: 상태별 Figma 노드를 어떻게 표현할지(별도 variant? 별도 섹션?) 디자인 의사결정 필요.

**현재 상태** — ✅ 해결됨 (PR #150):
- Resolver: `resolveForFigma(recipe, variants, { state: "hover" })` 구현 완료
- 플러그인: 단일 ComponentSetNode per component로 결정. `addStateVariants()` + `figma.combineAsVariants()` 패턴.
- 8개 recipe에 states 정의: button(hover, active), link(hover), checkbox(hover), input(hover, focus), select(hover, focus), radio-group(hover), switch(hover), pagination(hover)
- checkbox는 State × Status orthogonal dimension으로 교차 상태 해결

### 리스크 3: Phase 3의 타입 강화가 유연성을 과도하게 제한

**리스크**: `BaseSlotProperties`에 정의되지 않은 커스텀 프로퍼티가 차단될 수 있음.

**완화**:
- `TypedSlotStyles`를 union으로 설계하여 `Record<string, StyleValue>` 폴백 유지
- 컴포넌트별 확장 인터페이스를 제공하되 강제하지 않음
- Phase 3을 선택적으로 유지하고, Phase 1-2 이후 팀 피드백에 따라 결정

### 리스크 4: React 출력의 `Record<string, string>` 한계 지속

**리스크**: 방향 A는 React 소비 측의 타입 안전성을 근본적으로 개선하지 않음.

**완화**:
- Phase 1-2의 우선순위는 Figma 파이프라인 개선이며, React 측은 현재 패턴이 실용적으로 동작 중
- 향후 방향 B(코드 생성)로 진화 시 React 출력도 개선 가능
- 즉시 개선 가능한 부분: 각 recipe에서 사용하는 프로퍼티 키 목록을 타입으로 추출하여 `resolveStyleMap`의 반환 타입을 좁히는 것은 방향 A 내에서도 시도 가능
