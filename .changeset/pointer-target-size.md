---
"@cocso-ui/react": patch
---

Lift `Checkbox` and `Switch` to the minimum pointer target size.

Measured in a browser: the row was 21px tall at the small size, under the 24px
WCAG 2.2 SC 2.5.8 asks of a pointer target. The visual box is 14–18px and the
label toggles the control, so the row is what a pointer has to hit.

The wrapper takes a 24px minimum height, which lifts the target without
touching the box — it stays the size it was drawn. Only the small size moves,
by three pixels; medium was already 24 and large 27.
