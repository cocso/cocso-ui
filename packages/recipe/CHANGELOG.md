# @cocso-ui/recipe

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
