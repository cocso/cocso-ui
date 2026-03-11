# project-storybook

## Goal

Provide an interactive component explorer for `@cocso-ui/react` so that designers and engineers can browse, develop, and visually test components in isolation.

## Path

```
apps/storybook/
```

## Runtime and Language

Storybook 10 + Vite 7 (TypeScript), React 19.

## Users

- UI engineers developing or reviewing components in `@cocso-ui/react`.
- Designers verifying component behavior and appearance.

## In Scope

- Story files (`.stories.tsx`) for all components in `@cocso-ui/react`.
- Interactive controls (args) for all component props.
- Static build artifact (`storybook-static/`) for deployment.

## Out of Scope

- Production application logic.
- End-to-end or integration tests — use Vitest in `@cocso-ui/react` for that.

## Architecture

```
apps/storybook/
├── .storybook/          # Storybook configuration (main.ts, preview.ts)
├── src/stories/         # Story files per component
└── storybook-static/    # Static build output (gitignored)
```

Depends on workspace packages:
- `@cocso-ui/react`
- `@cocso-ui/css`
- `@cocso-ui/react-icons`

## Interfaces

| Surface | Description |
|---|---|
| `pnpm storybook` | Local dev server at `http://localhost:6006` |
| `pnpm build:storybook` | Produces `storybook-static/` for static hosting |

## Storage

- Build output: `storybook-static/` (excluded from git).
- Vite cache: `node_modules/.cache/`.

## Security

- Local dev only; not exposed to the internet in development.
- No secrets or authentication required.

## Logging

Storybook and Vite dev server logs to stdout. No custom structured logging.

## Build and Test

```sh
# Development server
pnpm --filter @cocso-ui/storybook dev

# Static build
pnpm --filter @cocso-ui/storybook build

# From repo root
pnpm build:storybook
```

CI expects: `build` to pass.

## Roadmap

- Add visual regression testing (e.g. Chromatic).
- Achieve full story coverage for all `@cocso-ui/react` components.

## Open Questions

- None at this time.
