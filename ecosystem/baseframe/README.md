## `@cocso-ui/baseframe`

이 Package는 YAML 파일을 `CSS`, `JSON` 등 다양한 형식으로 변환하여 스타일 토큰을 생성하는 도구에요.

COCSO에서는 [@cocso-ui/baseframe-sources](../../packages/baseframe)를 진실의 원천(source of truth)으로 사용하고 있어요.

<br />

### Structure

```
src/
├── cli/                   # CLI 도구
└── core/                  # 핵심 로직
    ├── builders/          # 출력 포맷 생성기
    │   ├── utils/         # 빌더 전용 유틸리티
    │   ├── css-vars.ts    # CSS Variables 생성
    │   └── tailwind.ts    # TailwindCSS 생성
    ├── transforms/        # 토큰 변환 로직
    │   ├── build.ts       # AST 빌드 및 검증
    │   ├── resolve.ts     # 토큰 참조 해석
    │   └── validate.ts    # 토큰 검증
    ├── parsers/           # 입력 파싱
    │   ├── value.ts       # 값 파싱
    │   └── ast.ts         # AST 구축
    └── types/             # 타입 정의
        ├── domain.ts      # 도메인 타입
        ├── ast.ts         # AST 타입
        └── results.ts     # 결과 타입
```

각 폴더는 명확한 역할을 가지고 있어서 새로운 기능을 추가하거나 기존 기능을 수정할 때 쉽게 찾을 수 있어요.
