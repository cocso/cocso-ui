---
"@cocso-ui/react": minor
---

Fix `Dropdown` / `Popover` stacking and add positioning props.

- Move the overlay `z-index` onto the floating `Positioner` (the element that
  owns the stacking context via its `transform`). Previously `z-index` lived on
  the inner popup, so a `position: fixed` sidebar could render on top of an open
  `Dropdown` and the popup could appear transparent.
- `Dropdown.Content` now forwards `side`, `sideOffset`, `align`, `alignOffset`,
  and `arrowPadding` to its positioner, matching `Popover.Content`. Per-instance
  placement no longer needs global CSS overrides.
