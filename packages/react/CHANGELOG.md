# @cocso-ui/react

## 0.2.15

### Patch Changes

- fb03cd2: `Checkbox` 컴포넌트의 토큰 오류를 수정합니다.

## 0.2.14

### Patch Changes

- 05928a1: DayPicker 컴포넌트에 day disabled 속성을 추가합니다.

## 0.2.13

### Patch Changes

- 135a868: `react-datepicker` 기반으로 Date Picker, Month Picker 컴포넌트를 개선합니다.

## 0.2.12

### Patch Changes

- f951318: Modal 컴포넌트의 `z-index`가 적용되지 않는 문제를 해결합니다.

## 0.2.11

### Patch Changes

- 875f462: MonthPicker 컴포넌트를 추가합니다.

## 0.2.10

### Patch Changes

- 9da5132: Switch 컴포넌트의 size 옵션을 sm, md로 변경합니다.

## 0.2.9

### Patch Changes

- 34cc4ab: Pagination 컴포넌트의 크기, 텍스트 토큰을 변경합니다.

## 0.2.8

### Patch Changes

- f1a14c8: README.md 파일을 업데이트 합니다.

## 0.2.7

### Patch Changes

- 01b6aac: Select 컴포넌트에 `stretch` prop을 추가하여 전체 너비(`width: 100%`) 설정을 지원합니다.
- 01b6aac: Select 컴포넌트의 `disabled` 상태 관리를 Button 컴포넌트와 동일한 패턴으로 `cx`를 통해 클래스 기반으로 변경합니다.

## 0.2.6

### Patch Changes

- 01b6aac: select 컴포넌트의 classname 값을 wrapper와 병합합니다.

## 0.2.5

### Patch Changes

- f622205: 버튼 컴포넌트에서 prefix, suffix를 포함하는 패딩 값을 수정합니다.

## 0.2.4

### Patch Changes

- 45e5e49: 버튼 컴포넌트 개선: `xs` 사이즈 버튼의 내부 콘텐츠 패딩을 제거하고, 가로 패딩을 2px에서 6px로 조정합니다. 또한, 모든 버튼 사이즈에서 prefix/suffix 요소의 `min-width` 속성을 제거합니다.

## 0.2.3

### Patch Changes

- 9113f15: Popover 컴포넌트의 디자인 토큰을 최신 명명 규칙에 맞게 업데이트하고, 그림자 스타일을 조정합니다.

## 0.2.2

### Patch Changes

- 0453d0d: 일부(Spinner) 컴포넌트의 토큰 값을 변경합니다.
- c385ce1: Badge 컴포넌트 추가

## 0.2.1

### Patch Changes

- 52672d5: 모달에 사용된 디자인 토큰을 변경합니다.

## 0.2.0

### Minor Changes

- 1e77fb6: 텍스트 색상 토큰을 추가합니다.

  버튼 컴포넌트 xs의 사이즈 토큰을 변경합니다.

  Settler 페이지에서 사용되는 `react-icons`을 추가합니다.

### Patch Changes

- Updated dependencies [1e77fb6]
  - @cocso-ui/react-icons@0.1.0

## 0.1.13

### Patch Changes

- 4b884b6: SettingsBackupRestore, SupervisedUserCircle, OutpatientMed, Medication 아이콘을 추가합니다.

  `react-icons` 패키지 빌드 전 `index.tsx` 생성 스크립트를 추가합니다.

- Updated dependencies [4b884b6]
  - @cocso-ui/react-icons@0.0.16

## 0.1.12

### Patch Changes

- 17387b0: `@cocso-ui/react` 패키지에 스타일 export 옵션을 추가합니다.
- Updated dependencies [17387b0]
  - @cocso-ui/react-icons@0.0.15

## 0.1.11

### Patch Changes

- 79e9f6d: 번들 툴링을 Rollup 기반으로 변경합니다.
- e9a3e0a: spacing 토큰을 추가합니다.

  Body, Heading, Display 컴포넌트를 Typography 컴포넌트와 연결합니다.

- Updated dependencies [79e9f6d]
  - @cocso-ui/react-icons@0.0.14

## 0.1.10

### Patch Changes

- b0e3f2a: 사용되지 않는 디자인 토큰을 제거합니다.

## 0.1.8

### Patch Changes

- 4bfd4e2: - 브랜드 로고를 추가하고, Horizontal Logo를 Text Logo로 변경합니다.
  - Button 컴포넌트에 asChild 옵션을 추가합니다.
- Updated dependencies [4bfd4e2]
  - @cocso-ui/react-icons@0.0.13

## 0.1.6

### Patch Changes

- 52fd725: `cocso-ui/react/button` 컴포넌트에 `xl` 사이즈를 추가합니다.

## 0.1.5

### Patch Changes

- c41daad: - `@cocso-ui/react`의 의존성 패키지를 변경합니다.
  - 빌드 생성 폴더를 변경합니다.
    - `lib` → `dist`
- Updated dependencies [c41daad]
  - @cocso-ui/react-icons@0.0.11

## 0.1.3

### Patch Changes

- bee35ae: - Add icons related to `cocso-ui`
  - Change variant of button component
- Updated dependencies [bee35ae]
  - @cocso-ui/react-icons@0.0.9

## 0.1.2

### Patch Changes

- 661270c: - Add icons related to `cocso-ui`
  - Change variant of button component
- Updated dependencies [661270c]
  - @cocso-ui/react-icons@0.0.8
