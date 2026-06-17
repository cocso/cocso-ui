---
"@cocso-ui/css": minor
---

Add an opt-in dark theme at `@cocso-ui/css/theme-dark.css`. Import it after
`token.css` and set `data-theme="dark"` on a container to remap the semantic
token layer (text, surface, border, interactive, focus, feedback surfaces) to
dark tones. Raw color-scale tokens are untouched, so app-level scale overrides
are preserved and existing light-only apps are unaffected.
