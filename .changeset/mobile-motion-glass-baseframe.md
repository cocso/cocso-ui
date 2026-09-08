---
"@cocso-ui/baseframe": minor
---

Motion tokens reach the mobile artifacts as what they are. `CocsoTokens.Duration` is now `TimeInterval` seconds on Swift and `Int` milliseconds on Kotlin (it was a `CGFloat`, and `0.15.dp` on Compose). `CocsoTokens.Easing` is new: each CSS easing as `Animation.timingCurve` on Swift and `CubicBezierEasing` on Kotlin.
