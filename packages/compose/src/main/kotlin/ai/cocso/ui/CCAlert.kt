package ai.cocso.ui

import androidx.compose.animation.animateColorAsState
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.size
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Close
import androidx.compose.material3.Icon
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.semantics.Role
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color as ComposeColor
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

/**
 * A status message.
 *
 * Values come from [cCAlertStyle], generated from `alert.recipe.ts`. The border
 * the recipe declares is a composite that does not cross as a single value, so
 * its colour is used with a one-dp stroke — the width the web draws.
 *
 * Showing and hiding is the caller's: wrap it in `AnimatedVisibility` with
 * `CCMotion.entrance()` to have it slide in, the way the SwiftUI view's
 * default transition does.
 */
@Composable
fun CCAlert(
    title: String,
    modifier: Modifier = Modifier,
    message: String? = null,
    variant: CCAlertVariant = CCAlertVariant.info,
    icon: ImageVector? = null,
    onClose: (() -> Unit)? = null,
) {
    val style = cCAlertStyle(variant = variant)
    val interactionSource = remember { MutableInteractionSource() }
    val shape = RoundedCornerShape(style.borderRadius ?: 0.dp)

    // A variant change recolours on the web's colour curve.
    val fill by animateColorAsState(
        style.bgColor ?: ComposeColor.Transparent,
        animationSpec = CCMotion.colour(),
        label = "alert-fill",
    )
    val edge by animateColorAsState(
        style.borderColor ?: ComposeColor.Transparent,
        animationSpec = CCMotion.colour(),
        label = "alert-border",
    )
    val ink by animateColorAsState(
        style.fontColor ?: CocsoTokens.Color.textPrimary(),
        animationSpec = CCMotion.colour(),
        label = "alert-text",
    )

    // The web's `icon` before the text and `onClose` after it, both in the
    // alert's own ink.
    Row(
        modifier = modifier
            .fillMaxWidth()
            .clip(shape)
            .background(fill)
            .border(1.dp, edge, shape)
            .padding(
                horizontal = style.paddingX ?: 0.dp,
                vertical = style.paddingY ?: 0.dp,
            ),
        horizontalArrangement = Arrangement.spacedBy(CocsoTokens.Spacing.s5),
        verticalAlignment = Alignment.Top,
    ) {
        if (icon != null) {
            Icon(icon, contentDescription = null, tint = ink, modifier = Modifier.size(16.dp))
        }
        Column(
            modifier = Modifier.weight(1f),
            verticalArrangement = Arrangement.spacedBy(CocsoTokens.Spacing.s3),
        ) {
            Text(
                text = title,
                color = ink,
                fontSize = (style.fontSize?.value ?: 14f).sp,
                fontWeight = FontWeight.SemiBold,
            )
            if (message != null) {
                Text(
                    text = message,
                    color = ink,
                    fontSize = (style.fontSize?.value ?: 14f).sp,
                )
            }
        }
        if (onClose != null) {
            Icon(
                imageVector = Icons.Filled.Close,
                contentDescription = CCStrings.close(),
                tint = ink,
                modifier = Modifier
                    .ccPressFeedback(interactionSource)
                    .clickable(interactionSource = interactionSource, indication = null, role = Role.Button, onClick = onClose)
                    .ccMinimumTouchTarget()
                    .size(16.dp),
            )
        }
    }
}
