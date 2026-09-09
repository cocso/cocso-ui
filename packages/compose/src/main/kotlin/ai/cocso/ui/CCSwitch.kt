package ai.cocso.ui

import androidx.compose.animation.animateColorAsState
import androidx.compose.animation.core.animateDpAsState
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.clip
import androidx.compose.ui.focus.onFocusChanged
import androidx.compose.ui.graphics.Color as ComposeColor
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.clearAndSetSemantics
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.role
import androidx.compose.ui.semantics.stateDescription
import androidx.compose.ui.semantics.toggleableState
import androidx.compose.ui.state.ToggleableState
import androidx.compose.ui.unit.dp

/** Which side of the track the label sits on — the web's `position`. */
enum class CCSwitchLabelPosition {
    /** Label before the track. The web's `position="left"`. */
    Leading,
    /** Label after the track. The web's default. */
    Trailing,
}

/** A toggle. */
@Composable
fun CCSwitch(
    label: String,
    checked: Boolean,
    onChange: (Boolean) -> Unit,
    modifier: Modifier = Modifier,
    variant: CCSwitchVariant = CCSwitchVariant.primary,
    size: CCSwitchSize = CCSwitchSize.medium,
    labelPosition: CCSwitchLabelPosition = CCSwitchLabelPosition.Trailing,
    enabled: Boolean = true,
) {
    val style = cCSwitchStyle(
        variant = variant,
        size = size,
        checked = if (checked) CCSwitchChecked.`true` else CCSwitchChecked.`false`,
    )
    val interactionSource = remember { MutableInteractionSource() }
    // WCAG 2.4.7 applies wherever there is a keyboard, and Android supports
    // one. The web draws `.switch:focus-visible`; this drew nothing.
    var isFocused by remember { mutableStateOf(false) }
    val trackWidth = style.width ?: 36.dp
    val trackHeight = style.height ?: 20.dp
    val thumb = style.thumbSize ?: 16.dp
    val inset = style.thumbOffset ?: 2.dp

    // The thumb travels and the track recolours on the web's
    // `transition: transform fast soft` — not on one frame.
    val travel by animateDpAsState(
        if (checked) trackWidth - thumb - inset * 2 else 0.dp,
        animationSpec = CCMotion.movement(),
        label = "switch-thumb",
    )
    val track by animateColorAsState(
        (if (checked) style.checkedBgColor else style.switchBgColor)
            ?: CocsoTokens.Color.surfaceNeutral(),
        animationSpec = CCMotion.colour(),
        label = "switch-track",
    )
    val thumbFill by animateColorAsState(
        style.thumbColor ?: CocsoTokens.Color.textOnPrimary(),
        animationSpec = CCMotion.colour(),
        label = "switch-thumb-colour",
    )
    val thumbEdge by animateColorAsState(
        style.thumbBorderColor ?: ComposeColor.Transparent,
        animationSpec = CCMotion.colour(),
        label = "switch-thumb-border",
    )
    val dim by animateFloatAsState(
        if (enabled) 1f else 0.4f,
        animationSpec = CCMotion.colour(),
        label = "switch-enabled",
    )
    val stateOn = CCStrings.on()
    val stateOff = CCStrings.off()

    Row(
        modifier = modifier
            .alpha(dim)
            .ccPressFeedback(interactionSource)
            .onFocusChanged { isFocused = it.isFocused }
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
                stateDescription = if (checked) stateOn else stateOff
            },
        horizontalArrangement = Arrangement.spacedBy(CocsoTokens.Spacing.s5),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        if (labelPosition == CCSwitchLabelPosition.Leading) {
            CCTypography(label, type = CCTypographyType.body, size = CCTypographySize.medium)
        }
        Box(
            modifier = Modifier
                .size(width = trackWidth, height = trackHeight)
                .clip(CircleShape)
                .background(track)
                // 꺼진 트랙은 페이지와 1.23:1 이라 스위치가 어디 있는지 보이지
                // 않았다. 색은 레시피가 정한다.
                .border(
                    1.dp,
                    style.borderColor ?: CocsoTokens.Color.borderStrong(),
                    CircleShape,
                )
                .ccFocusRing(isFocused, CircleShape)
                .padding(horizontal = inset),
            contentAlignment = Alignment.CenterStart,
        ) {
            Box(
                modifier = Modifier
                    .offset(x = travel)
                    .size(thumb)
                    // The web's `--cocso-shadow-thumb`: the handle lifts off the track.
                    .ccShadow(CocsoTokens.Shadow.thumb(), CircleShape)
                    .clip(CircleShape)
                    // 레시피가 정한다. 세 플랫폼이 각자 고르던 자리였다.
                    .background(thumbFill)
                    // 꺼진 상태에만 값이 온다 — 손잡이와 트랙이 1.23:1 이라
                    // 경계가 필요하고, 켜진 트랙 위에서는 이미 18:1 이다. 켜지면
                    // 투명으로 애니메이션되어 사라진다.
                    .border(1.dp, thumbEdge, CircleShape)
            )
        }
        if (labelPosition == CCSwitchLabelPosition.Trailing) {
            CCTypography(label, type = CCTypographyType.body, size = CCTypographySize.medium)
        }
    }
}
