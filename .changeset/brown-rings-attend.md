---
"@cocso-ui/react": patch
---

`Input`과 `Select`의 쉬는 테두리 값을 레시피로 옮겼습니다.

두 컴포넌트의 CSS 는 레시피가 주는 `border-primary`(흰 배경 1.54:1)를 무시하고
`border-strong`(3.08:1)을 직접 그리고 있었습니다 — WCAG 1.4.11 근거 주석과 함께.
레시피가 그 값을 갖게 했으므로 웹 렌더링은 그대로이고, 레시피에서 값을 받는
Figma·iOS·Android 가 웹을 따라옵니다.
