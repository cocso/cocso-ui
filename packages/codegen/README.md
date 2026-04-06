## `@cocso-ui/codegen`

이 Package는 [@cocso-ui/recipe](../recipe) 정의로부터 빌드 타임에 CSS 클래스, className 함수, TypeScript 타입을 생성해요.

생성된 산출물은 `@cocso-ui/react` 컴포넌트가 런타임 없이 스타일을 적용할 수 있게 해요.

### Usage

```bash
# 모든 recipe에서 산출물 생성
pnpm --filter @cocso-ui/codegen generate

# 테스트 실행 (parity 검증 포함)
pnpm --filter @cocso-ui/codegen test
```

생성된 파일은 아래와 같이 import 할 수 있어요.

```typescript
import { button } from '@cocso-ui/codegen/generated/button';
import '@cocso-ui/codegen/generated/button.css';
```

### Structure

```
generated/
├── {recipe}.css       # BEM CSS 클래스 (CSS custom properties 설정)
├── {recipe}.ts        # className 조합 함수
├── {recipe}.d.ts      # TypeScript 타입 선언
└── {recipe}.figma.json  # Figma용 사전 해석된 스펙
```

### Dependencies

- [@cocso-ui/recipe](../recipe) — 빌드 타임 의존성 (recipe 정의 소비)
