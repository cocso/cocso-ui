package ai.cocso.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.progressBarRangeInfo
import androidx.compose.ui.semantics.ProgressBarRangeInfo
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.unit.dp

/** A determinate progress bar. */
@Composable
fun CCProgress(
    value: Float,
    modifier: Modifier = Modifier,
    total: Float = 100f,
    label: String = "Progress",
    variant: CCProgressVariant = CCProgressVariant.primary,
    size: CCProgressSize = CCProgressSize.md,
) {
    val style = cCProgressStyle(variant = variant, size = size)
    val fraction = if (total > 0f) (value / total).coerceIn(0f, 1f) else 0f
    val height = style.height ?: 8.dp
    val shape = RoundedCornerShape(style.borderRadius ?: height / 2)

    Box(
        modifier = modifier
            .fillMaxWidth()
            .height(height)
            .clip(shape)
            .background(style.bgColor ?: CocsoTokens.Color.surfaceNeutral())
            // `role="progressbar"` is invalid without a name on the web, and the
            // equivalent here is a value with something naming it.
            .semantics {
                contentDescription = label
                progressBarRangeInfo = ProgressBarRangeInfo(fraction, 0f..1f)
            },
        contentAlignment = Alignment.CenterStart,
    ) {
        Box(
            modifier = Modifier
                .fillMaxWidth(fraction)
                .fillMaxHeight()
                .clip(shape)
                .background(style.fillColor ?: CocsoTokens.Color.interactivePrimary())
        )
    }
}
