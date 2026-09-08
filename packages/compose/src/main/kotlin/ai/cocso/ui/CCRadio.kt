package ai.cocso.ui

import androidx.compose.animation.animateColorAsState
import androidx.compose.animation.core.FiniteAnimationSpec
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.scaleIn
import androidx.compose.animation.scaleOut
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.selection.selectable
import androidx.compose.foundation.selection.selectableGroup
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
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.unit.dp

/** One choice a [CCRadioGroup] offers. */
data class CCRadioOption(val id: String, val title: String)

/**
 * One of several, exactly one chosen.
 *
 * Values come from [cCRadioStyle], generated from `radio-group.recipe.ts` —
 * the recipe is named `radio`, so the style is `CCRadioStyle` and this file
 * follows it. The group lays the options out and owns the selection; each row
 * draws the ring, the dot, and a focus ring where there is a keyboard.
 */
@Composable
fun CCRadioGroup(
    label: String,
    options: List<CCRadioOption>,
    selection: String?,
    onSelectionChange: (String) -> Unit,
    modifier: Modifier = Modifier,
    size: CCRadioSize = CCRadioSize.medium,
    enabled: Boolean = true,
) {
    Column(
        modifier = modifier
            .selectableGroup()
            .semantics { contentDescription = label },
        verticalArrangement = Arrangement.spacedBy(CocsoTokens.Spacing.s3),
    ) {
        CCTypography(label, type = CCTypographyType.body, size = CCTypographySize.small)
        for (option in options) {
            CCRadio(
                title = option.title,
                selected = option.id == selection,
                onSelect = { onSelectionChange(option.id) },
                size = size,
                enabled = enabled,
            )
        }
    }
}

/** A single radio row. [CCRadioGroup] is the usual way to get several. */
@Composable
fun CCRadio(
    title: String,
    selected: Boolean,
    onSelect: () -> Unit,
    modifier: Modifier = Modifier,
    size: CCRadioSize = CCRadioSize.medium,
    enabled: Boolean = true,
) {
    val style = cCRadioStyle(
        size = size,
        selected = if (selected) CCRadioSelected.`true` else CCRadioSelected.`false`,
    )
    val side = style.size ?: 16.dp
    val dot = style.dotSize ?: 7.dp
    val interactionSource = remember { MutableInteractionSource() }
    // WCAG 2.4.7 applies wherever there is a keyboard, and Android supports one.
    var isFocused by remember { mutableStateOf(false) }

    // The ring recolours on the web's colour curve; the dot pops in on the
    // entrance curve. `checkedColor` is the fill the dot sits in; the dot itself
    // is `text-on-primary`, the pairing the checkbox glyph uses, so it reads on
    // a rebranded fill.
    val fill by animateColorAsState(
        style.bgColor ?: CocsoTokens.Color.surfacePrimary(),
        animationSpec = CCMotion.colour(),
        label = "radio-fill",
    )
    val ring by animateColorAsState(
        style.borderColor ?: CocsoTokens.Color.borderStrong(),
        animationSpec = CCMotion.colour(),
        label = "radio-ring",
    )
    val dim by animateFloatAsState(
        if (enabled) 1f else 0.4f,
        animationSpec = CCMotion.colour(),
        label = "radio-enabled",
    )
    val pop: FiniteAnimationSpec<Float> = CCMotion.entrance()
    val checked = style.checkedColor ?: CocsoTokens.Color.interactivePrimary()

    Row(
        modifier = modifier
            .alpha(dim)
            .onFocusChanged { isFocused = it.isFocused }
            .selectable(
                selected = selected,
                enabled = enabled,
                interactionSource = interactionSource,
                indication = null,
                role = Role.RadioButton,
                onClick = onSelect,
            )
            .ccMinimumTouchTarget()
            .semantics { contentDescription = title },
        horizontalArrangement = Arrangement.spacedBy(CocsoTokens.Spacing.s5),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Box(
            modifier = Modifier
                .size(side)
                .clip(CircleShape)
                // The fill already carries `checkedColor` when selected; it is
                // named so a consumer can retheme it, and read here so a fill
                // the resolver leaves empty still shows the selection.
                .background(if (selected) checked else fill)
                .border(1.dp, ring, CircleShape)
                // Only while focused — `Modifier.border(0.dp)` is a hairline.
                .then(
                    if (isFocused) {
                        Modifier.border(2.dp, style.focusRingColor ?: CocsoTokens.Color.focusRing(), CircleShape)
                    } else {
                        Modifier
                    }
                ),
            contentAlignment = Alignment.Center,
        ) {
            // Qualified: inside the Row the `RowScope` overload shadows this one.
            androidx.compose.animation.AnimatedVisibility(
                visible = selected,
                enter = scaleIn(pop, initialScale = 0.4f) + fadeIn(pop),
                exit = scaleOut(pop, targetScale = 0.4f) + fadeOut(pop),
            ) {
                Box(
                    modifier = Modifier
                        .size(dot)
                        .clip(CircleShape)
                        .background(CocsoTokens.Color.textOnPrimary())
                )
            }
        }
        CCTypography(title, type = CCTypographyType.body, size = CCTypographySize.medium)
    }
}
