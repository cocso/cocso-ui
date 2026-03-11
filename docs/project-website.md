# project-website

## Goal

Provide the public documentation site for the cocso design system, offering component usage guides, design token references, and getting-started instructions for teams adopting `@cocso-ui`.

## Path

```
apps/website/
```

## Runtime and Language

Next.js 16 (TypeScript), React 19. MDX content powered by fumadocs.

## Users

- Frontend engineers evaluating or integrating `@cocso-ui` packages.
- Design system maintainers publishing documentation.

## In Scope

- Documentation pages authored in MDX.
- Component API reference pages.
- Design token reference pages.
- Full-text search via fumadocs search API.
- Analytics via PostHog.

## Out of Scope

- Interactive component editing (handled by Storybook).
- User authentication or personalized content.

## Architecture

```
apps/website/
├── src/
│   ├── app/                  # Next.js App Router pages and layouts
│   │   └── api/search/       # Full-text search API route (fumadocs)
│   ├── libs/
│   │   └── source.ts         # fumadocs source loader
│   └── constants/
│       └── variables.ts      # Site-wide constants
├── content/                  # MDX documentation source files (planned)
├── source.config.ts          # fumadocs MDX configuration
└── next.config.ts            # Next.js configuration with fumadocs MDX plugin
```

Depends on workspace packages:
- `@cocso-ui/react`
- `@cocso-ui/css`
- `@cocso-ui/react-icons`

## Interfaces

### Routes

| Pattern | Description |
|---|---|
| `/` | Homepage |
| `/docs/[...slug]` | Documentation pages (MDX) |
| `/api/search` | Full-text search endpoint (fumadocs) |

### Environment Variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_POSTHOG_KEY` | PostHog analytics project API key |
| `NEXT_PUBLIC_POSTHOG_HOST` | PostHog instance host URL |

All API base URLs must be stored in environment variables — never hardcoded.

## Storage

- MDX source files in `content/` (git-tracked).
- fumadocs build cache in `.source/` (gitignored).
- No database or persistent server state.

## Security

- No user authentication.
- PostHog key is public (client-side analytics only).
- No sensitive data collected or stored.

## Logging

- Next.js default server logging.
- PostHog captures page views and custom events client-side.

## Build and Test

```sh
# Development server
pnpm --filter @cocso-ui/website dev

# Production build (includes fumadocs prebuild step)
pnpm --filter @cocso-ui/website build

# Lint
pnpm --filter @cocso-ui/website lint
```

CI expects: `build`, `lint` to pass.

## Roadmap

- Add full component API reference pages.
- Add design token visual reference.
- Add getting-started guide with code snippets.

## Open Questions

- None at this time.
