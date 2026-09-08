package ai.cocso.ui

import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.drawWithContent
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color as ComposeColor
import androidx.compose.ui.semantics.clearAndSetSemantics
import androidx.compose.ui.unit.dp

/** A placeholder while content loads. */
@Composable
fun CCSkeleton(
    modifier: Modifier = Modifier,
    variant: CCSkeletonVariant = CCSkeletonVariant.text,
    animation: CCSkeletonAnimation = CCSkeletonAnimation.pulse,
) {
    val style = cCSkeletonStyle(variant = variant, animation = animation)
    // Motion here is decoration, and the web stops it under
    // `prefers-reduced-motion`; this is the same setting on Android.
    val animates = animation != CCSkeletonAnimation.none && !reducedMotion()

    // The web's `skeleton-pulse`: 1 → 0.4 → 1 over `duration-decorative-slow`
    // on `easing-default`. Half the period each way, reversed.
    val opacity = if (animates && animation == CCSkeletonAnimation.pulse) {
        rememberInfiniteTransition(label = "skeleton").animateFloat(
            initialValue = 1f,
            targetValue = 0.4f,
            animationSpec = infiniteRepeatable(
                tween(CocsoTokens.Duration.decorativeSlow / 2, easing = CocsoTokens.Easing.default),
                RepeatMode.Reverse,
            ),
            label = "skeleton-opacity",
        ).value
    } else {
        1f
    }

    // The web's `skeleton-wave`: a band of `white-alpha-40` sweeping from off
    // the left edge to off the right, once per `duration-decorative-slow`.
    val sweep = if (animates && animation == CCSkeletonAnimation.wave) {
        rememberInfiniteTransition(label = "skeleton-wave").animateFloat(
            initialValue = -1f,
            targetValue = 1f,
            animationSpec = infiniteRepeatable(
                tween(CocsoTokens.Duration.decorativeSlow, easing = CocsoTokens.Easing.default),
                RepeatMode.Restart,
            ),
            label = "skeleton-sweep",
        ).value
    } else {
        null
    }

    val sized = style.width?.let { modifier.width(it) } ?: modifier.fillMaxWidth()

    Box(
        modifier = sized
            .height(style.height ?: 16.dp)
            // `variant = circular` is a percentage radius in the recipe, which
            // has no length to travel as; before it arrived as a flag this drew
            // a square.
            .clip(
                if (style.borderRadiusFull == true) {
                    CircleShape
                } else {
                    RoundedCornerShape(style.borderRadius ?: 0.dp)
                }
            )
            .alpha(opacity)
            .background(style.bgColor ?: CocsoTokens.Color.surfaceNeutral())
            .drawWithContent {
                drawContent()
                if (sweep != null) {
                    val x = sweep * size.width
                    drawRect(
                        Brush.linearGradient(
                            colors = listOf(
                                ComposeColor.Transparent,
                                CocsoTokens.Color.whiteAlpha40,
                                ComposeColor.Transparent,
                            ),
                            start = Offset(x, 0f),
                            end = Offset(x + size.width, 0f),
                        )
                    )
                }
            }
            // Decoration: it carries no information a screen reader can use.
            .clearAndSetSemantics {}
    )
}
