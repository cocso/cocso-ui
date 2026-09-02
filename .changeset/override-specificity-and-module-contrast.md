---
"@cocso-ui/react": patch
---

Make the documented override path reachable, and fix three foregrounds it hid.

Generated variant rules carried two classes — `.cocso-button.cocso-button--variant-outline`,
specificity (0,2,0) — while the `--cocso-<component>-<property>` custom
properties they define are what the Component Override Contract points
consumers at. A consumer's single class is (0,1,0) and lost, so the documented
entry point required `!important`; and because a module paints its base and
hover states with two separate `background-color` declarations, an `!important`
fill also deleted the hover state. Modifier classes are now wrapped in
`:where()`, so every generated rule sits at the component class's specificity
and a single consumer class wins with no `!important` and no collateral loss.

Auditing the CSS Modules — which no contrast check had ever looked at — turned
up three foregrounds:

- `Field` painted validation messages with `feedback-danger`, the fill level,
  at 4.18:1 on `surface-secondary` in the light theme. Now `feedback-danger-text`.
- `DayPicker` and `MonthPicker` used `surface-primary` as the foreground on an
  `interactive-primary` fill. Correct in the stock themes by coincidence, but
  the pair a consumer rebrands is `interactive-primary`/`text-on-primary`, so a
  rebranded fill left the foreground tracking the page — 3.23:1 in the dark
  theme against a blue fill, where `text-on-primary` is 5.70:1.
