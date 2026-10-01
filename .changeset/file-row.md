---
"@cocso-ui/react": minor
---

`FileRow`: one chosen or stored file, on the same line as the inputs around it. A name that truncates rather than wraps, and a slot for whatever controls the file needs — download, print, remove.

Its height, inline padding, font size and corner come from the `input` recipe, the way `InputTrigger`'s do, so a file row and the field beside it start their text on the same line by construction. Two apps had already built this shape from numbers measured off a rendered field; those numbers drift the first time the input scale moves.

No fill — a row shows something already decided, it is not a box to type in — and the edge is drawn with `border-strong`, the same token the input recipe defaults to, at 4.51:1 on the light page and 4.09:1 on the dark one. `error` draws that edge in `feedback-danger` (4.56:1 / 5.64:1). The invalid state and its message belong to `Field`, which already owns both.
