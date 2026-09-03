---
"@cocso-ui/react": patch
---

Honour `prefers-reduced-motion`, and mirror spacing in RTL.

Seventeen CSS Modules animate; three respected the reduced-motion preference.
The other fourteen ran their transitions and pulses regardless — including
`Skeleton`, whose whole appearance is a loop. Motion here is decoration, so
every one of them now stops when the preference is set.

`Button` put its icon gap on `margin-right`, `Select` its chevron on `right`,
`Input` its reveal button on `right`, `Field` its optional marker on
`margin-left`, `Dialog` its close button on `right`. All of those land on the
wrong side in an RTL document; they are logical properties now. Physical sides
are kept where the side is a placement fact rather than a text one — a Popover
arrow under `[data-side="left"]` stays physical.
