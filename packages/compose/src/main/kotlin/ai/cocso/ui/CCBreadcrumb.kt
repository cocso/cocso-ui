package ai.cocso.ui

import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.size
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ChevronRight
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

/** One crumb. The last one in a [CCBreadcrumb] is where the user is and has no action. */
data class CCBreadcrumbItem(val id: String, val title: String)

/**
 * Where the user is, and the way back.
 *
 * Values come from [cCBreadcrumbStyle], generated from `breadcrumb.recipe.ts`.
 * Every crumb but the last is a link in the recipe's `text-secondary`; the last
 * is the current place, in `text-primary` at medium weight, as the web's
 * `:last-child` draws it. Separators are `text-tertiary` chevrons — decoration,
 * below AA on purpose and hidden from a screen reader.
 */
@Composable
fun CCBreadcrumb(
    items: List<CCBreadcrumbItem>,
    onSelect: (CCBreadcrumbItem) -> Unit,
    modifier: Modifier = Modifier,
    size: CCBreadcrumbSize = CCBreadcrumbSize.md,
) {
    val style = cCBreadcrumbStyle(size = size)
    val fontSize = (style.fontSize?.value ?: 14f).sp
    val interactionSource = remember { MutableInteractionSource() }
    val label = CCStrings.breadcrumb()

    Row(
        modifier = modifier.semantics { contentDescription = label },
        horizontalArrangement = Arrangement.spacedBy(CocsoTokens.Spacing.s2),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        items.forEachIndexed { index, item ->
            if (index == items.lastIndex) {
                Text(item.title, color = CocsoTokens.Color.textPrimary(), fontSize = fontSize, fontWeight = FontWeight.Medium)
            } else {
                Text(
                    text = item.title,
                    color = style.fontColor ?: CocsoTokens.Color.textSecondary(),
                    fontSize = fontSize,
                    modifier = Modifier
                        .clickable(interactionSource = interactionSource, indication = null, role = Role.Button) { onSelect(item) }
                        .ccMinimumTouchTarget(),
                )
                Icon(
                    imageVector = Icons.Filled.ChevronRight,
                    contentDescription = null,
                    tint = CocsoTokens.Color.textTertiary(),
                    modifier = Modifier.size((style.fontSize ?: 14.dp)),
                )
            }
        }
    }
}
