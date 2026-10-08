---
"@cocso-ui/react": patch
"@cocso-ui/css": minor
---

The Switch's track draws a lighter edge, and a correct one in the dark theme.

The track used `border-strong`, a token chosen by measuring a boundary against the page and a card. That is right for an `Input`, whose fill is the page's own colour, and wrong for a track, which encloses a fill of its own: the boundary has three neighbours, not two. Measured against all three, `border-strong` is 4.51 / 4.13 / 3.67 in the light theme — passing, and heavy enough that an 18px toggle read as loudly as the body text beside it, which on a screen for choosing between prices is the wrong thing to notice first.

It now uses `border-control-muted`, the lightest value clearing 3:1 on all three: 3.75 / 3.44 / 3.06. Its light value is `neutral-450`, a new half step on the neutral ramp — the gap between 400 and 500 is the one place a boundary needs a value and cannot find one, since `neutral-400` is 2.71 against the track fill.

In the dark theme this is a fix rather than a preference. `border-strong` is `neutral-500` in both themes and measures **2.68** against the dark track, so the track's own boundary has been under the bar there for as long as it has existed — nothing had measured a boundary against the thing it encloses. It flips to `neutral-400` at 3.92.

`contrast.test.ts` now checks this token against the enclosed fill as well as the page and the card.
