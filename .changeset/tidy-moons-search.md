---
"@cocso-ui/react": patch
---

단위를 받지 않는 CSS 속성에 붙던 `px`를 제거했습니다.

`font-weight: 700px`는 유효하지 않은 선언이라 브라우저가 통째로 버립니다. 제목
(`Typography type="heading"`)과 활성 페이지네이션 항목이 굵게 표시되지 않고 있었고,
스피너는 날 개수를 `--cocso-spinner-blades: 10px`로 내보내 소비자가 `calc()`로
나눌 때 깨졌습니다.

숫자를 길이로 바꾸는 것은 거의 모든 속성에서 맞지만 `font-weight`, `z-index`,
`opacity`, `line-height`처럼 맨 숫자를 받는 속성에서는 틀립니다. 이제 속성 이름을
보고 결정합니다.

같은 레시피에서 나온 모바일 쪽 출력은 이 값들을 처음부터 맞게 다루고 있었고,
두 출력을 대조하다가 드러났습니다.
