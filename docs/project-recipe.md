# Project: @cocso-ui/recipe

## Goal

Provide a single, CI-enforced declarative mirror for component visual specs (variant-to-token mappings). Both React conformance tests and Figma generation consume recipes, preventing silent drift between platforms.

## Path

- `packages/recipe/`

## Runtime and Language

TypeScript (pure data — zero runtime dependencies)

## Users

- **React developers**: conformance tests verify React style functions match recipes.
- **Figma plugin**: generates Figma components from recipe data via `resolveForFigma()`.
- **Design system maintainers**: recipes are the authoritative spec for variant→token mappings.

## In Scope

- `defineRecipe()` API with type-safe variant/slot/state/compoundVariant definitions.
- `StyleValue` type system: `ColorTokenRef`, `RadiusTokenRef`, `SpacingTokenRef`, `FontWeightRef`, `CSSLiteral`, `NumericValue`, `CompoundBorder`, `ComponentRef`.
- `resolveForReact()`: recipe + variants → CSS custom property map.
- Component recipes for: Button, Badge, Input, Select, Link, StockQuantityStatus, Checkbox, Switch, Spinner, RadioGroup.

## Out of Scope

- CSS generation or class name generation (unlike seed-design/Panda CSS).
- Recipes for structural-only components (Accordion, Tab, Tooltip, Dialog, Popover, Dropdown, Toast, Field).
- Recipes for third-party wrappers (DayPicker, MonthPicker, OTPField).
- Figma resolver (`resolveForFigma` lives in `packages/figma/`, not here).

## Architecture

```
@cocso-ui/recipe (upstream, zero deps)
├── src/
│   ├── define-recipe.ts         — defineRecipe() identity function
│   ├── types.ts                 — StyleValue, RecipeDefinition, TokenCatalog
│   ├── index.ts                 — barrel exports
│   ├── resolvers/
│   │   └── react.ts             — resolveForReact()
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
- `@cocso-ui/react` → devDependency on recipe (for conformance tests only)
- `@cocso-ui/figma` → dependency on recipe (for component generation)

### Conflict Resolution Protocol

When a conformance test fails (recipe ↔ React mismatch):
1. **Recipe is authoritative** for design intent.
2. Was the recipe intentionally updated? → Update React to match.
3. Was React intentionally updated? → Update recipe first, then conformance test passes.

## Interfaces

### `defineRecipe<V, S>(recipe: RecipeDefinition<V, S>)`

Identity function providing type inference. Returns the recipe unchanged.

### `resolveForReact(recipe, variants, options?)`

Returns `Record<string, string>` — CSS custom property map.

### Recipe exports pattern

```
@cocso-ui/recipe                    — defineRecipe, types
@cocso-ui/recipe/resolvers/react    — resolveForReact
@cocso-ui/recipe/recipes/*          — individual component recipes
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
pnpm --filter @cocso-ui/recipe test     # vitest run (25 tests)
pnpm --filter @cocso-ui/recipe lint     # biome check
```

Conformance tests run in `@cocso-ui/react`:
```bash
pnpm --filter @cocso-ui/react test      # includes 166 recipe conformance tests
```

## Roadmap

- **Phase 1 (done)**: 10 component recipes + React resolver + Figma resolver + conformance tests.
- **Phase 2 (planned)**: Typography recipe with responsive sizing support.
- **Phase 3 (planned)**: Auto-generate `TokenCatalog` from baseframe YAML to prevent token name drift.
- **Phase 4 (potential)**: Recipe-driven Storybook arg generation.

## CSS Property Naming Convention

Recipe property keys and React CSS custom properties use different naming conventions:

- **Recipe data model**: property keys use camelCase (e.g., `bgColor`, `fontColor`, `paddingInline`, `borderRadius`). These names are the canonical identifiers in the recipe definition and are platform-agnostic.
- **React CSS custom properties**: the React resolver emits CSS custom properties in kebab-case with a component prefix (e.g., `--cocso-button-bg-color`, `--cocso-button-font-color`). This follows the CSS custom property convention where names are lowercase and hyphen-separated.
- **Conformance tests**: bridge the two conventions by comparing resolved values (not property names). A conformance test verifies that `resolveForReact(recipe, variants)["--cocso-button-bgColor"]` matches the React style function output for the same variant, ensuring both produce the same token-resolved value regardless of how the property name is formatted.

## Open Questions

- Should Typography responsive sizing (base/tablet/desktop) warrant a dedicated recipe format extension?
- Should recipes be published to npm for external consumers, or remain workspace-internal?
- Should conformance tests be auto-generated from recipe variant enumerations?
