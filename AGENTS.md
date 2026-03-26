### Instructions

- Use the `docs/` directory as the source of truth for project contracts and implementation documents.
- All repository-wide rules must be defined in this `AGENTS.md`.
- List files in `docs/` before starting each task, and keep `docs/` up-to-date.
- After completing each task, update the relevant `AGENTS.md` and `docs/` files in the same change when policies, structure, or contracts changed.
- Write all code and comments in English.
- Prefer enum types over string literals whenever possible.
- If you modified frontend code, run `pnpm check` from the repository root before finishing your task.
- Commit when each logical unit of work is complete; do NOT use the `--no-verify` flag.
- Run `git commit` only after `git add`; keep each commit atomic and independently revertible.
- If a commit fails because workspace binaries are missing, run `pnpm install` at the repository root and retry.
- After addressing pull request review comments and pushing updates, mark the corresponding review threads as resolved.
- When no explicit scope is specified and you are currently working within a pull request scope, interpret instructions within the current pull request scope.
- Do not guess; search the web instead.
- When accessing `github.com`, use the GitHub CLI (`gh`) instead of browser-based workflows when possible.
- Prefer React Query for frontend server-state management.
- Rules using MUST/NEVER are mandatory. Rules using prefer/whenever possible are guidance.

### Monorepo Structure Map

- `docs/`: Source of truth for project contracts and repository documentation.
  - `docs/project-template.md`: Required structure for every new project document.
  - `docs/project-<id>.md`: Per-project contract document (created before implementation begins).
- `apps/`: Standalone applications consumed by end users or developers.
  - `apps/storybook/`: `@cocso-ui/storybook` — component explorer (Storybook 10 + Vite).
  - `apps/website/`: `@cocso-ui/website` — documentation site (Next.js 16 + fumadocs).
- `packages/`: Shared, publishable packages consumed across apps and external projects.
  - `packages/react/`: `@cocso-ui/react` — React component library.
  - `packages/css/`: `@cocso-ui/css` — design tokens and CSS.
  - `packages/react-icons/`: `@cocso-ui/react-icons` — icon set.
  - `packages/baseframe/`: `@cocso-ui/baseframe-sources` — YAML component source definitions.
  - `packages/recipe/`: `@cocso-ui/recipe` — component visual spec recipes (single source of truth for variant→token mappings, consumed by React conformance tests and Figma generation).
  - `packages/figma/`: `@cocso-ui/figma` — Figma plugin for syncing design tokens to Figma Variables and generating components from recipes.
- `ecosystem/`: Tooling that wraps or consumes packages for developer workflows.
  - `ecosystem/baseframe/`: `@cocso-ui/baseframe` — CLI for scaffolding components from YAML.
- `AGENTS.md`: This file — repository-wide rules.
- `biome.jsonc`: Lint and format configuration (Biome).
- `turbo.json`: Turborepo pipeline configuration.
- `pnpm-workspace.yaml`: Workspace package glob patterns.
- `package.json`: Root package with shared dev tooling.

### Documentation Policy

- New app or package creation requires a `docs/project-<id>.md` before implementation begins.
- Every structural change to project paths must update the corresponding `docs/` file in the same change.
- Repository-wide policy updates must be written in this `AGENTS.md` in the same change.

### Naming Rules

- Use lowercase kebab-case for app and package directory names.
- Use enum-like canonical identifiers in documents where values must remain stable.
- Package names follow the pattern `@cocso-ui/<name>`.

### GitHub Issue Style Contract

- Use issue titles in the format `<domain>: <description>`.
- `<domain>` must use a stable lowercase identifier (e.g. `storybook`, `website`, `react`, `css`, `baseframe`, `ecosystem`).
- `<description>` should be concise and specific, starting with a lowercase verb phrase when possible.
- Do not use bracket-style prefixes like `[react]`.
- Use the following Markdown section order for issue bodies:
  - `## Summary`
  - `## Evidence`
  - `## Current Gap`
  - `## Proposed Scope`
  - `## Acceptance Criteria`
  - `## Out of Scope`
- Optional `## Additional Notes` may be appended only when needed.

### PR Review Response Policy

When asked to review comments on a GitHub PR:

1. Evaluate each comment and decide whether to apply the feedback.
2. Apply the change if it is clearly necessary (correctness, security, documented contract).
3. Reply to each comment thread with the decision and reasoning:
  - **Applied**: explain what was changed and why.
  - **Rejected**: explain why the feedback does not apply or conflicts with intentional design.
4. Resolve the comment thread after replying.

**GitHub API notes:**
- Reply: `gh api --method POST repos/{owner}/{repo}/pulls/{pr}/comments/{comment_id}/replies -f body="..."`
- Get thread node IDs (`PRRT_...`): GraphQL `repository.pullRequest.reviewThreads` → `nodes { id isResolved comments(first:1) { nodes { databaseId } } }`
- Resolve: GraphQL `mutation { resolveReviewThread(input: {threadId: "PRRT_..."}) { thread { isResolved } } }`
- Always reply first, then resolve every thread.

### Frontend Design Rules

- When a component exists in the `@cocso-ui/react` package, always use it instead of implementing a custom equivalent.
- For UI/UX decisions, follow the Vercel agent skills: `web-design-guidelines`, `vercel-react-best-practices`, and `vercel-composition-patterns`.

### API Contract Rules

- The Swagger JSON schema is the single source of truth for all API contracts.
- Always fetch the schema before implementing any API call — do not guess field names, types, or endpoint paths.
- Dev schema URL: `https://api-dev.cocso.co.kr/api-docs-json`
- If the schema and any other document conflict, the schema wins for runtime behavior.
- API base URLs must be stored in environment variables, never hardcoded.

### Shell Command Safety Rules

- Use `$(...)` for command substitution; do not use legacy backticks in new scripts.
- Wrap all file paths in quotes by default in shell commands and scripts to prevent whitespace and glob-expansion bugs.
- Apply strict quoting and escaping for all dynamic shell values to prevent command injection and parsing bugs.

### Logging Rules

- Write sufficient logs to support debugging and operational troubleshooting.
- Prefer structured logging to ad-hoc plain text strings.
- CLI and operator-facing logs should enable ANSI color by default; allow opt-out via environment variables.

### CI Baseline

Repository-wide quality CI runs on every pull request.

Coverage expectations:
- `lint`: runs `pnpm run lint` — fails if any issue is found.
- `test`: runs `pnpm run test:coverage` and posts a PR coverage summary.
- `build`: runs `pnpm build` across all packages via Turborepo.
- `claude-review`: automated Claude Code review runs on every PR (opened, synchronize, ready_for_review, reopened).

All CI jobs must pass before a PR is merged.
