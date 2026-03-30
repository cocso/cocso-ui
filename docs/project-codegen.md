# project-codegen

## Goal

Generate build-time artifacts (CSS classes, className functions, TypeScript types, Figma JSON descriptors) from recipe definitions. Eliminates runtime style resolution in React components, providing zero-runtime CSS, typed variant props, and pre-resolved Figma data from a single recipe source of truth.

## Path

```
packages/codegen/
```

## Runtime and Language

TypeScript (build-time tool, uses `tsx` for recipe import)

## Users

- **React developers**: import generated className functions and CSS instead of calling resolveStyleMap at runtime.
- **Figma plugin**: consumes generated `.figma.json` descriptors with pre-resolved specs.
- **CI pipeline**: validates generated files are fresh via `pnpm codegen && git diff --exit-code`.

## In Scope

- `generate-recipe.ts`: core code generation engine (CSS, className functions, TypeScript types).
- `generate.ts`: orchestrator that imports all 19 recipes and invokes generation.
- Per-dimension CSS generation (BEM classes setting CSS custom properties).
- State-suffixed CSS custom properties for CSS Module compatibility.
- Spinner geometry static data extraction (`spinner-geometry.ts`).
- Figma JSON generation via `packages/figma/scripts/generate-figma-json.ts`.
- Codegen parity tests (409 tests verifying generated output matches resolveStyleMap).

## Out of Scope

- Runtime style resolution (handled by `@cocso-ui/recipe` resolvers, now build-time only).
- Figma Plugin API interactions (handled by `@cocso-ui/figma` generators).
- CSS Module structural styles (layout, transitions, animations — remain in component CSS Modules).
- New component creation (recipes and React components are authored in their respective packages).

## Architecture

```
@cocso-ui/recipe (build-time input)
    │
    ├─→ generate-recipe.ts
    │   ├─ resolveStyleValue() reuse → CSS class rules
    │   ├─ recipe type extraction → TypeScript literal unions
    │   └─ className function generation
    │
    ├─→ generate.ts (orchestrator)
    │   ├─ imports all 19 recipes via tsx
    │   ├─ generates CSS + TS + DTS per recipe
    │   └─ generates spinner-geometry.ts
    │
    └─→ generate-figma-json.ts (in @cocso-ui/figma)
        ├─ calls resolveForFigma() per variant combo
        └─ serializes to .figma.json

Output: packages/codegen/generated/
    ├── {recipe}.css           # BEM CSS classes with CSS custom properties
    ├── {recipe}.ts            # className composition function
    ├── {recipe}.d.ts          # TypeScript type declarations
    ├── {recipe}.figma.json    # Pre-resolved Figma specs
    └── spinner-geometry.ts    # Static blade geometry data
```

### Dependency Direction

- `@cocso-ui/codegen` → devDependency on `@cocso-ui/recipe` (build-time import only)
- `@cocso-ui/react` → devDependency on `@cocso-ui/codegen` (rollup bundles generated output at build time; codegen must NOT appear in published dependencies or .d.ts)
- `@cocso-ui/figma` → reads generated `.figma.json` from codegen output

> **Important:** React components must NOT re-export types from `@cocso-ui/codegen` via `export type { X } from "@cocso-ui/codegen/..."`. Since codegen is a devDependency and `private: true`, such re-exports leak unresolvable bare specifiers into the published `.d.ts` files. Instead, inline the type aliases directly in the React source files.

### CSS Generation Strategy

Per-dimension rules (not Cartesian product) for compact output:

```css
/* Per variant value */
.cocso-button.cocso-button--variant-primary {
  --cocso-button-bg-color: var(--cocso-color-primary-950);
  --cocso-button-font-color: var(--cocso-color-white);
  --cocso-button-bg-color-hover: var(--cocso-color-primary-800);
}

/* Per size value */
.cocso-button.cocso-button--size-medium {
  --cocso-button-height: 36px;
  --cocso-button-padding-inline: 12px;
}

/* Compound variants only */
.cocso-button.cocso-button--shape-square.cocso-button--size-large {
  --cocso-button-border-radius: var(--cocso-radius-4);
}
```

816 total CSS lines across 19 recipes (duplicate selectors merged; vs 1744 lines for button alone with Cartesian product). All generated CSS references semantic token `var()` (e.g., `var(--cocso-color-interactive-primary)`) — no primitive direct references.

## Interfaces

### Generated className function

```typescript
export function button(props?: ButtonVariantProps): string;
// Returns: "cocso-button cocso-button--variant-primary cocso-button--size-medium cocso-button--shape-square"
```

### Generated types

```typescript
export interface ButtonVariantProps {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "success" | "error" | "warning" | "info";
  size?: "large" | "medium" | "small" | "x-small";
  shape?: "square" | "circle" | "rounded";
}
```

### Package exports

```json
{
  "./generated/*.css": "./generated/*.css",
  "./generated/*": {
    "types": "./generated/*.d.ts",
    "default": "./generated/*.ts"
  }
}
```

CSS files are matched by the first (more specific) pattern; extensionless TS imports are matched by the second pattern with explicit `types` condition for TypeScript resolution.

## Storage

Generated files are committed to git. CI validates freshness via diff gate.

## Security

No security concerns — build-time code generation with no I/O beyond file writes.

## Logging

Generation script logs per-recipe output (file name, line count).

## Build and Test

```bash
pnpm --filter @cocso-ui/recipe build                # prerequisite: build recipe types
pnpm --filter @cocso-ui/codegen generate             # generate all 13 recipes
pnpm --filter @cocso-ui/figma generate:figma-json    # generate Figma JSON descriptors
pnpm --filter @cocso-ui/codegen test                 # 276 parity tests
```

CI gate in `.github/workflows/ci.yml`:
```yaml
- name: Codegen Freshness
  run: |
    pnpm --filter @cocso-ui/recipe build
    pnpm --filter @cocso-ui/codegen generate
    git diff --exit-code packages/codegen/generated/
```

## Roadmap

- **Phase 1-2 (done)**: codegen pipeline, React migration, Figma JSON, CI gate.
- **Next**: Phase 4 new components (avatar, card, alert, tag, progress, breadcrumb, skeleton) — recipes authored in `@cocso-ui/recipe`, codegen generates artifacts automatically.
- **Future**: dark mode support via CSS variable mode splitting in generated CSS.

## Open Questions

- Should generated files be gitignored and generated in CI instead of committed? Current decision: committed + CI diff gate.
