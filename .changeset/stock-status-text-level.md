---
"@cocso-ui/react": patch
---

Paint StockQuantityStatus with the text-level status tokens.

All three states used the `feedback-*` base — the fill level, which clears AA
on white by under 0.1 and misses it everywhere else: 4.17–4.19 on a card and
3.70–3.72 on `interactive-primary-subtle`. They now use `feedback-*-text`,
which clears every surface in both themes. `Link` moves with them via
`interactive-info-text`.

With this, no recipe in either theme paints text below AA on any surface,
`text-disabled` aside, which WCAG 1.4.3 exempts.
