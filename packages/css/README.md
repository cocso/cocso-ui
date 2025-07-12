## `@cocso-ui/css`

이 Package는 컴포넌트의 기반이 되는 CSS 스타일을 제공해요.

### Installation

```bash
pnpm install @cocso-ui/css
```

### Usage

`css-variable` 토큰은 시스템의 기반이 되는 변수를 정의해요. 따라서, `tailwindcss`와 같은 디자인 프레임워크를 사용하더라도 의존성을 추가해야 해요.

```javascript
// css-variable 토큰
import '@cocso-ui/css/token.css';

// tailwindcss4 유틸리티 토큰
import '@cocso-ui/css/tailwind4.css';
```
