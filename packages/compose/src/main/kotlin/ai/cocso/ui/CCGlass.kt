package ai.cocso.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.BoxScope
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.navigationBars
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.statusBars
import androidx.compose.foundation.layout.windowInsetsPadding
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.drawBehind
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.RectangleShape
import androidx.compose.ui.graphics.Shape
import androidx.compose.ui.unit.dp

/**
 * A glass surface: the tint of a pane over what scrolls beneath it.
 *
 * Glass is for the layers that float over content and stay put while it
 * moves — a tab bar, a navigation bar, a floating card over a photo. The tint
 * is `surface-glass` and the edge is `border-glass`, so the pane is the same
 * tone on every platform and in both themes.
 *
 * Compose has no backdrop blur: `Modifier.blur` blurs a layer's own content,
 * and blurring what is behind a layer needs the app to draw that content into
 * the layer (a compositor pass — what the `haze` library does). An unblurred
 * translucent pane over a busy screen is mud, so here the tint sits on the
 * page surface and the pane reads as a solid of the same tone — iOS glass,
 * Android solid, the same colour on both, which is the pairing the platforms'
 * own apps have settled on.
 */
enum class CCGlassEdge {
    /** A bar along the top of the screen — a navigation or a title bar. */
    Top,
    /** A bar along the bottom — a tab bar, a toolbar. */
    Bottom,
}

/** Glass filling the modifier's bounds. For a floating shape pass one. */
@Composable
fun Modifier.ccGlass(shape: Shape = RectangleShape): Modifier =
    background(CocsoTokens.Color.surfacePrimary(), shape)
        .background(CocsoTokens.Color.surfaceGlass(), shape)
        .then(
            if (shape == RectangleShape) Modifier
            else Modifier.border(1.dp, CocsoTokens.Color.borderGlass(), shape)
        )

/**
 * A bar on glass — the surface a tab bar or a navigation bar sits on.
 *
 * The glass runs under the system bar and the content stays clear of it. The
 * hairline sits on the inner edge, where the bar meets the content, so the pane
 * has an edge the way a physical one does.
 *
 * The items are the app's — which tabs there are is not a design-system
 * decision — and this is the surface they sit on, so every bar in every app on
 * this system is the same glass.
 */
@Composable
fun CCGlassBar(
    modifier: Modifier = Modifier,
    edge: CCGlassEdge = CCGlassEdge.Bottom,
    content: @Composable BoxScope.() -> Unit,
) {
    val hairline = CocsoTokens.Color.borderGlass()
    Box(
        modifier = modifier
            .fillMaxWidth()
            .ccGlass()
            .drawBehind {
                val y = if (edge == CCGlassEdge.Bottom) 0f else size.height - 1.dp.toPx()
                drawRect(hairline, topLeft = Offset(0f, y), size = Size(size.width, 1.dp.toPx()))
            }
            .windowInsetsPadding(
                if (edge == CCGlassEdge.Bottom) WindowInsets.navigationBars else WindowInsets.statusBars
            )
            // 16 / 8: the inset a toolbar row has on the web.
            .padding(horizontal = CocsoTokens.Spacing.s8, vertical = CocsoTokens.Spacing.s5),
        content = content,
    )
}
