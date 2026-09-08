package ai.cocso.ui

import androidx.compose.animation.core.LinearEasing
import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.layout.size
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.CornerRadius
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.drawscope.rotate
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.unit.dp

/** An indeterminate activity indicator. */
@Composable
fun CCSpinner(
    modifier: Modifier = Modifier,
    variant: CCSpinnerVariant = CCSpinnerVariant.primary,
    size: CCSpinnerSize = CCSpinnerSize.medium,
    label: String = "Loading",
) {
    val style = cCSpinnerStyle(variant = variant, size = size)
    val side = style.output ?: 16.dp
    val bladeCount = (style.blades ?: 8).coerceAtLeast(1)
    val bladeWidth = style.bladeWidth ?: 2.dp
    val bladeHeight = style.bladeHeight ?: 5.dp
    val color = style.bladeColor ?: CocsoTokens.Color.interactivePrimary()
    val reduced = reducedMotion()

    // One turn per `duration-decorative`, the period of the web's
    // `spinner-blade-fade` — a rotating opacity ramp is the same picture as
    // eight blades fading in turn.
    val rotation = if (reduced) {
        0f
    } else {
        rememberInfiniteTransition(label = "spinner").animateFloat(
            initialValue = 0f,
            targetValue = 360f,
            animationSpec = infiniteRepeatable(
                tween(CocsoTokens.Duration.decorative, easing = LinearEasing)
            ),
            label = "spinner-rotation",
        ).value
    }
    // Reduced motion: the web swaps the spin for a slow pulse of the whole
    // indicator (`spinner-reduced-pulse`, 0.4 ↔ 0.8 over 2s), and so does this
    // — still says work is happening, without anything travelling.
    val pulse = if (reduced) {
        rememberInfiniteTransition(label = "spinner-pulse").animateFloat(
            initialValue = 0.4f,
            targetValue = 0.8f,
            animationSpec = infiniteRepeatable(
                tween(1000, easing = CocsoTokens.Easing.default),
                RepeatMode.Reverse,
            ),
            label = "spinner-opacity",
        ).value
    } else {
        1f
    }

    Canvas(
        modifier = modifier
            .size(side)
            .semantics { contentDescription = label }
    ) {
        val w = bladeWidth.toPx()
        val h = bladeHeight.toPx()
        val r = (style.bladeRadius ?: 1.dp).toPx()
        val corner = CornerRadius(r, r)
        repeat(bladeCount) { index ->
            val degrees = rotation + index.toFloat() / bladeCount * 360f
            rotate(degrees = degrees, pivot = center) {
                drawRoundRect(
                    color = color,
                    topLeft = Offset(center.x - w / 2f, 0f),
                    size = Size(w, h),
                    cornerRadius = corner,
                    alpha = (index + 1).toFloat() / bladeCount * pulse,
                )
            }
        }
    }
}
