---
"@cocso-ui/css": minor
---

Export twelve semantic tokens to the Tailwind theme that `token.css` already
defined but `tailwind4.css` did not: `border-strong`, `text-on-success`,
`text-on-danger`, `text-on-info`, `text-on-warning`,
`interactive-primary-subtle`, `interactive-primary-text`,
`interactive-neutral`, `interactive-neutral-hover`,
`interactive-neutral-active`, `interactive-danger-subtle-hover` and
`interactive-danger-subtle-active`.

They were written into `token.css` by hand and never made it back into
`packages/baseframe-sources`, which is what generates both published files and
the Figma token export — so the custom properties resolved, but the matching
Tailwind utilities did not exist and Figma never saw the tokens. The sources
now carry them, and `golden.test.ts` fails if the published CSS and the YAML
disagree again.
