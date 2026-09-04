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
 * `padding` dimension is CSS shorthand, which does not cross as a length, so
 * the inset is taken from the spacing scale and named as such.
 */
@Composable
fun CCCard(
    modifier: Modifier = Modifier,
    variant: CCCardVariant = CCCardVariant.elevated,
    padding: CCCardPadding = CCCardPadding.md,
    content: @Composable ColumnScope.() -> Unit,
) {
    val style = cCCardStyle(variant = variant, padding = padding)
    val inset = when (padding) {
        CCCardPadding.sm -> CocsoTokens.Spacing.s5
        CCCardPadding.md -> CocsoTokens.Spacing.s7
        CCCardPadding.lg -> CocsoTokens.Spacing.s9
    }

    Column(
        modifier = modifier
            .clip(RoundedCornerShape(style.borderRadius ?: 0.dp))
            .background(style.bgColor ?: CocsoTokens.Color.surfacePrimary())
            .padding(inset),
        content = content,
    )
}
