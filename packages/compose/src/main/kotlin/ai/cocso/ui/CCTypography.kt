package ai.cocso.ui

import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.sp

/** Text at a role from the type scale. Values come from `typography.recipe.ts`. */
@Composable
fun CCTypography(
    text: String,
    modifier: Modifier = Modifier,
    type: CCTypographyType = CCTypographyType.body,
    size: CCTypographySize = CCTypographySize.medium,
) {
    val style = cCTypographyStyle(type = type, size = size)
    Text(
        text = text,
        modifier = modifier,
        color = CocsoTokens.Color.textPrimary(),
        fontSize = (style.fontSize?.value ?: 14f).sp,
        fontWeight = style.fontWeight ?: FontWeight.Normal,
    )
}
