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
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.UnfoldMore
import androidx.compose.material3.DropdownMenu
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
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
import androidx.compose.ui.semantics.stateDescription
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

/** One choice a [CCSelect] offers. */
data class CCSelectOption(val id: String, val title: String)

/**
 * A single choice from a short list.
 *
 * Values come from [cCSelectStyle], generated from `select.recipe.ts`. The
 * trigger is the web's `<select>`: the chosen title, or the placeholder in
 * `text-secondary`, with the selector glyph at the recipe's inset. The list is
 * the platform's menu — a `DropdownMenu` anchored to the trigger.
 */
@Composable
fun CCSelect(
    label: String,
    options: List<CCSelectOption>,
    selection: String?,
    onSelectionChange: (String) -> Unit,
    modifier: Modifier = Modifier,
    placeholder: String = CCStrings.select(),
    size: CCSelectSize = CCSelectSize.medium,
    enabled: Boolean = true,
) {
    val style = cCSelectStyle(size = size)
    val shape = RoundedCornerShape(style.borderRadius ?: 4.dp)
    val chosen = options.firstOrNull { it.id == selection }
    val interactionSource = remember { MutableInteractionSource() }
    var expanded by remember { mutableStateOf(false) }
    // 웹의 `.select:focus-visible` (2.4.7). 쉬는 테두리는 `border-strong`.
    var isFocused by remember { mutableStateOf(false) }

    val borderWidth by animateDpAsState(
        if (isFocused) 2.dp else 1.dp,
        animationSpec = CCMotion.colour(),
        label = "select-border-width",
    )
    val borderColor by animateColorAsState(
        if (isFocused) CocsoTokens.Color.focusRing() else style.borderColor ?: CocsoTokens.Color.borderStrong(),
        animationSpec = CCMotion.colour(),
        label = "select-border",
    )
    val ink by animateColorAsState(
        if (chosen == null) CocsoTokens.Color.textSecondary() else CocsoTokens.Color.textPrimary(),
        animationSpec = CCMotion.colour(),
        label = "select-ink",
    )
    val dim by animateFloatAsState(
        if (enabled) 1f else 0.4f,
        animationSpec = CCMotion.colour(),
        label = "select-enabled",
    )

    Column(
        modifier = modifier
            .alpha(dim)
            .semantics {
                contentDescription = label
                stateDescription = chosen?.title ?: placeholder
            },
        verticalArrangement = Arrangement.spacedBy(CocsoTokens.Spacing.s3),
    ) {
        CCTypography(label, type = CCTypographyType.body, size = CCTypographySize.small)
        Box {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .widthIn(min = style.minWidth ?: 0.dp)
                    .height(style.height ?: 36.dp)
                    .onFocusChanged { isFocused = it.isFocused }
                    .ccPressFeedback(interactionSource)
                    .clip(shape)
                    .background(CocsoTokens.Color.surfacePrimary())
                    .border(borderWidth, borderColor, shape)
                    .clickable(
                        enabled = enabled,
                        interactionSource = interactionSource,
                        indication = null,
                        role = Role.DropdownList,
                        onClick = { expanded = true },
                    )
                    // The recipe's right inset already leaves room for the glyph.
                    .padding(
                        start = style.paddingLeft ?: 12.dp,
                        end = (style.paddingRight ?: 38.dp) - (style.iconRight ?: 12.dp) - 12.dp,
                    ),
                verticalAlignment = Alignment.CenterVertically,
            ) {
                Text(
                    text = chosen?.title ?: placeholder,
                    color = ink,
                    fontSize = (style.fontSize?.value ?: 14f).sp,
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis,
                    modifier = Modifier.weight(1f),
                )
                Spacer(Modifier.padding(start = CocsoTokens.Spacing.s5))
                // The web's `SelectorIcon`, at the recipe's `iconRight`.
                Icon(
                    imageVector = Icons.Filled.UnfoldMore,
                    contentDescription = null,
                    tint = CocsoTokens.Color.textSecondary(),
                    modifier = Modifier.padding(end = style.iconRight ?: 12.dp),
                )
            }
            DropdownMenu(expanded = expanded, onDismissRequest = { expanded = false }) {
                for (option in options) {
                    DropdownMenuItem(
                        text = { Text(option.title, color = CocsoTokens.Color.textPrimary()) },
                        onClick = {
                            expanded = false
                            onSelectionChange(option.id)
                        },
                        trailingIcon = if (option.id == selection) {
                            { Icon(Icons.Filled.Check, contentDescription = null, tint = CocsoTokens.Color.textPrimary()) }
                        } else {
                            null
                        },
                    )
                }
            }
        }
    }
}
