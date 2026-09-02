---
"@cocso-ui/react": patch
---

Enforce the "no body text in `text-tertiary`" rule per use rather than per
token.

`module-css-contrast.test.ts` exempted `text-tertiary` and `text-muted`
outright, which turned the rule off inside the check meant to enforce it: they
are exempt precisely because they miss AA everywhere, so nothing stopped a new
component painting body text with one. The two existing uses — the breadcrumb
separator glyph and the Select chevron — are non-text graphics and stay exempt
by name. Any new use has to justify itself.

No runtime change.
