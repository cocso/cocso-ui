---
"@cocso-ui/react": patch
---

Give `OneTimePasswordField` an accessible name.

Its hidden input is the control, and it had no name — a screen reader reached an
unlabelled text field. It defaults to `"One-time code"` now, the way `Spinner`
defaults to `"Loading"` and `Progress` to `"Progress"`; a caller passing
`aria-label` overrides it. The component exists for one-time codes, so a default
name is meaningful here where a generic one would not be.

Found by running axe over every story in a real browser.
