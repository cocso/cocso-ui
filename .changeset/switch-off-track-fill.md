---
"@cocso-ui/react": patch
"@cocso-ui/css": minor
---

The Switch's off track is a solid gray fill, and neither the track nor the thumb draws an outline.

The off track was a pale `surface-neutral` with two 1px rings: `border-control-muted` around the track and `border-on-control` around the thumb. Next to each other they read as one heavy dark outline, louder than the label beside it.

It now uses `interactive-control-off`, a new semantic token: light `neutral-450` (3.75 on the page and the white thumb, 3.44 on a card), dark `neutral-400` (5.98 against the dark thumb and page, 5.25 on a card). Unchecked hover uses `interactive-control-off-hover` (light `neutral-500`, dark `neutral-300`), which moves away from the page in both themes. `contrast.test.ts` checks both fills against the page, a card and the thumb.

`border-control-muted` and `border-on-control` stay exported; nothing in the library uses them any more.
