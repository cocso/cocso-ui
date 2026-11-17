---
"@cocso-ui/react": minor
---

Additive props so apps can drop their own copies:

- `Skeleton`: `circle` (shorthand for `variant="circular"`) and `width` / `height` (a number is px).
- `Card`: `gap` and `render` props, and `Card.Header` / `Card.Title` parts.
- `Breadcrumb`: an `items` data API (the last step is `aria-current="page"`) and `renderLink` to render steps through a router link.
