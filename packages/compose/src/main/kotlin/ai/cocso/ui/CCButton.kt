package ai.cocso.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.clip
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

/**
 * A button.
 *
 * The values come from [cCButtonStyle], generated from `button.recipe.ts` — the
 * same recipe the web's CSS is generated from. Nothing here decides what a
 * variant looks like, which is the point: adding one to the recipe adds it on
 * all three platforms, and this file does not change.
 *
 * The parameters mirror the web's `ButtonProps`, minus the ones that are HTML.
 */
@Composable
fun CCButton(
    title: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    variant: CCButtonVariant = CCButtonVariant.primary,
    size: CCButtonSize = CCButtonSize.medium,
    shape: CCButtonShape = CCButtonShape.square,
    align: CCButtonAlign = CCButtonAlign.center,
    loading: Boolean = false,
    enabled: Boolean = true,
) {
    val style = cCButtonStyle(variant = variant, size = size, shape = shape, align = align)
    val interactionSource = remember { MutableInteractionSource() }

    val alignment = when (align) {
        // `between` spreads content in CSS, which has no single alignment here.
        // It maps to start, and a caller wanting the spread lays it out itself.
        CCButtonAlign.start, CCButtonAlign.between -> Alignment.CenterStart
        CCButtonAlign.center -> Alignment.Center
    }

    Box(
        modifier = modifier
            .fillMaxWidth()
            .height(style.height ?: 36.dp)
            // `shape = circle` is a percentage radius in the recipe, which has
            // no length to travel as; before it arrived as a flag this drew a
            // square.
            .clip(
                if (style.borderRadiusFull == true) {
                    CircleShape
                } else {
                    RoundedCornerShape(style.borderRadius ?: 0.dp)
                }
            )
            .background(style.bgColor ?: CocsoTokens.Color.surfacePrimary())
            // WCAG 1.4.3 exempts an inactive control, and the web dims a
            // disabled button the same way rather than restating every variant.
            .alpha(if (enabled) 1f else 0.4f)
            .clickable(
                enabled = enabled && !loading,
                interactionSource = interactionSource,
                indication = null,
                role = Role.Button,
                onClick = onClick,
            )
            .padding(horizontal = style.paddingInline ?: 0.dp),
        contentAlignment = alignment,
    ) {
        if (loading) {
            CircularProgressIndicator(
                modifier = Modifier.height(16.dp),
                color = style.fontColor ?: CocsoTokens.Color.textPrimary(),
            )
        } else {
            Text(
                text = title,
                color = style.fontColor ?: CocsoTokens.Color.textPrimary(),
                fontSize = (style.fontSize?.value ?: 14f).sp,
            )
        }
    }
}
