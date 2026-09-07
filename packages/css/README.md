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

### 본문 텍스트 색상 (WCAG AA)

본문에 쓸 수 있는 텍스트 토큰은 `--cocso-color-text-primary`와
`--cocso-color-text-secondary` 두 단계입니다.

`--cocso-color-text-tertiary`는 **본문용이 아닙니다.** 어떤 표면 위에서도 AA
(4.5:1)를 넘지 못합니다.

| 토큰 | 흰 배경 | `surface-secondary` | 최악의 틴트 표면 |
|---|---|---|---|
| `text-primary` | 18.43 | 16.89 | 15.00 |
| `text-secondary` | 6.30 | 5.77 | 5.13 |
| `text-tertiary` | **3.08** | **2.82** | **2.51** |

한 단계 어둡게(`neutral-500`, 4.51:1) 옮겨도 흰 배경만 통과하고 카드 위에서는
4.13:1로 여전히 미달입니다. 흰 배경과 최악의 틴트 표면 양쪽에서 AA를 넘기는 가장
밝은 회색은 `#686868`인데, `text-secondary`(`#58616a`)와 육안으로 구분되지
않습니다. 세 번째 본문 단계는 이 팔레트에 자리가 좁은 것이 아니라 없습니다.

`text-tertiary`가 맞는 자리는 텍스트가 아닌 것 — 아이콘이 아닌 장식, 구분선,
비활성 상태처럼 1.4.3이 면제하는 경우입니다. 텍스트에 시각적 위계가 필요하면
색이 아니라 크기와 굵기로 표현하고, 색은 `text-secondary`를 쓰세요.

### 브랜드 테마 (opt-in)

디자인 시스템의 베이스 `primary` 는 어떤 브랜드도 아닙니다 — `primary-*` 램프가
중립(neutral) 램프의 별칭이라 `interactive-primary` 는 검정입니다. 브랜드 색은 그
위에 얹는 테마입니다.

```javascript
import '@cocso-ui/css/token.css';
import '@cocso-ui/css/theme-dark.css';   // 다크를 쓴다면
import '@cocso-ui/css/theme-cocso.css';  // 마지막에
```

```html
<html data-brand="cocso" data-theme="dark">
```

`theme-cocso.css` 는 `primary-*` 램프와 `interactive-primary` 계열, `text-on-primary`
를 info 램프(파랑)로 바꿉니다. 다크 선택자 `[data-brand][data-theme="dark"]` 는
(0,2,0) 이라 `theme-dark.css` 의 (0,1,0) 을 import 순서와 무관하게 이깁니다 — 앱이
`:root:root` 로 특정도를 올릴 필요가 없습니다.

같은 값이 iOS·Android 에는 `CocsoBrandCocso` 로 나갑니다. 소스는 하나
(`packages/baseframe-brands/cocso/`)이고, 세 플랫폼이 같은 파일에서 생성됩니다.
