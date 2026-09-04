package ai.cocso.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ColumnScope
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.unit.dp

/**
 * A surface that groups content.
 *
 * Values come from [cCCardStyle], generated from `card.recipe.ts`. The recipe's
 */
@Composable
fun CCCard(
    modifier: Modifier = Modifier,
    variant: CCCardVariant = CCCardVariant.elevated,
    padding: CCCardPadding = CCCardPadding.md,
    content: @Composable ColumnScope.() -> Unit,
) {
    val style = cCCardStyle(variant = variant, padding = padding)

    Column(
        modifier = modifier
            .clip(RoundedCornerShape(style.borderRadius ?: 0.dp))
            .background(style.bgColor ?: CocsoTokens.Color.surfacePrimary())
            // The recipe's 12/16/24. Picking these from the spacing scale by
            // hand gave 8/12/20 — every card was tighter than the web's.
            .padding(
                horizontal = style.paddingX ?: 0.dp,
                vertical = style.paddingY ?: 0.dp,
            ),
        content = content,
    )
}
