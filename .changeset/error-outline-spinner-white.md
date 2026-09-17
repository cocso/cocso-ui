---
"@cocso-ui/recipe": minor
"@cocso-ui/react": minor
---

`Button` gains `variant="error-outline"`: `error-ghost` with a 1px `feedback-danger-border` edge, for the entry to an action that cannot be undone, with the red fill left for the confirmation that follows. Hover and pressed states match `error-ghost`.

`Spinner`'s `white` variant is white in both themes. It was `surface-primary`, which turns near-black in dark — invisible on the dark backgrounds the docs recommend it for, and a dark spinner on the red, green and blue buttons whose labels stay white. A new `on-primary` variant carries the old behaviour where it was right: the ink on a primary fill, which follows the fill between themes. A loading `primary` button now shows `on-primary`; `success`, `error` and `info` show `white`.
