## `@cocso-ui/css`

이 Package는 컴포넌트의 기반이 되는 CSS 스타일을 제공합니다.

### Installation

```bash
pnpm install @cocso-ui/css
```

### Usage

`css-variable` 토큰은 시스템의 기반이 되는 변수를 정의합니다. `tailwindcss`와 같은 디자인 프레임워크를 사용하더라도 의존성을 추가해야 합니다.

```javascript
// css-variable 토큰
import '@cocso-ui/css/token.css';

// tailwindcss4 유틸리티 토큰
import '@cocso-ui/css/tailwind4.css';
```

### Dark theme (opt-in)

`theme-dark.css`는 시맨틱 토큰만 다크 톤으로 재매핑하는 opt-in 다크 테마입니다.
`token.css` **다음에** import하고, 다크로 표시할 컨테이너(보통 `<html>`)에
`data-theme="dark"`를 지정하세요.

```javascript
import '@cocso-ui/css/token.css';
import '@cocso-ui/css/theme-dark.css';
```

```html
<html data-theme="dark">
  ...
</html>
```

원시 색상 스케일 토큰(`--cocso-color-neutral-*` 등)은 변경되지 않으므로, 앱에서
스케일을 오버라이드했다면 그대로 유지됩니다.
