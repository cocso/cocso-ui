package ai.cocso.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.clip
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.clearAndSetSemantics
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.role
import androidx.compose.ui.semantics.stateDescription
import androidx.compose.ui.semantics.toggleableState
import androidx.compose.ui.state.ToggleableState
import androidx.compose.ui.unit.dp

/** A toggle. */
@Composable
fun CCSwitch(
    label: String,
    checked: Boolean,
    onChange: (Boolean) -> Unit,
    modifier: Modifier = Modifier,
    variant: CCSwitchVariant = CCSwitchVariant.primary,
    size: CCSwitchSize = CCSwitchSize.medium,
    enabled: Boolean = true,
) {
    val style = cCSwitchStyle(
        variant = variant,
        size = size,
        checked = if (checked) CCSwitchChecked.`true` else CCSwitchChecked.`false`,
    )
    val interactionSource = remember { MutableInteractionSource() }
    val trackWidth = style.width ?: 36.dp
    val trackHeight = style.height ?: 20.dp
    val thumb = style.thumbSize ?: 16.dp
    val inset = style.thumbOffset ?: 2.dp

    Row(
        modifier = modifier
            .alpha(if (enabled) 1f else 0.4f)
            .clickable(
                enabled = enabled,
                interactionSource = interactionSource,
                indication = null,
                onClick = { onChange(!checked) },
            )
            .ccMinimumTouchTarget()
            // The role belongs inside the block: clearing the subtree's
            // semantics drops what `clickable` set.
            .clearAndSetSemantics {
                contentDescription = label
                role = Role.Switch
                toggleableState =
                    if (checked) ToggleableState.On else ToggleableState.Off
                stateDescription = if (checked) "On" else "Off"
            },
        horizontalArrangement = Arrangement.spacedBy(CocsoTokens.Spacing.s5),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Box(
            modifier = Modifier
                .size(width = trackWidth, height = trackHeight)
                .clip(CircleShape)
                .background(
                    (if (checked) style.checkedBgColor else style.switchBgColor)
                        ?: CocsoTokens.Color.surfaceNeutral()
                )
                // 꺼진 트랙은 페이지와 1.23:1 이라 스위치가 어디 있는지 보이지
                // 않았다. 색은 레시피가 정한다.
                .border(
                    1.dp,
                    style.borderColor ?: CocsoTokens.Color.borderStrong(),
                    CircleShape,
                )
                .padding(horizontal = inset),
            contentAlignment = if (checked) Alignment.CenterEnd else Alignment.CenterStart,
        ) {
            Box(
                modifier = Modifier
                    .size(thumb)
                    .clip(CircleShape)
                    .background(CocsoTokens.Color.surfacePrimary())
            )
        }
        CCTypography(label, type = CCTypographyType.body, size = CCTypographySize.medium)
    }
}
