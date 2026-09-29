---
"@cocso-ui/react": patch
---

`DayPicker`, `MonthPicker` and `DateTimePicker` announce their calendar correctly. All three held it in a `Dropdown`, whose popup is a menu: `role="menu"`, whose required children are `menuitem`s, which a grid of days does not have. A screen reader was told a menu and found nothing in it, and axe called it a critical `aria-required-children`. The panel is a `Popover` now — a dialog with the label it already carried.

Two more the same panel was hiding: the month and year arrows are icon-only buttons and had no accessible name, so they announced nothing; they are labelled now. And a day from the neighbouring month is still selectable, but was drawn at `opacity: 0.4`, which multiplied whatever colour the cell had and put the weekend red near 2:1 — it now takes a token that stays legible.

Visually the panel is unchanged apart from those neighbouring-month days, which read grey rather than faded. Its padding, corners and overflow no longer depend on which stylesheet a consumer's bundle happens to load first.
