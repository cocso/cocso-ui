---
"@cocso-ui/react": minor
---

Add an opt-in password reveal button to `Input`.

`<Input type="password" passwordToggle />` renders a button that switches the
field between `password` and `text`. It is opt-in rather than inferred from the
type, so an existing password field does not grow a button on upgrade.

- The `type` attribute is toggled, not a style. Browsers key password save and
  autofill off `autocomplete`, so switching between `password` and `text`
  leaves them alone.
- The button is `type="button"` and does not submit a surrounding form.
- It overlays the field rather than wrapping it, and the caller's `className`,
  `ref` and `style` still reach the `<input>`. The wrapper exists only when the
  toggle does, so nothing changes for an `Input` without it.
- The icon uses `text-secondary` — 6.30:1 light, 5.98:1 dark.
- `aria-label` reflects the current state and the button carries `aria-pressed`.
- `padding-inline-end` reserves the button's column so a long value never runs
  underneath it.

Proposed by a consumer who had rebuilt it outside the library to get the
behaviour.
