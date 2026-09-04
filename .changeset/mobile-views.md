---
"@cocso-ui/codegen": patch
---

Add the mobile view layer: thirteen components matched on SwiftUI and Jetpack
Compose — button, badge, card, alert, typography, avatar, skeleton, progress,
spinner, checkbox, switch, input, and the `CCTouchTarget` primitive.

Each takes its values from its generated style resolver and decides nothing
about what a variant looks like — the same split the web has between a recipe
and its `.tsx`. Their parameters mirror the web's props.

Three gates cover the hand-written half, which the generators cannot keep in
step. The two platforms carry the same components and expose the same variant
dimensions. Every recipe-backed view calls its resolver rather than naming
tokens itself, and the exemption list is derived from the emitted styles rather
than hardcoded. Every value a resolver hands a view is read by it — carrying a
value across and then ignoring it is the same loss as never carrying it, and
quieter, because the generator reports success.
