---
"@cocso-ui/react": minor
---

`Pagination` now accepts a `locale` prop (`"en" | "ko"`, default `"en"`) that
supplies built-in accessible labels, so Korean apps no longer need to pass a
full `labels` object on every instance. The `labels` prop still overrides
individual strings.
