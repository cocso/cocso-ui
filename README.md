# 🎨 COCSO-UI Design System

**Clean, Organized, Scalable, and Optimized User Interface System**

깔끔하고 체계적이며 확장 가능한 UI 디자인 시스템입니다.

## 🏗️ 프로젝트 구조

```
cocso-ui/
├── packages/baseframe/        # 🎨 COCSO 기본 디자인 토큰
│   ├── color.yaml            # 색상 토큰 (primary, secondary, gray 등)
│   ├── space.yaml            # 간격 토큰
│   ├── typo.yaml             # 타이포그래피 토큰
│   └── ...                   # 기타 원시 토큰들
│
├── ecosystem/baseframe/       # 🛠️ 디자인 토큰 빌드 도구
│   ├── src/cli/              # CLI 관련 코드
│   ├── src/core/             # 핵심 로직
│   ├── examples/             # 예시 토큰들
│   └── lib/                  # 빌드된 파일들
│
└── apps/                     # 🚀 애플리케이션들
    └── (앱들이 들어갈 예정)
```

## 🎯 주요 특징

### 📦 packages/baseframe - COCSO 디자인 토큰
- **색상 시스템**: Primary, Secondary, Gray, Success, Warning, Danger 등
- **간격 시스템**: xs(4px) ~ xl(32px) 체계
- **타이포그래피**: 폰트 패밀리, 크기, 굵기 정의
- **실제 값**: 실제 프로덕션에서 사용할 토큰들

### 🛠️ ecosystem/baseframe - 빌드 도구
- **CLI ↔ Core 분리**: 깔끔한 아키텍처
- **CSS Variables 특화**: CSS Custom Properties 최적화
- **COCSO 접두사**: `--cocso-` 네임스페이스 지원
- **다중 스키마**: Primitive → Semantic → Component 구조

## 🚀 시작하기

### 1. 토큰 빌드

```bash
# ecosystem/baseframe로 이동
cd ecosystem/baseframe

# 의존성 설치
bun install

# 빌드
bun run build

# COCSO 토큰으로 CSS Variables 생성
node lib/index.js build --include-cocso --cocso

# 결과 확인
ls -la dist/
# tokens.css   - CSS Variables
# tokens.json  - JSON 형식
```

### 2. CSS 사용

```css
/* 생성된 CSS Variables 사용 */
.button-primary {
  background-color: var(--cocso-brand-primary);
  color: var(--cocso-text-inverse);
  border: 1px solid var(--cocso-brand-primary);
}

.text-body {
  color: var(--cocso-text-primary);
  font-family: var(--cocso-font-family-sans);
}
```

### 3. 프로그래매틱 사용

```typescript
import { BaseframeCore } from '@cocso/baseframe';

const core = new BaseframeCore();

// COCSO 기본 토큰 + 프로젝트 토큰 로드
await core.loadCocsoTokens();
await core.loadSchemas('tokens/**/*.yaml');

// CSS 생성 (COCSO 접두사 기본 적용)
const css = core.buildOutput('css');
```

## 📱 지원 플랫폼

### 현재 (v1.0)
- ✅ **CSS Variables**: 웹 애플리케이션용
- ✅ **JSON**: 범용 데이터 형식

### 계획 (v1.1+)
- 🔄 **iOS Swift**: iOS 네이티브 앱용
- 🔄 **Android Kotlin**: Android 네이티브 앱용
- 🔄 **React Native**: 크로스 플랫폼 모바일

## 🎨 COCSO 디자인 토큰

### 색상 시스템
```yaml
# packages/baseframe/color.yaml에서 발췌
$color.gray-0: '#FFFFFF'      # 순백
$color.gray-50: '#6D7882'     # 중간 그레이
$color.gray-100: '#000000'    # 순흑

$color.primary-50: '#256EF4'  # 메인 브랜드 색상
$color.secondary-50: '#346FB2' # 보조 브랜드 색상
$color.success-50: '#228738'  # 성공 색상
$color.danger-50: '#DE3412'   # 위험 색상
```

### 의미론적 토큰 예시
```yaml
# examples/semantic-cocso.yaml에서 발췌
text-primary:
  values: $color.gray-90
  description: 기본 텍스트 색상

brand-primary:
  values: $color.primary-50
  description: 기본 브랜드 색상
```

### 컴포넌트 토큰 예시
```yaml
# examples/component-cocso.yaml에서 발췌
button-primary-bg:
  values: brand-primary
  description: 기본 버튼 배경색

input-border-focus:
  values: brand-primary
  description: 포커스된 입력 필드 테두리 색상
```

## 🔧 CLI 사용법

```bash
# 기본 빌드
baseframe build

# 기본 빌드 (COCSO 접두사 자동 적용) 
baseframe build

# COCSO 기본 토큰 포함
baseframe build --include-cocso

# CSS만 생성
baseframe build -f css --cocso

# 자세한 로그
baseframe build -v

# 도움말
baseframe help
```

## 🏷️ COCSO 접두사의 장점

```css
/* 기본 빌드 (COCSO 접두사 적용) */
:root {
  --cocso-text-primary: #1e2124;
  --cocso-button-bg: #256ef4;
}

/* --no-cocso 옵션 */
:root {
  --text-primary: #1e2124;
  --button-bg: #256ef4;
}
```

**장점:**
- 🔒 **네임스페이스**: CSS Variables 충돌 방지
- 🏷️ **브랜딩**: COCSO 디자인 시스템 명확한 식별
- 🔧 **통합**: 여러 디자인 시스템 혼용 시 안전

## 📈 로드맵

### Phase 1 (현재) - 웹 플랫폼
- ✅ COCSO 디자인 토큰 정의
- ✅ Baseframe 빌드 도구 (CLI + Core)
- ✅ CSS Variables 생성
- ✅ JSON 출력

### Phase 2 - 모바일 플랫폼
- 🔄 iOS Swift 코드 생성
- 🔄 Android Kotlin 코드 생성
- 🔄 React Native 지원

### Phase 3 - 디자인 도구 연동
- 🔄 Figma 플러그인
- 🔄 Sketch 플러그인
- 🔄 Adobe XD 플러그인

### Phase 4 - 고급 기능
- 🔄 실시간 토큰 동기화
- 🔄 테마 시스템 (라이트/다크)
- 🔄 A11y (접근성) 자동 검증

## 🤝 팀 협업

### 디자이너
1. packages/baseframe에서 기본 토큰 관리
2. Figma에서 토큰 사용 (향후 플러그인 제공)
3. 새 토큰 추가 시 PR로 제안

### 개발자
1. ecosystem/baseframe으로 빌드
2. 생성된 CSS Variables 사용
3. 컴포넌트별 토큰 정의 확장

### 프로덕트 매니저
1. 일관된 디자인 시스템 확인
2. 브랜드 가이드라인 준수 검증

## 📄 라이센스

MIT License - 자유롭게 사용하세요!

---

**COCSO-UI로 일관되고 확장 가능한 디자인 시스템을 구축하세요! 🎨**

