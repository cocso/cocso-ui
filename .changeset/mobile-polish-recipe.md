---
"@cocso-ui/recipe": patch
"@cocso-ui/react": patch
---

`dialog` recipe: drop the `height` values. The web never read `--cocso-dialog-height` (the module CSS caps at 85vh), and the mobile views did, so a two-line dialog came out 260 tall. No visual change on the web.
