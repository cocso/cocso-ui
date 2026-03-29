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
- `PropertyCategory` type system + `categoryOf()`: centralized property key → semantic category mapping for resolvers.
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
│   ├── types.ts                 — StyleValue, RecipeDefinition, PropertyCategory
│   ├── index.ts                 — barrel exports
│   ├── utils/
│   │   ├── token-classification.ts  — isColorToken, isCompoundBorder, FONT_WEIGHT_MAP
│   │   └── property-categories.ts   — categoryOf() property key → semantic category mapping
│   ├── resolvers/
│   │   ├── react.ts             — resolveForReact() (camelCase keys, used by figma and internally)
│   │   └── react-styles.ts      — resolveStyleMap() (kebab-case keys + state suffixes, used by React components)
│   └── recipes/
│       ├── badge.recipe.ts
│       ├── button.recipe.ts
│       ├── checkbox.recipe.ts
│       ├── dialog.recipe.ts
│       ├── input.recipe.ts
│       ├── link.recipe.ts
│       ├── pagination.recipe.ts
│       ├── radio-group.recipe.ts
│       ├── select.recipe.ts
│       ├── spinner.recipe.ts
│       ├── stock-quantity-status.recipe.ts
│       ├── switch.recipe.ts
│       └── typography.recipe.ts
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
@cocso-ui/recipe                              — defineRecipe, types (incl. PropertyCategory)
@cocso-ui/recipe/resolvers/react              — resolveForReact
@cocso-ui/recipe/resolvers/react-styles       — resolveStyleMap
@cocso-ui/recipe/utils                        — isColorToken, isCompoundBorder, FONT_WEIGHT_MAP
@cocso-ui/recipe/utils/property-categories    — categoryOf
@cocso-ui/recipe/recipes/*                    — individual component recipes
```

### PropertyCategory — Property Key Classification

`categoryOf(key)` determines how resolvers interpret a property's value. Resolution order:

1. **Explicit map** — `PROPERTY_CATEGORIES` in `property-categories.ts`. Currently registered:
   - `color`: bgColor, fontColor, bladeColor, borderColor, fillColor, checkedBgColor, checkedThumbColor, switchBgColor
   - `radius`: borderRadius, bladeRadius
2. **Heuristic** — key contains "color" (case-insensitive) → `color`; key contains "radius" → `radius`
3. **Fallback** → `unknown` (value passed through as-is)

**When to register a new property**: only when the name does NOT contain "color" or "radius" but the value should be resolved as a token of that type. The heuristic covers most cases automatically.

## Storage

No persistent state. Recipes are TypeScript source files.

## Security

No security concerns — pure data package with no I/O.

## Logging

Not applicable.

## Build and Test

```bash
pnpm --filter @cocso-ui/recipe build    # tsc --project tsconfig.build.json
pnpm --filter @cocso-ui/recipe test     # vitest run (131 tests, includes react-styles snapshots + property-categories)
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

## Figma Parity — Golden Matrix Results

Golden matrix diagnostic compares `resolveForReact` vs `resolveForFigma` outputs across all variant combinations for every recipe. Run with `pnpm --filter @cocso-ui/figma golden-matrix`.

### Summary (13 recipes, 237 combinations, 1629 property comparisons)

| Recipe | Phase | Combos | VALUE_MISMATCH | Result |
|--------|-------|-------:|---------------:|--------|
| button | target | 96 | 0 | PASS |
| badge | target | 63 | 0 | PASS |
| input | target | 4 | 0 | PASS |
| select | extended | 4 | 0 | PASS |
| link | extended | 3 | 0 | PASS |
| checkbox | extended | 9 | 0 | PASS |
| switch | extended | 15 | 0 | PASS |
| radio-group | extended | 3 | 0 | PASS |
| spinner | extended | 21 | 0 | PASS |
| typography | extended | 10 | 0 | PASS |
| dialog | extended | 3 | 0 | PASS |
| pagination | extended | 3 | 0 | PASS |
| stock-quantity-status | extended | 3 | 0 | PASS |

### Known Difference Patterns

- **SILENT_DROP** (bgColor `transparent`): outline/similar variants — Figma drops transparent, which is semantically correct (no fill).
- **COMPOUND_SPLIT** (border): CompoundBorder decomposes into strokeColor + strokeWeight. borderStyle not preserved in Figma.
- **STATE_UNSUPPORTED**: `resolveForFigma` supports `state` option. Recipes with states: button (hover, active), link (hover), checkbox (hover), input (hover, focus), select (hover, focus), radio-group (hover), switch (hover), pagination (hover). Golden matrix gates on STATE_UNSUPPORTED = 0 for recipes with states.

### Designer Verification Checklist

Phase 3 success gate requires designer sign-off on the 3 target recipes (Button, Badge, Input):

- [ ] Button: all 8 variants, 4 sizes, 3 shapes match React rendering in Figma
- [ ] Badge: all 7 variants, 3 sizes, 3 shapes match React rendering in Figma
- [ ] Input: all 4 sizes match React rendering in Figma
- [ ] Figma hover/active states (Button) correctly reflect state-specific bgColor overrides
- [ ] Token names preserved in `_tokenRefs` are accessible in Figma plugin output

## Open Questions

- Should Typography responsive sizing (base/tablet/desktop) warrant a dedicated recipe format extension?
- Should recipes be published to npm for external consumers, or remain workspace-internal?
- ~~Should conformance tests be auto-generated from recipe variant enumerations?~~ Resolved: conformance tests are no longer needed. Components consume recipes directly via `resolveStyleMap()`, and `react-styles.test.ts` snapshot tests cover resolver correctness.
