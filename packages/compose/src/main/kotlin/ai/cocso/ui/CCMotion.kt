package ai.cocso.ui

import android.provider.Settings
import androidx.compose.animation.core.FiniteAnimationSpec
import androidx.compose.animation.core.snap
import androidx.compose.animation.core.tween
import androidx.compose.runtime.Composable
import androidx.compose.ui.platform.LocalContext

/**
 * The animations the views share, built from the motion tokens.
 *
 * The web transitions a colour with `duration-fast` + `easing-default`, moves
 * a switch thumb with `duration-fast` + `easing-soft`, fills a progress bar
 * with `duration-normal` + `easing-soft`, and brings things in on
 * `easing-entrance`. The same four here, so a control on Android travels on
 * the curve the web's does rather than on a duration each view picked for
 * itself — which is what the spinner's `800` and the skeleton's `1000` were.
 *
 * Every one is a `snap` under reduced motion. The web sets `transition: none`
 * there, and motion in every view is decoration: each reads the same without
 * it.
 *
 * These read the reduced-motion setting, so they are `@Composable`: call them
 * in the body and hand the result to a `transitionSpec` or `Crossfade`, whose
 * lambdas are not.
 */
object CCMotion {
    /** A colour or opacity change — a pressed fill, a border, a dimmed control. */
    @Composable
    fun <T> colour(): FiniteAnimationSpec<T> =
        if (reducedMotion()) snap() else tween(CocsoTokens.Duration.fast, easing = CocsoTokens.Easing.default)

    /** Something that moves a short way — a switch thumb, a pressed scale. */
    @Composable
    fun <T> movement(): FiniteAnimationSpec<T> =
        if (reducedMotion()) snap() else tween(CocsoTokens.Duration.fast, easing = CocsoTokens.Easing.soft)

    /** A value that fills — the progress bar's width. */
    @Composable
    fun <T> fill(): FiniteAnimationSpec<T> =
        if (reducedMotion()) snap() else tween(CocsoTokens.Duration.normal, easing = CocsoTokens.Easing.soft)

    /** Something arriving or leaving — an error message, a checkbox glyph. */
    @Composable
    fun <T> entrance(): FiniteAnimationSpec<T> =
        if (reducedMotion()) snap() else tween(CocsoTokens.Duration.slow, easing = CocsoTokens.Easing.entrance)

    /**
     * The scale a touchable shrinks to while pressed. The web has no
     * equivalent — a pointer does not press — so it is small enough to be felt
     * rather than seen.
     */
    const val pressedScale = 0.97f
}

/**
 * Whether the user has asked the system to stop animating.
 *
 * The web reads `prefers-reduced-motion` and SwiftUI reads
 * `accessibilityReduceMotion`. Android has no single flag: the setting users
 * reach through Developer options and through accessibility shortcuts both
 * land on the animator duration scale, and zero there is the platform's way of
 * saying the same thing.
 */
@Composable
internal fun reducedMotion(): Boolean {
    val resolver = LocalContext.current.contentResolver
    return Settings.Global.getFloat(resolver, Settings.Global.ANIMATOR_DURATION_SCALE, 1f) == 0f
}
