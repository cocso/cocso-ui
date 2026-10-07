---
"@cocso-ui/react": patch
---

A page number wider than two digits no longer overruns its box. `Pagination` drew every item as a fixed 32px square, so a four-digit page overflowed it: the labels ran together with no gap between them and the current page's filled pill clipped its own number. Any catalogue past a thousand pages rendered that way.

The arrow keeps its fixed square, since it holds an icon. The number's box now has a minimum rather than a fixed width, with inline padding and no wrapping — a single digit stays the same 32px square it has always been, and only a wider number grows the box: 32px at one digit, about 45 at four.
