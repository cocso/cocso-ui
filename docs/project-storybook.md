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
├── globals.css          # Global styles for Storybook preview
└── storybook-static/    # Static build output (gitignored)
```

Story files are colocated with their components, not in this app:
- `packages/react/src/components/<name>/<name>.stories.tsx` — component stories.
- `packages/react-icons/src/icons.stories.tsx` — icon catalog story.

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

## Visual Regression Testing

Visual regression tests run in CI via the `visual-regression` job in `.github/workflows/ci.yml`.

### Architecture

- **Test runner:** `@storybook/test-runner` with `jest-image-snapshot`
- **Browser:** Playwright Chromium (pinned via lockfile)
- **Threshold:** 0.01% pixel diff (configured in `.storybook/test-runner.ts`)
- **Snapshots:** PNG files in `__snapshots__/`, committed to repo
- **CI behavior:** `--ci` mode when baselines exist (fail on missing/diff); graceful skip when no baselines

### Baseline Management

Ubuntu-generated baselines are the source of truth. Use the `Update Visual Regression Baselines` workflow (`workflow_dispatch`) to generate or update baselines:

1. Go to Actions → "Update Visual Regression Baselines"
2. Select target branch
3. Workflow generates baselines on Ubuntu and auto-commits

Local (macOS) visual tests are advisory only — font rasterizer differences (Core Text vs FreeType) may cause false positives.

### Scripts

| Command | Description |
|---|---|
| `pnpm --filter @cocso-ui/storybook test:visual` | Run visual tests locally |
| `pnpm --filter @cocso-ui/storybook test:visual -- --updateSnapshot` | Update local baselines |
| `pnpm --filter @cocso-ui/storybook test:visual -- --ci` | CI mode (fail on missing baselines) |

## Roadmap

- Achieve full story coverage for all `@cocso-ui/react` components.
- Evaluate cloud-based visual regression service (Chromatic/Argos) when snapshot count exceeds 200.

## Open Questions

- None at this time.
