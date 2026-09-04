---
"@cocso-ui/react": patch
---

`ButtonSize` 타입에 `"x-large"` 가 빠져 있던 것을 고쳤습니다. 1.3.0 은 CSS 와
CHANGELOG 로는 `size="x-large"` 를 내보내면서 타입은 `x-small` 에서 끝나, TypeScript
에서는 릴리스 노트가 설명한 기능이 타입 에러였습니다. 레시피의 키를 손으로 옮긴
union 이 레시피를 따라가지 않은 것이고, 이제 모든 레시피 컴포넌트의 inline union
을 레시피와 대조하는 테스트가 있습니다 (이전에는 둘만 보고 있었습니다).
