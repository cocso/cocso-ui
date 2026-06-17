---
"@cocso-ui/react": minor
---

Add stable `data-cocso-component` attributes to themable surfaces (`Dropdown`,
`Popover`, `Dialog`, `Tooltip`, `Select`, `Input`, `InputTrigger`) so global CSS
overrides can target them without depending on content-hashed CSS Module class
names. Also move the `Tooltip` overlay `z-index` onto its positioner, fixing the
same stacking-context issue addressed for `Dropdown`/`Popover`.
