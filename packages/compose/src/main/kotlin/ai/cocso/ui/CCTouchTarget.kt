package ai.cocso.ui

import androidx.compose.foundation.layout.defaultMinSize
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

/**
 * The minimum a finger can reliably hit.
 *
 * WCAG 2.2 SC 2.5.8 asks 24×24, which is what the web enforces. Material asks
 * 48×48, and a phone is the case the stricter number was written for — a
 * checkbox drawn at 16dp is a target either way, and the platform floor is the
 * one that applies here.
 *
 * What grows is the slot the control lays out in and the area that answers a
 * touch — the same as Material's `minimumInteractiveComponentSize`, which also
 * reports the enlarged size to its parent. What is drawn keeps the recipe's
 * size, centred in that slot. Both halves hold only when the modifier is used
 * the one way that makes them true:
 *
 * **The floor goes on a box that owns the click, and the drawing goes on a
 * child of that box.** Two other orders compile and look plausible, and both
 * were in this package:
 *
 * - After a fixed size in the same chain (`size(32).ccMinimumTouchTarget()`)
 *   it does nothing. `defaultMinSize` applies only where the incoming minimum
 *   is zero, and `size` has already fixed it — every pagination page answered a
 *   32dp square.
 * - On the drawing itself (`Icon(modifier = clickable.ccMinimumTouchTarget())`)
 *   the drawing grows with it. An icon's vector is scaled to fill its node, so
 *   the alert's close cross drew at three times its size and the dialog's at
 *   twice.
 */
object CCTouchTarget {
    val minimum = 48.dp
}

fun Modifier.ccMinimumTouchTarget(): Modifier =
    defaultMinSize(minWidth = CCTouchTarget.minimum, minHeight = CCTouchTarget.minimum)
