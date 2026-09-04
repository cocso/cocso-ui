package ai.cocso.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Check
import androidx.compose.material3.Icon
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.clip
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.clearAndSetSemantics
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.selected
import androidx.compose.ui.unit.dp

/** A checkbox with three states, matching the web's `status`. */
@Composable
fun CCCheckbox(
    label: String,
    status: CCCheckboxStatus,
    onChange: (CCCheckboxStatus) -> Unit,
    modifier: Modifier = Modifier,
    size: CCCheckboxSize = CCCheckboxSize.medium,
    enabled: Boolean = true,
) {
    val style = cCCheckboxStyle(size = size, status = status)
    val side = style.size ?: 16.dp
    val radius = RoundedCornerShape(style.radius ?: 2.dp)
    val interactionSource = remember { MutableInteractionSource() }
    // `text-on-primary`, not white: the fill is `interactive-primary`, which the
    // dark theme flips to a near-white. That pairing is why the web's checkbox
    // was 1.09:1 in dark mode.
    val tint = CocsoTokens.Color.textOnPrimary()

    Row(
        modifier = modifier
            .alpha(if (enabled) 1f else 0.4f)
            .clickable(
                enabled = enabled,
                interactionSource = interactionSource,
                indication = null,
                role = Role.Checkbox,
                onClick = { onChange(if (status == CCCheckboxStatus.on) CCCheckboxStatus.off else CCCheckboxStatus.on) },
            )
            .ccMinimumTouchTarget()
            .clearAndSetSemantics {
                contentDescription = label
                selected = status == CCCheckboxStatus.on
            },
        horizontalArrangement = Arrangement.spacedBy(CocsoTokens.Spacing.s5),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Box(
            modifier = Modifier
                .size(side)
                .clip(radius)
                .background(style.bgColor ?: CocsoTokens.Color.surfacePrimary())
                .border(1.dp, style.borderColor ?: CocsoTokens.Color.borderPrimary(), radius),
            contentAlignment = Alignment.Center,
        ) {
            when (status) {
                CCCheckboxStatus.on -> Icon(
                    imageVector = Icons.Filled.Check,
                    contentDescription = null,
                    tint = tint,
                    modifier = Modifier.size(side * 0.8f),
                )
                CCCheckboxStatus.intermediate -> Box(
                    modifier = Modifier
                        .size(width = side * 0.55f, height = 2.dp)
                        .clip(RoundedCornerShape(1.dp))
                        .background(tint)
                )
                CCCheckboxStatus.off -> Unit
            }
        }
        CCTypography(label, type = CCTypographyType.body, size = CCTypographySize.medium)
    }
}
