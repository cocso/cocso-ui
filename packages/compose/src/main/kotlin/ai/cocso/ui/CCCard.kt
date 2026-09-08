package ai.cocso.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.border
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
 * Values come from [cCCardStyle], generated from `card.recipe.ts`.
 *
 * The `glass` variant is the recipe's tint and edge. SwiftUI puts its material
 * under the tint; Compose has no backdrop blur — see [ccGlass] — so here the
 * tint sits on the page surface and the card reads as a solid of the same tone.
 */
@Composable
fun CCCard(
    modifier: Modifier = Modifier,
    variant: CCCardVariant = CCCardVariant.elevated,
    padding: CCCardPadding = CCCardPadding.md,
    content: @Composable ColumnScope.() -> Unit,
) {
    val style = cCCardStyle(variant = variant, padding = padding)

    val cardShape = RoundedCornerShape(style.borderRadius ?: 0.dp)

    Column(
        modifier = modifier
            // The web's `.elevated { box-shadow: var(--cocso-shadow-card) }` —
            // structure, not a recipe value, the same way it is on the web.
            .then(
                if (variant == CCCardVariant.elevated) {
                    Modifier.ccShadow(CocsoTokens.Shadow.card(), cardShape)
                } else {
                    Modifier
                }
            )
            .clip(cardShape)
            .then(
                if (variant == CCCardVariant.glass) {
                    Modifier.background(CocsoTokens.Color.surfacePrimary())
                } else {
                    Modifier
                }
            )
            .background(style.bgColor ?: CocsoTokens.Color.surfacePrimary())
            // The recipe's border — the outlined variant. Without it a white card
            // on a white surface had no edge at all.
            .then(
                style.borderColor?.let {
                    Modifier.border(style.borderWidth ?: 1.dp, it, cardShape)
                } ?: Modifier
            )
            // The recipe's 12/16/24. Picking these from the spacing scale by
            // hand gave 8/12/20 — every card was tighter than the web's.
            .padding(
                horizontal = style.paddingX ?: 0.dp,
                vertical = style.paddingY ?: 0.dp,
            ),
        content = content,
    )
}
