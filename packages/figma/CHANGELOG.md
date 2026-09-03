# @cocso-ui/figma

## 0.0.5

### Patch Changes

- a418350: Create the modes the token export declares when syncing to Figma.

  The sync forced the collection to a single mode named `default`, from when the
  sources had one. They now declare `light` and `dark`, and a mode the collection
  does not have has no id — so every variable would have been created with no
  values at all, silently, and the sync would have reported success.

  The file had no tests, which is why the migration to two modes did not surface
  it. It has three now, covering the modes being created, a value written for
  each of them, and an existing mode being reused.

## 0.0.4

### Patch Changes

- 4af82b5: Carry both themes into the Figma token export.

  The generator read `values.default` from every token, so once the semantic
  layer moved to a `light`/`dark` collection it dropped all of them — the export
  went from 201 tokens to 143 with the semantic layer missing entirely. It now
  resolves each token once per mode, through a ramp map built for that mode, so
  `color/feedback/danger` reaches `danger-500` in light and `danger-400` in dark.

  All 215 exported tokens carry both modes. Primitives carry the same value in
  both, which is what they do in CSS. Component generation reads the light value.

## 0.0.3

### Patch Changes

- Updated dependencies [03f8bf3]
  - @cocso-ui/recipe@0.0.2

## 0.0.2

### Patch Changes

- Updated dependencies [17504b4]
  - @cocso-ui/baseframe-sources@0.2.0
