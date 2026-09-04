package ai.cocso.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

/** An identity mark: initials when there is no image. */
@Composable
fun CCAvatar(
    initials: String,
    label: String,
    modifier: Modifier = Modifier,
    size: CCAvatarSize = CCAvatarSize.md,
    shape: CCAvatarShape = CCAvatarShape.circle,
) {
    val style = cCAvatarStyle(size = size, shape = shape)
    val side = style.width ?: 32.dp
    val clipShape =
        // A percentage radius in the recipe arrives as `borderRadiusFull`.
        // Reading the shape off the variant name instead is how the two
        // platforms ended up compensating in two different ways.
        if (style.borderRadiusFull == true) CircleShape
        else RoundedCornerShape(style.borderRadius ?: 0.dp)

    Box(
        modifier = modifier
            .size(side, style.height ?: side)
            .clip(clipShape)
            .background(style.bgColor ?: CocsoTokens.Color.surfaceNeutral())
            // Named once, so a screen reader does not announce an unlabelled
            // element beside the label.
            .semantics { contentDescription = label },
        contentAlignment = Alignment.Center,
    ) {
        Text(
            text = initials,
            color = style.fontColor ?: CocsoTokens.Color.textPrimary(),
            fontSize = (style.fontSize?.value ?: 12f).sp,
            fontWeight = style.fontWeight ?: FontWeight.SemiBold,
        )
    }
}
