package ai.cocso.ui

import androidx.compose.animation.animateColorAsState
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ChevronLeft
import androidx.compose.material.icons.filled.ChevronRight
import androidx.compose.material.icons.filled.MoreHoriz
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.focus.onFocusChanged
import androidx.compose.ui.graphics.Color as ComposeColor
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.selected
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import kotlin.math.ceil

/**
 * Page navigation: previous and next, and a truncated run of page numbers.
 *
 * Values come from [cCPaginationStyle], generated from `pagination.recipe.ts`:
 * a 32dp square per page, the active one filled. The truncation is the web's —
 * first and last always shown, `maxVisible` around the current page, an
 * ellipsis where pages are skipped.
 */
@Composable
fun CCPagination(
    page: Int,
    totalPages: Int,
    onChange: (Int) -> Unit,
    modifier: Modifier = Modifier,
    maxVisible: Int = 5,
) {
    val label = CCStrings.pagination()
    Row(
        modifier = modifier.semantics { contentDescription = label },
        horizontalArrangement = Arrangement.spacedBy(CocsoTokens.Spacing.s3),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        if (totalPages > 1) {
            PaginationArrow(Icons.Filled.ChevronLeft, CCStrings.previousPage(), enabled = page > 1) { onChange(page - 1) }
        }
        for (slot in paginationSlots(page, totalPages, maxVisible)) {
            if (slot == null) {
                Icon(Icons.Filled.MoreHoriz, contentDescription = null, tint = CocsoTokens.Color.textSecondary(), modifier = Modifier.size(32.dp))
            } else {
                PaginationPage(slot, active = slot == page) { onChange(slot) }
            }
        }
        if (totalPages > 1) {
            PaginationArrow(Icons.Filled.ChevronRight, CCStrings.nextPage(), enabled = page < totalPages) { onChange(page + 1) }
        }
    }
}

/** The web's range: `null` where an ellipsis goes. */
internal fun paginationSlots(page: Int, totalPages: Int, maxVisible: Int): List<Int?> {
    if (totalPages <= maxVisible + 2) return (1..maxOf(totalPages, 1)).toList()
    val half = ceil(maxVisible / 2.0).toInt()
    val out = mutableListOf<Int?>(1)
    if (page > 1 + half) out += null
    for (index in 0 until maxVisible) {
        val number = page - half + index + 1
        if (number > 1 && number < totalPages) out += number
    }
    if (page < totalPages - half) out += null
    out += totalPages
    return out
}

@Composable
private fun PaginationPage(number: Int, active: Boolean, onClick: () -> Unit) {
    val style = cCPaginationStyle(pageState = if (active) CCPaginationPageState.active else CCPaginationPageState.inactive)
    val interactionSource = remember { MutableInteractionSource() }
    val fill by animateColorAsState(style.bgColor ?: ComposeColor.Transparent, animationSpec = CCMotion.colour(), label = "page-fill")
    val ink by animateColorAsState(style.fontColor ?: CocsoTokens.Color.textPrimary(), animationSpec = CCMotion.colour(), label = "page-ink")
    val pageLabel = CCStrings.page(number)
    // The web draws `.item:focus-visible` and scales the square on `:active`.
    var isFocused by remember { mutableStateOf(false) }
    Box(
        modifier = Modifier
            .ccPressFeedback(interactionSource)
            .onFocusChanged { isFocused = it.isFocused }
            .size(width = style.width ?: 32.dp, height = style.height ?: 32.dp)
            .clip(RoundedCornerShape(style.borderRadius ?: 8.dp))
            .background(fill)
            .ccFocusRing(isFocused, RoundedCornerShape(style.borderRadius ?: 8.dp))
            .ccMinimumTouchTarget()
            .clickable(interactionSource = interactionSource, indication = null, role = Role.Button, onClick = onClick)
            .semantics {
                contentDescription = pageLabel
                selected = active
            },
        contentAlignment = Alignment.Center,
    ) {
        Text(
            text = number.toString(),
            color = ink,
            fontSize = (style.fontSize?.value ?: 14f).sp,
            fontWeight = style.fontWeight,
        )
    }
}

@Composable
private fun PaginationArrow(
    glyph: androidx.compose.ui.graphics.vector.ImageVector,
    label: String,
    enabled: Boolean,
    onClick: () -> Unit,
) {
    val style = cCPaginationStyle(pageState = if (enabled) CCPaginationPageState.inactive else CCPaginationPageState.disabled)
    val interactionSource = remember { MutableInteractionSource() }
    // The web draws `.arrow:focus-visible`; this drew nothing.
    var isFocused by remember { mutableStateOf(false) }
    Icon(
        imageVector = glyph,
        contentDescription = label,
        tint = style.fontColor ?: CocsoTokens.Color.textPrimary(),
        modifier = Modifier
            .ccPressFeedback(interactionSource)
            .onFocusChanged { isFocused = it.isFocused }
            .size(width = style.width ?: 32.dp, height = style.height ?: 32.dp)
            .ccFocusRing(isFocused, RoundedCornerShape(style.borderRadius ?: 8.dp))
            .ccMinimumTouchTarget()
            .clickable(enabled = enabled, interactionSource = interactionSource, indication = null, role = Role.Button, onClick = onClick),
    )
}
