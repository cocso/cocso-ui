---
"@cocso-ui/recipe": patch
"@cocso-ui/react": patch
---

`button` and `badge` recipes carry the label weight (`medium`, 500). The web already drew both at 500 — the button from `button.tsx`'s `weight` default, the badge through `<Typography weight="medium">` — but neither value was in the recipe, so the SwiftUI and Compose views could not read it and drew the button at 400 and the badge at 600. The generated CSS gains `--cocso-button-font-weight` / `--cocso-badge-font-weight`; no visual change on the web.
