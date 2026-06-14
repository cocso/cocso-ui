---
"@cocso-ui/react": major
---

BREAKING: first stable v1 release.

- Component primitives migrated from `@radix-ui/*` to `@base-ui/react`.
- `Modal` removed and replaced by `Dialog`.
- Design tokens rebased via `@cocso-ui/css@1` (primary now derives from neutral;
  `--ds-*` custom properties renamed to `--cocso-*`).
- New components: alert, avatar, breadcrumb, card, field, input, progress,
  skeleton, tooltip.

Migration:
- Replace `Modal` imports/usages with `Dialog`.
- Upgrade `@cocso-ui/css` and `@cocso-ui/react-icons` to v1 together with this
  package; mixing with 0.2.x is not supported.
- Update any custom CSS referencing `--ds-*` tokens to `--cocso-*`.
