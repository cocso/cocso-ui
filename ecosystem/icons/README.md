## `@cocso-ui/icons`

이 Package는 cocso 디자인 시스템의 SVG 아이콘 원본 소스와 빌드 파이프라인을 제공합니다.

`@cocso-ui/react-icons`와 `@cocso-ui/figma`가 이 패키지에서 생성된 산출물을 소비합니다.

### Usage

```bash
# 전체 빌드 (최적화 + 코드 생성)
pnpm --filter @cocso-ui/icons build

# 아이콘 일관성 검증
pnpm --filter @cocso-ui/icons validate

# 하위 호환성 import 검증
pnpm --filter @cocso-ui/icons validate:compat

# Tabler Icons에서 아이콘 가져오기
pnpm --filter @cocso-ui/icons fetch:tabler -- --name <icon-name>

# 커스텀 SVG 아이콘 추가
pnpm --filter @cocso-ui/icons add-icon -- --file <path.svg> --name <name> --category <semantic|brand>
```

### Structure

```
svg/
├── semantic/     # UI 아이콘 (24x24)
└── brand/        # 브랜드 로고
registry.json     # 아이콘 메타데이터 (name, category, colorStrategy, tags 등)
dist/
├── react/        # 생성된 React 컴포넌트 → @cocso-ui/react-icons에서 re-export
└── figma/        # 생성된 Figma SVG 템플릿 → @cocso-ui/figma에서 소비
```

### Dependencies

- [@cocso-ui/react-icons](../react-icons) — 생성된 React 컴포넌트를 re-export
- [@cocso-ui/figma](../figma) — 생성된 Figma SVG 템플릿을 소비
