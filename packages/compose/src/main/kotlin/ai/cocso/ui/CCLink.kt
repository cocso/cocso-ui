package ai.cocso.ui

import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsPressedAsState
import androidx.compose.material3.LocalContentColor
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.text.style.TextDecoration

/**
 * Text that goes somewhere.
 *
 * Values come from [cCLinkStyle], generated from `link.recipe.ts`. The `inline`
 * variant is underlined the way the web's is — a link inside running text needs
 * more than colour to be found — and `current` takes the surrounding ink
 * (`currentColor` on the web, which the generator leaves to the platform).
 */
@Composable
fun CCLink(
    title: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    variant: CCLinkVariant = CCLinkVariant.inline,
    enabled: Boolean = true,
) {
    val style = cCLinkStyle(variant = variant)
    val interactionSource = remember { MutableInteractionSource() }
    val isPressed by interactionSource.collectIsPressedAsState()
    // The web's `.current:hover { opacity: 0.7 }` — the press is the touch's hover.
    val pressed by animateFloatAsState(if (isPressed) 0.7f else 1f, animationSpec = CCMotion.colour(), label = "link-pressed")
    val dim by animateFloatAsState(if (enabled) 1f else 0.4f, animationSpec = CCMotion.colour(), label = "link-enabled")

    Text(
        text = title,
        // `null` is `currentColor`: the surrounding ink.
        color = style.color ?: LocalContentColor.current,
        textDecoration = if (variant == CCLinkVariant.inline) TextDecoration.Underline else TextDecoration.None,
        modifier = modifier
            .alpha(dim * pressed)
            .clickable(enabled = enabled, interactionSource = interactionSource, indication = null, role = Role.Button, onClick = onClick)
            .ccMinimumTouchTarget(),
    )
}
