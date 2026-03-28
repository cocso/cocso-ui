# project-recipe

## Goal

Provide a single source of truth for component visual specs (variant-to-token mappings). React components consume recipes directly via `resolveStyleMap()`, eliminating the need for manual `.styles.ts` mirrors. Figma generation consumes recipes via `resolveForFigma()`.

## Path

```
packages/recipe/
```

## Runtime and Language

TypeScript (pure data — zero runtime dependencies)

## Users

- **React developers**: components consume recipes directly via `resolveStyleMap()`. No separate `.styles.ts` files or conformance tests needed.
- **Figma plugin**: generates Figma components from recipe data via `resolveForFigma()`.
- **Design system maintainers**: recipes are the authoritative spec for variant→token mappings.

## In Scope

- `defineRecipe()` API with type-safe variant/slot/state/compoundVariant definitions.
- `StyleValue` type system: `ColorTokenRef`, `RadiusTokenRef`, `SpacingTokenRef`, `FontWeightRef`, `CSSLiteral`, `NumericValue`, `CompoundBorder`, `ComponentRef`.
- `resolveForReact()`: recipe + variants → CSS custom property map.
- Component recipes for: Button, Badge, Input, Select, Link, StockQuantityStatus, Checkbox, Switch, Spinner, RadioGroup, Dialog, Typography, Pagination.

## Out of Scope

- CSS generation or class name generation (unlike seed-design/Panda CSS).
- Recipes for structural-only components (Accordion, Tab, Tooltip, Popover, Dropdown, Toast, Field, OTPField). These components use spec-based Figma generation via `generateFromExtractedSpecs` instead.
- Recipes for third-party wrappers (DayPicker, MonthPicker). Deferred pending evaluation of calendar grid extraction quality.
- Figma resolver (`resolveForFigma` lives in `packages/figma/`, not here).

## Architecture

```
@cocso-ui/recipe (upstream, zero deps)
├── src/
│   ├── define-recipe.ts         — defineRecipe() identity function
│   ├── types.ts                 — StyleValue, RecipeDefinition, TokenCatalog
│   ├── index.ts                 — barrel exports
│   ├── resolvers/
│   │   ├── react.ts             — resolveForReact() (camelCase keys, used by figma and internally)
│   │   └── react-styles.ts      — resolveStyleMap() (kebab-case keys + state suffixes, used by React components)
│   └── recipes/
│       ├── button.recipe.ts
│       ├── badge.recipe.ts
│       ├── input.recipe.ts
│       ├── select.recipe.ts
│       ├── link.recipe.ts
│       ├── stock-quantity-status.recipe.ts
│       ├── checkbox.recipe.ts
│       ├── switch.recipe.ts
│       ├── spinner.recipe.ts
│       └── radio-group.recipe.ts
```

### Dependency Direction

- `@cocso-ui/recipe` → zero dependencies (pure TypeScript data)
- `@cocso-ui/react` → runtime dependency on recipe (direct consumption via `resolveStyleMap()`)
- `@cocso-ui/figma` → dependency on recipe (for component generation)

### Conflict Resolution Protocol

Recipe is the single source of truth. When component styles need to change:
1. Update the recipe definition.
2. `resolveStyleMap()` propagates the change to the React component automatically — no manual `.styles.ts` sync required.

### CSS Property Naming Convention

- **Recipe data model**: property keys use camelCase (e.g., `bgColor`, `fontColor`, `paddingInline`, `borderRadius`). These names are platform-agnostic canonical identifiers.
- **`resolveForReact()` output**: preserves camelCase in CSS custom property names (e.g., `--cocso-button-bgColor`). Used internally and by Figma resolver.
- **`resolveStyleMap()` output**: converts camelCase to kebab-case (e.g., `--cocso-button-bg-color`). Used directly by React components as inline CSS custom properties. Also produces state-suffixed keys (e.g., `--cocso-button-bg-color-hover`) for explicitly overridden state properties.

## Interfaces

### `defineRecipe<V, S>(recipe: RecipeDefinition<V, S>)`

Identity function providing type inference. Returns the recipe unchanged.

### `resolveForReact(recipe, variants, options?)`

Returns `Record<string, string>` — CSS custom property map with camelCase keys (e.g., `--cocso-button-bgColor`). Used internally and by Figma resolver.

### `resolveStyleMap(recipe, variants, options?)`

Returns `Record<string, string>` — CSS custom property map with kebab-case keys (e.g., `--cocso-button-bg-color`). Supports `options.states` for state-suffixed keys. Used directly by React components.

### Recipe exports pattern

```
@cocso-ui/recipe                          — defineRecipe, types
@cocso-ui/recipe/resolvers/react          — resolveForReact
@cocso-ui/recipe/resolvers/react-styles   — resolveStyleMap
@cocso-ui/recipe/recipes/*                — individual component recipes
```

## Storage

No persistent state. Recipes are TypeScript source files.

## Security

No security concerns — pure data package with no I/O.

## Logging

Not applicable.

## Build and Test

```bash
pnpm --filter @cocso-ui/recipe build    # tsc --project tsconfig.build.json
pnpm --filter @cocso-ui/recipe test     # vitest run (104 tests, includes react-styles snapshot tests)
pnpm --filter @cocso-ui/recipe lint     # biome check
```

Component integration verified in `@cocso-ui/react`:
```bash
pnpm --filter @cocso-ui/react test      # 365 tests (component behavior tests; conformance tests removed)
```

## Roadmap

- **Phase 1 (done)**: 10 component recipes + React resolver + Figma resolver + conformance tests.
- **Phase 2 (planned)**: Typography recipe responsive sizing support (base-size-only currently; responsive breakpoints deferred).
- **Phase 3 (planned)**: Auto-generate `TokenCatalog` from baseframe YAML to prevent token name drift.
- **Phase 4 (potential)**: Recipe-driven Storybook arg generation.

## Open Questions

- Should Typography responsive sizing (base/tablet/desktop) warrant a dedicated recipe format extension?
- Should recipes be published to npm for external consumers, or remain workspace-internal?
- ~~Should conformance tests be auto-generated from recipe variant enumerations?~~ Resolved: conformance tests are no longer needed. Components consume recipes directly via `resolveStyleMap()`, and `react-styles.test.ts` snapshot tests cover resolver correctness.
