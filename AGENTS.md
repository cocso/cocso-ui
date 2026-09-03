### Instructions

- Use the `docs/` directory as the source of truth for project contracts and implementation documents.
- All repository-wide rules must be defined in this `AGENTS.md`.
- List files in `docs/` before starting each task, and keep `docs/` up-to-date.
- After completing each task, update the relevant `AGENTS.md` and `docs/` files in the same change when policies, structure, or contracts changed.
- Write all code and comments in English.
- Prefer enum types over string literals whenever possible.
- If you modified frontend code, run `pnpm check` from the repository root before finishing your task.
- Commit when each logical unit of work is complete; do NOT use the `--no-verify` flag.
- NEVER put `[skip ci]` (or any other skip marker) in a commit message on a branch that will be squash-merged. A squash merge concatenates every commit body, so one marker anywhere on the branch makes GitHub skip every workflow on `main` — including `Changeset Release`, which is how packages are published.
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
  - `packages/react-icons/`: `@cocso-ui/react-icons` — icon set (re-exports generated components from `@cocso-ui/icons`).
  - `packages/react-native-icons/`: `@cocso-ui/react-native-icons` — React Native icon set (re-exports generated react-native-svg components from `@cocso-ui/icons`).
  - `packages/baseframe-sources/`: `@cocso-ui/baseframe-sources` — YAML component source definitions.
  - `packages/recipe/`: `@cocso-ui/recipe` — component visual spec recipes (single source of truth for variant→token mappings, consumed by codegen at build time and Figma generation).
  - `packages/figma/`: `@cocso-ui/figma` — Figma plugin for syncing design tokens to Figma Variables and generating components from recipes.
- `ecosystem/`: Tooling that wraps or consumes packages for developer workflows.
  - `ecosystem/baseframe/`: `@cocso-ui/baseframe` — CLI for scaffolding components from YAML.
  - `ecosystem/codegen/`: `@cocso-ui/codegen` — build-time code generation from recipe definitions (CSS classes, className functions, TypeScript types). Generated output consumed by `@cocso-ui/react`.
  - `ecosystem/icons/`: `@cocso-ui/icons` — canonical SVG icon sources, SVGO optimization, and code generation (SVG → React TSX, SVG → React Native TSX, SVG → Figma template strings).
  - `ecosystem/mcp/`: `@cocso-ui/mcp` — MCP server for design-system-aware component discovery and guidance.
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

### Component Override Contract

- CSS Module class names are content-hashed and MUST NOT be relied on for
  external overrides.
- Components that render a themable surface MUST expose a stable
  `data-cocso-component="<name>"` attribute on that surface so consumers can
  target it from global CSS (e.g. `[data-cocso-component="dropdown-content"]`).
- `<name>` uses lowercase kebab-case and identifies the component part
  (e.g. `dropdown-content`, `dropdown-item`, `dialog-overlay`).
- CSS Modules MUST NOT hardcode a design token value that a consumer is expected
  to be able to retheme (selection color, focus ring, fill). Declare it in the
  recipe (`base` or a variant) so codegen emits a component-scoped custom
  property `--cocso-<component>-<property>`, and have the CSS Module read that
  property. A value reachable only through a content-hashed class name is not
  overridable and counts as a bug.
- Primitive `primary-*` overrides in a consumer `:root` MUST propagate to every
  component. `--cocso-color-primary-50`…`950` is the documented theming entry
  point; see the Theming Entry Point section in `docs/project-css.md`.
- CSS Modules MUST NOT hardcode a primitive color (`--cocso-color-white`,
  `--cocso-color-neutral-500`, and the rest of the raw scale). The dark theme
  carries the semantic layer only and deliberately leaves the raw scale alone,
  so a primitive written into a module keeps its value when the theme flips. Use the
  semantic token that resolves to the same value in the light theme.
  `packages/react/src/test/module-css-tokens.test.ts` enforces this across every
  CSS Module, with no exceptions.
- A component MUST NOT name a colour in its `.tsx` — not a raw ramp entry from
  `colors` (`colors.neutral100`, `colors.white`), not a literal (`#D9D9D9`,
  `rgb(...)`), whether in an inline style or an SVG attribute. Those values
  survive the theme flip, and a value written there is also unreachable from a
  consumer's stylesheet. Name the semantic token for the role, adding it to
  `colors` in `packages/react/src/token/color.ts` if it is not exported yet.
  `packages/react/src/test/component-tsx-colors.test.ts` enforces this. It was
  added after three components had done it: Checkbox (white glyph on a
  near-white fill, 1.09:1), Switch (a track that stayed bright in the dark
  theme) and StockQuantityStatus (`#D9D9D9` six times).
- A CSS Module that names a semantic token as a text colour MUST clear WCAG AA
  against whatever it sits on — the fill its own rule block declares, or the
  page surfaces when it declares none. (`color` only: `fill` and `stroke` paint
  non-text graphics, which WCAG 1.4.11 asks 3:1 of and only when the graphic
  carries meaning, and the stylesheet cannot tell whether it does.)
  `packages/react/src/test/module-css-contrast.test.ts` checks this in both
  themes. Nothing did before, and two defects lived there: validation messages
  painted with `feedback-danger` (the fill level, 4.18:1 on a card) and both
  date pickers using `surface-primary` as the foreground on an
  `interactive-primary` fill.
- Floating components (Dropdown, Popover, Tooltip) MUST set the overlay
  `z-index` on the `Positioner`, not the inner popup — the Positioner owns the
  stacking context via its `transform`, so a `z-index` on the popup alone is
  ignored by ancestors.
- Because the Positioner owns stacking, it MUST carry its own
  `data-cocso-component="<name>-positioner"` hook in addition to the popup
  hook. A consumer that needs to escape the z-index scale (e.g. a host app with
  a fixed legacy header) has no other supported selector.
- The z-index scale ascends so floating layers always sit above modals
  (portals flatten to `<body>`, so stacking is decided by `z-index` alone):
  `header (50)` < `overlay (100, dialog backdrop)` < `dialog (200, dialog
  content)` < `popover (300, dropdown/popover and anything built on Dropdown
  such as DayPicker/MonthPicker)` < `tooltip (400)`. This guarantees a tooltip
  or dropdown opened inside a Dialog renders above the dialog content. Toast is
  rendered by `sonner` and intentionally sits above this scale; do not assign it
  a token.
- `--cocso-z-index-dialog-content` (250) is vestigial: no component uses it and
  it is not part of the scale above. Do NOT reach for it to lift a floating
  surface — a consumer did, and forcing every positioner to 250 dropped tooltips
  from 400 to 250, below the popovers they are supposed to sit over. It stays
  exported only because removing a published token is breaking; it is queued for
  removal in the next major.
- Trigger-attached floating surfaces MUST use `--cocso-z-index-popover`;
  tooltips MUST use `--cocso-z-index-tooltip`. Do NOT use
  `--cocso-z-index-overlay` for floating popups — it is the dialog backdrop
  layer and would render the popup behind dialog content.

### Frontend Design Rules

- When a component exists in the `@cocso-ui/react` package, always use it instead of implementing a custom equivalent.
- A fixed-hue `interactive-*` token is a FILL. Do NOT paint text with one: the
  dark theme deliberately leaves those values alone because a saturated accent
  reads on either surface as a fill, but as a foreground the ramp runs the wrong
  way — Link used `interactive-info` for its text and `interactive-info-active`
  for its hover, which measured 4.05:1 and 1.74:1 on the dark surface. Use the
  `-text` form of the role (`interactive-primary-text`, `interactive-info-text`),
  which flips.
- `interactive-primary` and `text-on-primary` are a PAIR. A consumer that
  overrides one MUST override the other: the fill and the foreground drawn on it
  are chosen together, and overriding only the fill leaves a foreground picked
  for a different colour. Checkbox draws its glyph with `text-on-primary` on an
  `interactive-primary` fill, so an app that rebrands the fill and not the glyph
  gets an unreadable checkbox.
- Contrast is measured against every surface text lands on — the page, the
  cards, and the tints a component paints and then writes on
  (`feedback-*-subtle`, `interactive-primary-subtle`). The tints are darker
  than a card in the light theme, and a check that looks only at the page
  understates the floor.
- A 500-level accent is a FILL. Body text uses the 600 level
  (`feedback-*-text`, `interactive-info-text`): the 500 level clears AA on
  white by under 0.1 and misses it on every other surface.
- A CSS Module that animates MUST honour `prefers-reduced-motion`. Motion here
  is decoration — every component reads the same without it — so there is no
  case where respecting the preference costs meaning. Seventeen modules
  animated and three honoured it.
- Spacing MUST be logical, not physical: `margin-inline-start`/`-end` and
  `padding-inline-start`/`-end`, never `margin-left` or `padding-right`. A
  physical side lands on the wrong side once the document direction flips.
  Physical `left`/`right` offsets are fine where the side is a placement fact
  rather than a text one — a `Popover` under `[data-side="left"]`.
  `packages/react/src/test/module-css-motion-rtl.test.ts` enforces both.
- Every interactive component MUST be reachable with Tab and operable from the
  keyboard. `packages/react/src/test/keyboard.test.tsx` drives it. axe reads
  markup, not behaviour: a component can be flawless to it and unusable
  without a mouse.
- A story is documentation, so it MUST render an accessible example: a control
  with an accessible name, landmarks that do not collide. The `accessibility`
  job checks stories, not just components, and eleven of its first findings
  were demos modelling a control nobody had named.
- Every exported component MUST pass axe in a static render.
  `packages/react/src/test/a11y.test.tsx` runs it over each one in a
  representative state. It is a floor, not an audit — keyboard order, focus
  movement and screen-reader output are outside what a jsdom render can see,
  and rules needing layout are disabled explicitly rather than left to pass
  silently. A component rendering an ARIA role MUST give it an accessible
  name: `Progress` shipped `role="progressbar"` unnamed, which announces a bar
  and nothing about what it measures.
- Text below 24px (or below 18.66px bold) may only use `text-primary` or
  `text-secondary`. `text-tertiary` and `text-muted` are below WCAG AA at body
  size on every surface in both themes; they are for large text and non-text
  graphics only. There is no third tier and there cannot be one: the lightest
  grey that clears AA on white and on the worst tint is `#686868`, and
  `text-secondary` is `#58616a` — nothing perceptibly different fits between
  them. A component needing a quieter body text has to use `text-secondary`. See the Contrast section in `docs/project-css.md`.
- Use the cocso radius scale (`rounded-1`…`rounded-6`, `rounded-full`), not
  Tailwind's `rounded-xs`…`rounded-4xl` defaults. Both namespaces resolve and
  the first six steps share pixel values, but only the cocso scale chains to
  `--cocso-radius-*` and tracks a token override. Never put two radius
  utilities on one element — the winner is stylesheet order.
- For UI/UX decisions, follow the Vercel agent skills: `web-design-guidelines`, `vercel-react-best-practices`, and `vercel-composition-patterns`.

### Codegen Rules

- `packages/css/token.css`, `packages/css/tailwind4.css` and `packages/css/theme-dark.css` are ALL generated from `packages/baseframe-sources`. Do NOT hand-edit them: add the token to the YAML and run `pnpm --filter @cocso-ui/baseframe generate:css`. `ecosystem/baseframe/src/__tests__/golden.test.ts` fails when a published file and the YAML disagree.
- Semantic color tokens live in the `theme` collection, which declares the modes `light` and `dark`. The generator rejects a token missing a value for a mode its collection declares, so a semantic token cannot ship without someone deciding what it does in the dark theme. That is the check the `feedback-*` bases went without for as long as the dark theme existed.
- Primitives stay in the `global` collection with its single mode, and `theme-dark.css` carries the semantic layer only. The raw ramps are never re-emitted there, which is what keeps a consumer's `--cocso-color-primary-*` override alive when the theme flips.

- Recipe definitions in `packages/recipe/` are the single source of truth for component visual specs.
- After modifying any recipe, run `pnpm --filter @cocso-ui/codegen generate` and commit the generated output.
- React components MUST import from `@cocso-ui/codegen/generated/*`, NOT from `@cocso-ui/recipe` at runtime.
- React components MUST NOT re-export types via `export type { X } from "@cocso-ui/codegen/..."`. Since codegen is a devDependency, such re-exports leak unresolvable bare specifiers into published `.d.ts` files. Inline the type aliases instead.
- New components with visual variants MUST define a recipe first, then generate codegen artifacts.
- A check that scans a directory MUST assert that nothing it is meant to cover lives outside that directory. Scanning widens automatically inside its root and not at all outside it, and the gap is invisible from within the check. `packages/react/src/test/guard-scope.test.ts` fails if a CSS Module or a component lands outside `src/components`, where the three component guards look.
- A check that enumerates what it covers MUST assert that enumeration against reality, not against a floor. `expect(list.length).toBeGreaterThan(n)` catches a check that stopped covering things; it does not catch a new thing the check has never heard of, which is the direction these actually break in. The contrast check's recipe list held six of nineteen for as long as it existed, and the recipe it omitted had a link that was 1.74:1 on hover in the dark theme. `contrast.test.ts` now fails if a recipe exists on disk that it does not resolve.
- CI enforces codegen freshness: stale generated files will fail the build.
- Variant dimension names MUST be single camelCase words without dashes (e.g., `fontSize`, not `font-size`). The codegen parity test parser splits CSS class names on the first dash to separate dimension from value.

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
- `test`: runs `pnpm run test:coverage` and posts a PR coverage summary. Coverage is reported for `@cocso-ui/react`, `@cocso-ui/recipe`, `@cocso-ui/codegen`, `@cocso-ui/figma`, and `@cocso-ui/baseframe`. Includes codegen freshness gate (recipe → generated file sync validation).
- `icons`: builds `@cocso-ui/icons`, runs `validate` (registry ↔ SVG ↔ generated output consistency) and `validate:compat` (backward-compatibility import check).
- `build`: runs `pnpm build` across all packages via Turborepo.
- `claude-review`: automated Claude Code review runs on every PR (opened, synchronize, ready_for_review, reopened). Advisory only — it comments, it does not gate merges. It requires the Claude Code GitHub App (https://github.com/apps/claude) to be installed on the repository; without it the OIDC token exchange returns 401 and the job emits a warning instead of failing.
- `visual-regression`: screenshots every Storybook story and compares it to the committed baselines in `apps/storybook/__snapshots__/`.
- `accessibility`: walks every Storybook story in the same browser and runs axe with the layout-dependent rules left on. `packages/react/src/test/a11y.test.tsx` runs axe in jsdom, which computes no layout and disables `color-contrast` and target size rather than appearing to cover them; this job is where those are checked. Kept separate from `visual-regression` so a failure says which kind it is.

Visual regression rules:
- Comparison uses an absolute pixel budget (`failureThresholdType: "pixel"`), never a percentage. Stories are `layout: centered` inside a 1280x720 viewport, so a ratio-based threshold measures against mostly-empty canvas and silently passes real component changes.
- Baselines are captured on the CI runner image, so they MUST be regenerated by the `Update Visual Regression Baselines` workflow, never committed from a developer machine — font rendering differs per OS. Dispatch it with the branch named twice:
  ```bash
  gh workflow run visual-regression-update.yml --ref <branch> -f branch=<branch>
  ```
  The workflow pushes the regenerated baselines to whatever it checks out. `--ref` alone only selects which copy of the workflow file runs; the checkout follows the `branch` input, which now falls back to the dispatch ref rather than to `main`.
- Any PR that adds or changes a story must regenerate baselines on its branch before merge. A story with no baseline is reported separately as new; it is not silently counted as passing.
- A story with a committed baseline MUST render deterministically. No `new Date()`, `Math.random()`, no remote resource — an `Avatar` story fetched a random-avatar service and failed the comparison when it served different bytes — or anything else that varies between the capture and the comparison — the DayPicker `Disabled` story rendered today's date as its trigger label, so it failed on every unrelated PR opened after the day the baseline was taken. Pin the value instead.

All CI jobs must pass before a PR is merged.

### gstack
Use /browse from gstack for all web browsing. Never use mcp__claude-in-chrome__* tools.
Available skills: /office-hours, /plan-ceo-review, /plan-eng-review, /plan-design-review,
/design-consultation, /review, /ship, /land-and-deploy, /canary, /benchmark, /browse,
/qa, /qa-only, /design-review, /setup-browser-cookies, /setup-deploy, /retro,
/investigate, /document-release, /codex, /cso, /autoplan, /careful, /freeze, /guard,
/unfreeze, /gstack-upgrade.
