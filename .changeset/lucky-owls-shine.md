---
"@cocso-ui/css": patch
---

Separate the dark theme's borders from its surfaces.

`border-secondary` and `surface-secondary` both resolved to `neutral-900`, so a divider drawn on a card sat at **1.00:1** against it — the same colour, invisible. Row separators, list dividers, and in-card rules all vanished, and card outlines against the page background were only marginally better at 1.14:1.

The light theme does not have this: surfaces take the two lightest neutral steps and borders the next two. The dark theme now mirrors that — `border-secondary` moves to `neutral-800` and `border-primary` to `neutral-700`, restoring a separation (1.34:1 on a card) comparable to the light theme's own (1.41:1).

A test asserts no border token resolves to the same value as a container surface in either theme.
