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
 * The visual box keeps the size the recipe gives it; only the hit area grows.
 */
object CCTouchTarget {
    val minimum = 48.dp
}

fun Modifier.ccMinimumTouchTarget(): Modifier =
    defaultMinSize(minWidth = CCTouchTarget.minimum, minHeight = CCTouchTarget.minimum)
