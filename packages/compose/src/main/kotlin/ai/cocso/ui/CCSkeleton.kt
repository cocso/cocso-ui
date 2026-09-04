package ai.cocso.ui

import android.provider.Settings
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
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.clip
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.semantics.clearAndSetSemantics
import androidx.compose.ui.unit.dp

/**
 * Whether the user has asked the system to stop animating.
 *
 * The web reads `prefers-reduced-motion` and SwiftUI reads
 * `accessibilityReduceMotion`. Android has no single flag: the setting users
 * reach through Developer options and through accessibility shortcuts both
 * land on the animator duration scale, and zero there is the platform's way of
 * saying the same thing.
 *
 * Kept here rather than in its own file because [CCSpinner] is the only other
 * caller and a file with no counterpart on iOS would fail the parity gate.
 */
@Composable
internal fun reducedMotion(): Boolean {
    val resolver = LocalContext.current.contentResolver
    return Settings.Global.getFloat(resolver, Settings.Global.ANIMATOR_DURATION_SCALE, 1f) == 0f
}

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

    val opacity = if (animates) {
        rememberInfiniteTransition(label = "skeleton").animateFloat(
            initialValue = 1f,
            targetValue = 0.45f,
            animationSpec = infiniteRepeatable(tween(1000), RepeatMode.Reverse),
            label = "skeleton-opacity",
        ).value
    } else {
        1f
    }

    val sized = style.width?.let { modifier.width(it) } ?: modifier.fillMaxWidth()

    Box(
        modifier = sized
            .height(style.height ?: 16.dp)
            .clip(RoundedCornerShape(style.borderRadius ?: 0.dp))
            .alpha(opacity)
            .background(style.bgColor ?: CocsoTokens.Color.surfaceNeutral())
            // Decoration: it carries no information a screen reader can use.
            .clearAndSetSemantics {}
    )
}
