---
"@cocso-ui/css": minor
---

`theme-cocso.css` 를 추가했습니다 — cocso.co.kr 의 브랜드 색(info 램프)을 베이스 위에
얹는 opt-in 테마입니다. `token.css`(와 `theme-dark.css`) 뒤에 import 하고 컨테이너에
`data-brand="cocso"` 를 지정하세요.

베이스 `primary` 는 그대로 중립입니다. medicaldb-website 처럼 베이스의 검정을 쓰는
소비자는 영향이 없고, 지금까지 `theme-override.css` 로 같은 값을 직접 덮어 온 앱은
그 블록을 이 파일로 대체할 수 있습니다. 다크 선택자가 `[data-brand][data-theme="dark"]`
로 (0,2,0) 이라 import 순서에 목숨을 걸 필요가 없습니다.
