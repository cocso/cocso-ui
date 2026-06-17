---
"@cocso-ui/react": minor
---

Expose first-class prop types so consumers no longer need to import from
`@base-ui/react`:

- `Tab` now exports `TabProps`, `TabListProps`, `TabTriggerProps`, and
  `TabContentProps`.
- A `RenderProp` type alias is re-exported from the package root for typing the
  `render` prop of polymorphic components (`Button`, `Link`, `Typography`).
