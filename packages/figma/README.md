## `@cocso-ui/figma`

이 Package는 cocso 디자인 시스템의 토큰과 컴포넌트를 Figma에 동기화하는 Figma 플러그인을 제공해요.

baseframe YAML 정의에서 Figma Variables를 생성하고, recipe 기반으로 Figma 컴포넌트를 생성해요.

### Usage

```bash
# 토큰 사전 빌드 (YAML → tokens.json)
pnpm --filter @cocso-ui/figma generate

# Figma JSON 디스크립터 생성
pnpm --filter @cocso-ui/figma generate:figma-json

# 플러그인 빌드 (dist/ 생성)
pnpm --filter @cocso-ui/figma build

# 테스트 실행
pnpm --filter @cocso-ui/figma test
```

빌드 후 `dist/` 디렉터리를 Figma 데스크탑 앱의 "Import plugin from manifest" 기능으로 로드할 수 있어요.

### Dependencies

- [@cocso-ui/baseframe-sources](../baseframe) — YAML 토큰 소스
- [@cocso-ui/icons](../icons) — 아이콘 SVG 템플릿
- [@cocso-ui/recipe](../recipe) — 컴포넌트 recipe 정의
