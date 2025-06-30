# 🎨 Baseframe

**Clean and Simple Design Token Management Tool**

깔끔하고 단순한 디자인 토큰 관리 도구입니다. **CLI와 Core로 분리된 구조**로 CSS Variables 생성에 특화되어 있습니다.

## ✨ 특징

- 🏗️ **깔끔한 구조**: CLI ↔ Core 완전 분리
- 🔧 **4개 핵심 스키마**: PrimitiveTokens → SemanticTokens → ComponentTokens → (ThemeDefinition)
- 🎯 **CSS Variables 최적화**: CSS Custom Properties 생성에 특화
- 🏷️ **COCSO 접두사**: `--cocso-` 접두사 옵션 지원
- 📦 **COCSO 토큰 통합**: packages/baseframe 토큰 자동 로드
- ⚡ **라이트 모드**: 단순하고 빠른 빌드

## 🏗️ 프로젝트 구조

```
src/
├── cli/                    # CLI 관련 코드
│   ├── commands/           # 각 명령어 구현
│   │   ├── build.ts       # build 명령어
│   │   └── validate.ts    # validate 명령어
│   ├── options.ts         # CLI 옵션 처리
│   └── index.ts           # CLI 진입점
├── core/                   # 핵심 로직
│   ├── types/             # 타입 정의
│   │   └── schema.ts      # 스키마 타입들
│   ├── loaders/           # 파일 로더
│   │   └── tokenLoader.ts # 토큰 파일 로더
│   ├── builders/          # 출력 빌더
│   │   ├── cssBuilder.ts  # CSS 빌더
│   │   └── jsonBuilder.ts # JSON 빌더
│   ├── utils/             # 유틸리티
│   │   └── validation.ts  # 검증 함수들
│   └── index.ts           # Core API
└── index.ts               # 메인 진입점
```

## 🚀 설치 및 사용

### CLI 사용

```bash
# 기본 빌드 (CSS + JSON 생성)
baseframe build

# 기본 빌드 (COCSO 토큰 자동 포함)
baseframe build

# 특정 패턴으로 빌드
baseframe build -i "tokens/**/*.yaml" -o "dist" -f "css"

# 토큰 검증
baseframe validate -v

# 도움말
baseframe help
```

### 프로그래매틱 사용

```typescript
import { BaseframeCore } from '@cocso/baseframe';

const core = new BaseframeCore();

// 토큰 로드
await core.loadSchemas('tokens/**/*.yaml');

// COCSO 기본 토큰 자동 포함
await core.loadCocsoTokens();

// CSS 생성 (COCSO 접두사 자동 적용)
const css = core.buildOutput('css');

// JSON 생성
const json = core.buildOutput('json');

// 파일로 저장
await core.buildToFile('css', 'dist/tokens.css');
```

## 🎯 CLI 옵션

| 옵션 | 단축형 | 설명 | 기본값 |
|------|--------|------|--------|
| `--input` | `-i` | 입력 파일 패턴 | `tokens/**/*.{yaml,yml}` |
| `--output` | `-o` | 출력 디렉토리 | `dist` |
| `--format` | `-f` | 출력 형식 (css,json) | `css,json` |

| `--verbose` | `-v` | 자세한 출력 | `false` |

## 📤 출력 예시

### CSS Variables (--cocso 옵션)
```css
/* COCSO Design Tokens - Generated CSS Variables */

:root {
  /* 기본 토큰들 */
  --cocso-text-primary: #1e2124;
  --cocso-surface-primary: #ffffff;
  --cocso-brand-primary: #256ef4;
  
  /* 컴포넌트 토큰들 */
  --cocso-button-primary-bg: brand-primary;
  --cocso-button-primary-text: text-inverse;
  --cocso-input-border-focus: brand-primary;
}
```

### JSON
```json
{
  "text-primary": "#1e2124",
  "surface-primary": "#ffffff",
  "brand-primary": "#256ef4",
  "button-primary-bg": "brand-primary",
  "typography-body": {
    "type": "typography",
    "value": {
      "fontFamily": "Inter",
      "fontSize": "16px",
      "fontWeight": 400
    }
  }
}
```

## 🎨 스키마 구조

### 1. PrimitiveTokens (원시 토큰)
```yaml
kind: PrimitiveTokens
metadata:
  id: foundation-primitives
  name: Foundation Primitive Tokens

data:
  collection: foundation
  tokens:
    blue-500:
      values: "#3b82f6"
      description: 기본 파란색
```

### 2. SemanticTokens (의미론적 토큰)
```yaml
kind: SemanticTokens
metadata:
  id: semantic-tokens
  name: Semantic Design Tokens

data:
  collection: semantic
  extends: [foundation-primitives]
  tokens:
    brand-primary:
      values: blue-500
      description: 기본 브랜드 색상
```

### 3. ComponentTokens (컴포넌트 토큰)
```yaml
kind: ComponentTokens
metadata:
  id: component-tokens
  name: Component Design Tokens

data:
  collection: components
  extends: [semantic-tokens]
  tokens:
    button-primary-bg:
      values: brand-primary
      description: 기본 버튼 배경색
```

## 📦 COCSO 토큰 통합

packages/baseframe의 실제 COCSO 토큰들을 항상 자동으로 로드합니다:

```bash
# COCSO 기본 토큰이 자동으로 포함되는 빌드
baseframe build -v
```

현재 지원하는 COCSO 토큰:
- `$color.gray-*` (0~100)
- `$color.primary-*` (5~95)
- `$color.secondary-*`
- `$color.success-*`
- `$color.danger-*`
- `$color.warning-*`
- `$color.information-*`
- `$color.point-*`
- `$color.graphic-*`
- `$color.black-alpha*` / `$color.white-alpha*`

## 🔧 빌드 설정

`package.json`에 스크립트 추가:

```json
{
  "scripts": {
    "tokens:build": "baseframe build",
    "tokens:validate": "baseframe validate -v",
    "tokens:css": "baseframe build -f css",
    "tokens:json": "baseframe build -f json"
  }
}
```

## 🏷️ COCSO 접두사의 장점

```css
/* 모든 토큰에 COCSO 접두사 자동 적용 */
--cocso-text-primary: #1e2124;
--cocso-button-primary-bg: var(--cocso-brand-primary);
--cocso-color-gray-90: #1e2124;
```

- ✅ **네임스페이스**: 다른 CSS 변수와 충돌 방지
- ✅ **일관성**: 모든 COCSO 토큰을 쉽게 식별
- ✅ **확장성**: 다중 디자인 시스템 환경에서 안전

## 📱 로드맵

### 현재 (v1.0)
- ✅ CLI ↔ Core 분리 구조
- ✅ CSS Variables 생성
- ✅ JSON 출력
- ✅ COCSO 접두사 자동 적용
- ✅ COCSO 기본 토큰 자동 통합

### 다음 (v1.1)
- 🔄 iOS Swift 지원
- 🔄 Android Kotlin 지원
- 🔄 테마 시스템 (라이트/다크)

### 미래 (v2.0)
- 🔄 React Native 지원
- 🔄 Figma 플러그인
- 🔄 실시간 토큰 동기화

## 🤝 기여

기여는 언제나 환영입니다! 이슈를 먼저 열어주세요.

## 📄 라이센스

MIT License
