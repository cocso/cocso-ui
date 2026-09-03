---
"@cocso-ui/css": patch
---

Generate `theme-dark.css` from the token sources.

It was the only token artifact still written by hand, which meant the dark
theme existed in the published CSS and nowhere else — the Figma token export
reads the YAML, so Figma Variables only ever carried light values.

Semantic color tokens now live in a `theme` collection with the modes `light`
and `dark`; primitives stay in `global` with its single mode. `token.css` is
the primitives plus the light theme; `theme-dark.css` is the same semantic
tokens in their dark mode and nothing else, so the raw ramps are never
re-emitted there and a consumer's `--cocso-color-primary-*` override still
survives the theme flip.

No token value changes. `theme-dark.css` grows from 51 declarations to 73: the
22 tokens that deliberately do not move now say so explicitly, because the
generator requires every token to declare a value for each of its collection's
modes. That is the point — a semantic token can no longer ship without someone
deciding what it does in the dark theme.
