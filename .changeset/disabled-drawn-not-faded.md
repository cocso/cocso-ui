---
"@cocso-ui/css": minor
"@cocso-ui/recipe": minor
"@cocso-ui/react": minor
---

A disabled button is drawn, not faded. `opacity: 0.4` over the whole control took the label down with the fill — a disabled primary button's label measured 1.76:1, on the two screens that open the mobile app. The `button` recipe gains a `disabled` state, and two semantic tokens carry it: `interactive-disabled` for the fill and `text-on-disabled` for the ink, 5.13 in light and 6.03 in dark. See-through variants keep their background and change only their ink.
