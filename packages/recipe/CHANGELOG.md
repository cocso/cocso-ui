# @cocso-ui/recipe

## 0.2.2

### Patch Changes

- 8c3aac4: Two colour fixes the mobile app found.

  `button`'s `ghost` variant is see-through. It filled `surface-primary`, which is invisible on a white page and a white pill on anything else — next to `error-ghost`, which is already `transparent`, the two read as different weights. The hover state still fills `surface-secondary`, so nothing changes on a white page.

  The cocso brand's `interactive.primary-muted` is `info-200` in light and `info-700` in dark. It was `info-500` in both, which is the same value the brand gives `interactive.primary` in light: a muted control was pixel-for-pixel a live one. The base tokens had the relationship right; only the brand overlay lost it.

## 0.2.1

### Patch Changes

- 56b36fb: `button` and `badge` recipes carry the label weight (`medium`, 500). The web already drew both at 500 — the button from `button.tsx`'s `weight` default, the badge through `<Typography weight="medium">` — but neither value was in the recipe, so the SwiftUI and Compose views could not read it and drew the button at 400 and the badge at 600. The generated CSS gains `--cocso-button-font-weight` / `--cocso-badge-font-weight`; no visual change on the web.

## 0.2.0

### Minor Changes

- cf341f1: `radio` recipe: a selected radio keeps the page's fill and takes `interactive-primary` on its ring — what the web has always drawn through `[data-checked]`. The recipe had filled the whole circle with the primary, a value the web never read and the mobile views did, so a selected radio was a solid disc there. No visual change on the web.

## 0.1.1

### Patch Changes

- 9f69341: `dialog` recipe: drop the `height` values. The web never read `--cocso-dialog-height` (the module CSS caps at 85vh), and the mobile views did, so a two-line dialog came out 260 tall. No visual change on the web.

## 0.1.0

### Minor Changes

- d0ff69b: `card` and `button` recipes: `glass` variant (`surface-glass`, `border-glass`; the button presses to `surface-glass-active`). `SEMANTIC_TO_PRIMITIVE` maps the glass tokens so Figma no longer previews them as magenta.

## 0.0.2

### Patch Changes

- 03f8bf3: Fail the contrast check when a recipe exists that it does not cover.

  Its recipe list is written by hand, and the only thing asserted about the list
  was a floor — which catches a check that stops covering things, but not a new
  recipe it has never heard of. That is the direction it actually broke in: the
  list held six of nineteen, and `link`, one of the thirteen it omitted, painted
  text with a fixed-hue fill token that measured 1.74:1 on hover in the dark
  theme.

  No runtime change.
