---
"@cocso-ui/react": patch
"@cocso-ui/css": minor
---

The Switch's off thumb draws a lighter edge. It used `text-secondary`, a text colour, which measured 5.13:1 against the off track — 1.7× what WCAG 1.4.11 asks of a boundary, so an 18px toggle read as heavy as the body text beside it and pulled the eye off the values it sat next to.

It now uses `border-on-control`, a new semantic token for a boundary drawn on a control's own fill rather than on the page. It has to flip where `border-strong` does not, because the surface it sits on — the off track — is light in the light theme and dark in the dark one: `neutral-500` is 3.67:1 on the light track, `neutral-400` is 3.92:1 on the dark one. The inverse pairing fails both ways, which is why the existing `text-tertiary` could not serve it.

The track's own border is unchanged. `neutral-500` is already the lightest step on the ramp that clears 3:1 against both the page and the grey band, so there is nothing lighter to move it to.
