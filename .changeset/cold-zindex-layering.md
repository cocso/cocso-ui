---
"@cocso-ui/baseframe-sources": minor
"@cocso-ui/css": minor
"@cocso-ui/react": patch
---

Add a dedicated floating layer to the z-index scale so popups always render above modals.

- Add `popover` (300) and `tooltip` (400) z-index tokens, above `dialog` (200).
- Dropdown and Popover positioners now use `--cocso-z-index-popover`; Tooltip uses `--cocso-z-index-tooltip`. DayPicker/MonthPicker inherit the dropdown layer.
- Fixes tooltips and dropdowns (incl. DayPicker/MonthPicker) being hidden behind dialog content when opened inside a Dialog.
- Remove the redundant `z-index` on the Dropdown popup; the layer belongs on the Positioner per the floating component contract.
