package ai.cocso.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color as ComposeColor
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

/**
 * A status message.
 *
 * Values come from [cCAlertStyle], generated from `alert.recipe.ts`. The border
 * the recipe declares is a composite that does not cross as a single value, so
 * its colour is used with a one-dp stroke — the width the web draws.
 */
@Composable
fun CCAlert(
    title: String,
    modifier: Modifier = Modifier,
    message: String? = null,
    variant: CCAlertVariant = CCAlertVariant.info,
) {
    val style = cCAlertStyle(variant = variant)
    val shape = RoundedCornerShape(style.borderRadius ?: 0.dp)

    Column(
        modifier = modifier
            .fillMaxWidth()
            .clip(shape)
            .background(style.bgColor ?: ComposeColor.Transparent)
            .border(1.dp, style.borderColor ?: ComposeColor.Transparent, shape)
            .padding(
                horizontal = style.paddingX ?: 0.dp,
                vertical = style.paddingY ?: 0.dp,
            ),
        verticalArrangement = Arrangement.spacedBy(CocsoTokens.Spacing.s3),
    ) {
        Text(
            text = title,
            color = style.fontColor ?: CocsoTokens.Color.textPrimary(),
            fontSize = (style.fontSize?.value ?: 14f).sp,
            fontWeight = FontWeight.SemiBold,
        )
        if (message != null) {
            Text(
                text = message,
                color = style.fontColor ?: CocsoTokens.Color.textPrimary(),
                fontSize = (style.fontSize?.value ?: 14f).sp,
            )
        }
    }
}
