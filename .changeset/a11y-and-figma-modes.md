---
"@cocso-ui/react": patch
---

Give `Progress` an accessible name.

It rendered `role="progressbar"` with nothing naming it, so a screen reader
announced a bar and nothing about what it measures — the role is invalid
without a name. A `label` prop now defaults to `"Progress"`, the way `Spinner`
defaults to `"Loading"`, and the caller can override it.

Found by adding an axe check over every exported component, which nothing had
before: the guards here all measured colour, and this is a dimension none of
them looked at.
