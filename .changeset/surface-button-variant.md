---
"@cocso-ui/recipe": minor
"@cocso-ui/react": minor
---

`Button` gains `variant="surface"`: the outline's border with a `surface-primary` fill, for a button that has to sit above a page that is not white. `outline` and `ghost` are see-through, which reads as a white pill on a white page and as nothing on a tinted one, so a caller wanting the raised look had to paint a slab behind the button and size it to the pill by hand. Hover and pressed states match `outline`.
