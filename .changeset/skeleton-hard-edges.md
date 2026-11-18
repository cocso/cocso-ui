---
"@cocso-ui/react": patch
---

Skeleton: drop the edge fade added in 1.11.0. Faded edges made thin placeholders (a 12–16px text line in a table) read as washed out, so a skeleton is a solid fill with its radius again. `--cocso-skeleton-edge-fade` is no longer read.
