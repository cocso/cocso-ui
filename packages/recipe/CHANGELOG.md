# @cocso-ui/recipe

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
