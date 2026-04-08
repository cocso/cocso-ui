## `@cocso-ui/recipe`

이 Package는 컴포넌트의 variant→token 매핑을 정의하는 단일 진실의 원천(single source of truth)입니다.

`@cocso-ui/codegen`이 빌드 타임에 이 정의를 소비해 CSS, className 함수, TypeScript 타입을 생성합니다.

### Usage

recipe 정의는 `defineRecipe()` API로 작성합니다.

```typescript
import { defineRecipe } from '@cocso-ui/recipe';

export const buttonRecipe = defineRecipe({
  name: 'button',
  slots: ['root'],
  variants: {
    variant: {
      primary: {
        root: { bgColor: 'var(--cocso-color-primary-950)' },
      },
    },
  },
});
```

recipe를 수정한 후에는 반드시 codegen을 다시 실행해야 합니다.

```bash
pnpm --filter @cocso-ui/codegen generate
```

### Dependencies

- [@cocso-ui/codegen](../../ecosystem/codegen) — recipe를 소비해 빌드 산출물 생성
