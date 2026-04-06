## `@cocso-ui/baseframe`

YAML design token definitions을 읽어 CSS custom properties와 TailwindCSS v4 테마 파일을 생성하는 CLI 도구입니다.

COCSO에서는 [@cocso-ui/baseframe-sources](../../packages/baseframe)를 진실의 원천(source of truth)으로 사용합니다.

<br />

### 2-Layer Architecture

두 개의 CSS 레이어로 design token을 제공합니다.

**Layer 1 — `token.css` (Design System variables)**

```css
:root {
  --cocso-color-white: #ffffff;
  --cocso-font-weight-bold: 700;
}
```

`--cocso-*` 네임스페이스로 직접 참조할 수 있습니다. `packages/react/` 컴포넌트에서 사용합니다.

**Layer 2 — `tailwind4.css` (TailwindCSS namespace mapping)**

```css
@theme {
  --color-white: var(--cocso-color-white);
  --font-weight-bold: var(--cocso-font-weight-bold);
}

@utility z-* { z-index: --value(--z-index-*); }
```

TailwindCSS v4 표준 네임스페이스(`--color-*`, `--font-weight-*`, `--shadow-*`)로 매핑합니다.
`--z-index-*`는 비표준이므로 `@utility`로 명시 등록합니다.

<br />

### CLI Usage

```bash
# CSS custom properties 생성 (--cocso-* prefix)
baseframe css-vars [dir] --prefix cocso

# TailwindCSS v4 테마 생성
baseframe tailwindcss [dir]
```

<br />

### Structure

```
src/
├── cli/                   # CLI 도구
└── core/                  # 핵심 로직
    ├── builders/          # 출력 포맷 생성기
    │   ├── utils/
    │   │   ├── css.ts     # CSS 값 변환 유틸
    │   │   └── naming.ts  # createVarName 공통 유틸
    │   ├── css-vars.ts    # CSS Variables 생성 (Layer 1)
    │   └── tailwind.ts    # TailwindCSS 생성 (Layer 2)
    ├── transforms/        # 토큰 변환 로직
    │   ├── build.ts       # AST 빌드 및 검증
    │   ├── resolve.ts     # 토큰 참조 해석 (Map 기반)
    │   └── validate.ts    # 토큰 검증
    ├── parsers/           # 입력 파싱
    │   ├── value.ts       # 값 파싱 (hex lowercase 정규화)
    │   └── ast.ts         # AST 구축
    └── types/             # 타입 정의
        ├── domain.ts      # 도메인 타입
        ├── ast.ts         # AST 타입
        └── results.ts     # 결과 타입
```
