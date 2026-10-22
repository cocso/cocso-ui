---
"@cocso-ui/react": patch
---

The DayPicker calendar fills its panel instead of leaving an empty band on the right.

The panel has a 260px minimum width and the calendar inside it was the library's `inline-block`, sized to its own content, which is narrower. The calendar sat at the left of the panel and the difference showed as a wide blank strip to the right of Saturday. The calendar is now a full-width block, so the header and the week rows spread to both edges of the panel.
