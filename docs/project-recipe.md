# project-recipe

## Goal

Provide a single source of truth for component visual specs (variant-to-token mappings). Consumed at build time by `@cocso-ui/codegen` to generate CSS classes, className functions, and TypeScript types. Figma generation consumes recipes via `resolveForFigma()` (pre-resolved to JSON descriptors).

## Path

```
packages/recipe/
```

## Runtime and Language

TypeScript (pure data — zero runtime dependencies)

## Users

- **Codegen pipeline**: `@cocso-ui/codegen` imports recipes at build time to generate CSS, className functions, and TypeScript types.
- **Figma plugin**: generates Figma components from pre-resolved JSON descriptors (built from recipes via `resolveForFigma()`).
- **Design system maintainers**: recipes are the authoritative spec for variant→token mappings. `BaseSlotProperties` provides type-safe autocompletion for property names.

## In Scope

- `defineRecipe()` API with type-safe variant/slot/state/compoundVariant definitions.
- `BaseSlotProperties` interface: type-safe property names with semantic value constraints (35 known properties). Custom properties still allowed via index signature.
- `StyleValue` type system: `ColorTokenRef`, `RadiusTokenRef`, `SpacingTokenRef`, `FontWeightRef`, `CSSLiteral`, `NumericValue`, `CompoundBorder`, `ComponentRef`.
- `resolveForReact()` + `resolveStyleValue()`: recipe + variants → CSS custom property map. Used by codegen at build time.
- `PropertyCategory` type system + `categoryOf()`: centralized property key → semantic category mapping for resolvers.
- Component recipes for: Button, Badge, Input, Select, Link, StockQuantityStatus, Checkbox, Switch, Spinner, RadioGroup, Dialog, Typography, Pagination.

## Out of Scope

- CSS generation or class name generation (handled by `@cocso-ui/codegen`).
- Figma resolver (`resolveForFigma` lives in `packages/figma/`, not here).

## Recipe Fitness Evaluation (C1/C2/C3 Criteria)

### Criteria

| Criterion | Description | Required |
|---|---|---|
| C1: Visual variants | 2+ visual variant dimensions (color, size, shape) exist or are planned | Yes |
| C2: CSS token references | CSS Module uses `var(--cocso-*)` tokens for visual properties | Yes |
| C3: Slot/Variant pattern | Component structure expressible as single-slot + variant combinations | Yes |

All three criteria must pass for a component to be eligible for a recipe. Components without recipes use spec-based Figma generation via `generateFromExtractedSpecs` instead.

### Evaluation Results (10 components without recipes)

| Component | C1 | C2 | C3 | Tokens | Verdict | Reason |
|---|---|---|---|---|---|---|
| tab | NO | NO | NO | 0 | Headless passthrough | Pure delegation to Tabs primitive, no visual layer |
| toast | NO | NO | NO | 0 | Third-party re-export | Re-exports `{ Toaster, toast }` from sonner |
| accordion | NO | PARTIAL (3) | PARTIAL | 3 | Structural-only | No variant dimensions; token coverage minimal (animation not tokenized) |
| tooltip | NO | YES (11) | PARTIAL | 11 | Single-appearance overlay | Strong token coverage but single fixed appearance (dark pill), no variant axis |
| popover | NO | YES (17) | PARTIAL | 17 | Single-appearance overlay | Strongest token coverage, single fixed appearance (light card), no variant axis |
| dropdown | NO | YES (14) | PARTIAL | 14 | Single-appearance overlay | Good token coverage, single fixed appearance (light panel), no variant axis |
| field | NO | YES (14) | PARTIAL | 14 | Composite with state | Error/default state-driven styling across multiple sub-elements, not a variant dimension |
| one-time-password-field | NO | YES (11) | PARTIAL | 11 | Single-variant + state | Active/inactive state on slots, hardcoded sizing |
| day-picker | NO | YES (20) | NO | 20 | Third-party wrapper | `:global()` overrides on react-datepicker DOM, not composable as recipe slots |
| month-picker | NO | YES (20) | NO | 20 | Third-party wrapper | Same `:global()` pattern as day-picker |

**Summary**: None of the 10 components pass C1+C2+C3 (all required). All remain out of scope for recipes with documented reasons. SSOT coverage remains 19/29 (65.5% total) / 19/19 (100% visual-recipe).

### Re-evaluation Candidates

- **tooltip, popover, dropdown**: Strong C2 coverage. If design adds variant dimensions (e.g., tooltip light/dark, popover size), these become immediate recipe candidates.
- **field**: Error/default state could be modeled as a `status` variant if the component is refactored to single-slot styling.
- **one-time-password-field**: If a `size` dimension is added, becomes eligible.

### Deferred (structural blockers)

- **day-picker, month-picker**: Require replacing `:global()` CSS overrides on react-datepicker with owned slot components before recipe work can begin.
- **accordion**: Needs animation tokenization (replace bare `--accordion-panel-height` with `--cocso-*` token) and a visual variant dimension.
- **tab**: Recipe should target the headless primitive library, not this passthrough wrapper.
- **toast**: Owned by sonner; no visual surface to encode.

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
- `@cocso-ui/codegen` → devDependency on recipe (build-time import for code generation)
- `@cocso-ui/react` → dependency on codegen (consumes generated CSS + className functions, NO runtime dependency on recipe)
- `@cocso-ui/figma` → dependency on recipe (for resolveForFigma) + reads codegen Figma JSON

### Conflict Resolution Protocol

Recipe is the single source of truth. When component styles need to change:
1. Update the recipe definition.
2. Run `pnpm --filter @cocso-ui/codegen generate` to regenerate CSS, className functions, and types.
3. Changes propagate to React components via generated artifacts. CI diff gate ensures freshness.

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

- **Phase 1-2 (done)**: 13 component recipes + React resolver + Figma resolver + codegen pipeline.
- **Direction B codegen (done)**: Build-time code generation replaces runtime resolveStyleMap. React components consume generated CSS + className functions. Zero runtime dependency on recipe package.
- **Phase 5a (done)**: BaseSlotProperties interface for type-safe recipe authoring (35 known properties).
- **Future**: Typography recipe responsive sizing support. Auto-generate TokenCatalog from baseframe YAML.

## Figma Parity — Golden Matrix Results

Golden matrix diagnostic compares `resolveForReact` vs `resolveForFigma` outputs across all variant combinations for every recipe. Run with `pnpm --filter @cocso-ui/figma golden-matrix`.

### Summary (19 recipes, 309 combinations)

| Recipe | Phase | Combos | VALUE_MISMATCH | Result |
|--------|-------|-------:|---------------:|--------|
| alert | phase4 | 4 | 0 | PASS |
| avatar | phase4 | 10 | 0 | PASS |
| badge | target | 63 | 0 | PASS |
| breadcrumb | phase4 | 3 | 0 | PASS |
| button | target | 96 | 0 | PASS |
| card | phase4 | 9 | 0 | PASS |
| checkbox | extended | 9 | 0 | PASS |
| dialog | extended | 3 | 0 | PASS |
| input | target | 4 | 0 | PASS |
| link | extended | 3 | 0 | PASS |
| pagination | extended | 3 | 0 | PASS |
| progress | phase4 | 18 | 0 | PASS |
| radio-group | extended | 3 | 0 | PASS |
| select | extended | 4 | 0 | PASS |
| skeleton | phase4 | 9 | 0 | PASS |
| spinner | extended | 21 | 0 | PASS |
| stock-quantity-status | extended | 3 | 0 | PASS |
| switch | extended | 15 | 0 | PASS |
| typography | extended | 10 | 0 | PASS |

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
