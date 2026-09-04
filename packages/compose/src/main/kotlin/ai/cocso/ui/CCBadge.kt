package ai.cocso.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

/**
 * A small status label.
 *
 * Values come from [cCBadgeStyle], generated from `badge.recipe.ts`.
 */
@Composable
fun CCBadge(
    text: String,
    modifier: Modifier = Modifier,
    variant: CCBadgeVariant = CCBadgeVariant.primary,
    size: CCBadgeSize = CCBadgeSize.medium,
    shape: CCBadgeShape = CCBadgeShape.square,
) {
    val style = cCBadgeStyle(variant = variant, size = size, shape = shape)
    // A percentage radius has no length to travel as, so the recipe sends
    // `borderRadiusFull` and a fully rounded corner is what it means here.
    val badgeShape = if (style.borderRadiusFull == true) {
        CircleShape
    } else {
        RoundedCornerShape(style.borderRadius ?: 0.dp)
    }

    Text(
        text = text,
        modifier = modifier
            .clip(badgeShape)
            .background(style.bgColor ?: CocsoTokens.Color.surfaceSecondary())
            .padding(
                horizontal = style.paddingX ?: 0.dp,
                vertical = style.paddingY ?: 0.dp,
            ),
        color = style.fontColor ?: CocsoTokens.Color.textPrimary(),
        fontSize = (style.fontSize?.value ?: 12f).sp,
        fontWeight = FontWeight.SemiBold,
    )
}
