# Phase 4: New Components

## Goal

Expand cocso-ui's component coverage with 6 commonly expected design system components, enabling internal product development with cocso-ui alone. All components are built codegen-native via the established recipe pipeline. (Tag was excluded due to overlap with Badge.)

## Path

- `packages/recipe/src/recipes/{name}.recipe.ts` (recipe definitions)
- `packages/codegen/generated/{name}.css|.ts|.d.ts` (generated artifacts)
- `packages/react/src/components/{name}/` (React components)
- `packages/figma/src/generators/components/{name}.ts` (Figma generators)

## Runtime and Language

TypeScript. Consumed via `@cocso-ui/react` (React 19), `@cocso-ui/codegen` (build-time), `@cocso-ui/figma` (Figma plugin).

## Users

Internal product developers consuming `@cocso-ui/react`. Designers consuming Figma components.

## In Scope

Seven components in priority order:

| Component | Variants | Description |
|-----------|----------|-------------|
| avatar | size (xs/sm/md/lg/xl), shape (circle/square) | User or entity visual identifier |
| card | variant (elevated/outlined/filled), padding (sm/md/lg) | Content container with optional header/body/footer |
| alert | variant (info/success/warning/error) | Contextual feedback message |
| progress | variant (primary/secondary/success/warning/error/info), size (sm/md/lg) | Determinate progress indicator |
| breadcrumb | size (sm/md/lg) | Navigation hierarchy indicator. Uses ChevronRightIcon as default separator. |
| skeleton | variant (text/circular/rectangular), animation (pulse/wave/none) | Loading placeholder |

Each component includes: recipe, codegen artifacts, React component, CSS module, Storybook stories, Figma generator, parity test coverage.

## Out of Scope

- Table / data-table (XL complexity, separate project document required)
- Dark mode variants (planned separately)
- Multi-slot recipe support (all components use single-slot `["root"]`)
- Design specs from Figma (designed from common patterns of mature design systems)

## Architecture

All 6 components follow the single-slot pattern established by the existing 13 components:

```
recipe (slots: ["root"])
  -> codegen: CSS classes + className function + TypeScript types
  -> React: imports from @cocso-ui/codegen/generated/*, CSS module for sub-elements
  -> Figma: resolveForFigma() + generator
  -> Parity: codegen-parity.test.ts matrix entry
```

Sub-element styling (e.g., card header/body/footer) is handled by CSS modules, not recipe slots. This is consistent with how dialog, select, checkbox, and switch handle sub-elements today.

## Interfaces

### Recipe Pattern

```typescript
export const {name}Recipe = defineRecipe({
  name: "{name}",
  slots: ["root"] as const,
  variants: { /* dimension -> value -> { root: { ...tokens } } */ },
  defaultVariants: { /* ... */ },
});
```

### React Component Pattern

```typescript
// Inline type aliases (no re-export from codegen)
export type {Name}Variant = "..." | "...";

export interface {Name}Props extends ComponentProps<"div"> {
  variant?: {Name}Variant;
}

export function {Name}({ variant, className, ...props }: {Name}Props) {
  return <div className={cn({name}({ variant }), styles.root, className)} {...props} />;
}
```

## Storage

No persistent storage. Generated artifacts committed to `packages/codegen/generated/`.

## Security

No security concerns. Pure presentational components with no data handling.

## Logging

Codegen pipeline logs generation progress via console. No runtime logging.

## Build and Test

```bash
# After recipe changes
pnpm --filter @cocso-ui/codegen generate

# Validation
pnpm check          # lint + typecheck
pnpm test           # parity tests + inline type sync
pnpm build          # full build

# Per-component
pnpm test --filter @cocso-ui/codegen    # parity + inline type sync
pnpm test --filter @cocso-ui/figma      # Figma resolver tests
```

CI enforces codegen freshness: stale generated files fail the build.

## Roadmap

All 6 components completed in PR #152:

1. ✅ avatar — size (xs–xl), shape (circle/square)
2. ✅ card — variant (elevated/outlined/filled), padding (sm–lg)
3. ✅ alert — variant (info/success/warning/error), icon + close
4. ✅ progress — variant (primary–info), size (sm–lg)
5. ✅ breadcrumb — size (sm–lg), ChevronRightIcon separator
6. ✅ skeleton — variant (text/circular/rectangular), animation (pulse/wave/none)
7. ~~tag~~ — excluded (overlap with Badge)

## Open Questions

- Color scheme support for tag component: fixed palette or configurable via recipe?
- Progress component: linear only, or also circular variant?
- Skeleton animation: CSS-only or JavaScript-driven wave effect?
