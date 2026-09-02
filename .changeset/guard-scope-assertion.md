---
"@cocso-ui/react": patch
---

Fail if a component or CSS Module lands where the component guards do not look.

`module-css-tokens`, `module-css-contrast` and `component-tsx-colors` all scan
`src/components`. Inside it they widen on their own; outside it they see
nothing, and nothing said so. Nothing lives outside it today — this asserts
that rather than assuming it, because the day something does is the day all
three go quiet at once.

No runtime change.
