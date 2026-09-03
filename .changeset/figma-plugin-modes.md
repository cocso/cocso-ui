---
"@cocso-ui/figma": patch
---

Create the modes the token export declares when syncing to Figma.

The sync forced the collection to a single mode named `default`, from when the
sources had one. They now declare `light` and `dark`, and a mode the collection
does not have has no id — so every variable would have been created with no
values at all, silently, and the sync would have reported success.

The file had no tests, which is why the migration to two modes did not surface
it. It has three now, covering the modes being created, a value written for
each of them, and an existing mode being reused.
