package ai.cocso.ui

import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.ui.graphics.Shape
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp

/**
 * The rounded box a recipe's radius describes — the counterpart of SwiftUI's
 * `CCRoundedShape`.
 *
 * Compose already draws what that type had to be written for: its corners are
 * circular arcs, as CSS `border-radius` is, and `RoundedCornerShape` clamps a
 * radius past half the short side, so the recipe's `radius-full` (1000) is a
 * pill here without help. What this keeps in one place is the other half: a
 * percentage radius has no length to travel as, so the recipe sends
 * `borderRadiusFull`, and a pill is what it means.
 */
internal fun ccRoundedShape(radius: Dp?, full: Boolean?): Shape =
    if (full == true) CircleShape else RoundedCornerShape(radius ?: 0.dp)
