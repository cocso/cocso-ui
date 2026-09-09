package ai.cocso.ui

import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsPressedAsState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color as ComposeColor
import androidx.compose.ui.graphics.Shape
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.unit.dp

/**
 * What a control does when a finger holds it or a keyboard reaches it.
 *
 * The press every touchable in the system gives back.
 *
 * A finger on a control should see the control answer. [CCButton] answers with
 * the recipe's pressed colours and a small scale; a row, a tile or an icon has
 * no recipe colours to change, so it answers with the same scale and a dip in
 * opacity. Both come from [CCMotion], so the whole system presses the same way
 * on both platforms and on the same curve as the web's `:active`.
 *
 * Built on `clickable`, so a press that turns into a scroll is cancelled and
 * the node is a button to a screen reader.
 */
@Composable
fun Modifier.ccPressable(enabled: Boolean = true, onClick: () -> Unit): Modifier {
    val interactionSource = remember { MutableInteractionSource() }
    val isPressed by interactionSource.collectIsPressedAsState()
    val scale by animateFloatAsState(
        if (isPressed) CCMotion.pressedScale else 1f,
        animationSpec = CCMotion.movement(),
        label = "press-scale",
    )
    val alpha by animateFloatAsState(
        if (isPressed) CCMotion.pressedOpacity else 1f,
        animationSpec = CCMotion.movement(),
        label = "press-alpha",
    )
    return this
        .graphicsLayer {
            scaleX = scale
            scaleY = scale
            this.alpha = alpha
        }
        .clickable(enabled = enabled, interactionSource = interactionSource, indication = null, role = Role.Button, onClick = onClick)
}

/**
 * The press feedback alone, for a view that keeps its own `clickable`.
 *
 * A checkbox, a switch and a radio each set their own role and toggle state, so
 * they cannot go through [ccPressable], which is a button. They share the
 * interaction source they already have with this instead, and press like
 * everything else.
 */
@Composable
fun Modifier.ccPressFeedback(interactionSource: MutableInteractionSource): Modifier {
    val isPressed by interactionSource.collectIsPressedAsState()
    val scale by animateFloatAsState(
        if (isPressed) CCMotion.pressedScale else 1f,
        animationSpec = CCMotion.movement(),
        label = "press-scale",
    )
    val alpha by animateFloatAsState(
        if (isPressed) CCMotion.pressedOpacity else 1f,
        animationSpec = CCMotion.movement(),
        label = "press-alpha",
    )
    return graphicsLayer {
        scaleX = scale
        scaleY = scale
        this.alpha = alpha
    }
}

/**
 * The focus ring, where the platform has a keyboard.
 *
 * The web draws `outline: 2px solid focus-ring; outline-offset: 2px` on every
 * focusable control, and WCAG 2.4.7 asks for it wherever there is a keyboard.
 * Only while focused: `Modifier.border(0.dp)` is `Dp.Hairline`, a one-pixel
 * line, not the absence of one.
 */
@Composable
fun Modifier.ccFocusRing(isFocused: Boolean, shape: Shape, color: ComposeColor? = null): Modifier =
    if (isFocused) border(2.dp, color ?: CocsoTokens.Color.focusRing(), shape) else this
