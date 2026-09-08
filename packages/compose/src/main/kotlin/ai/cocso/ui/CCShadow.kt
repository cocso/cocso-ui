package ai.cocso.ui

import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Shape

/**
 * A token shadow, drawn.
 *
 * The web's `box-shadow` is a list of layers, and the tokens carry it that way:
 * `CocsoTokens.Shadow.card()` is two layers, a tight one and a soft one.
 * Compose draws one shadow per node, from an elevation, so the layers collapse
 * to the softest one: its blur halved as the elevation (a CSS blur is a
 * diameter), its hue as both the ambient and the spot colour. The platform
 * derives the shadow's alpha from the elevation itself, so the layer's own
 * alpha is dropped — passed through, it attenuated twice and the card sat
 * flat. The tight inner layer is lost — a visible but small difference from
 * iOS, and the platform's own shadow rather than a bitmap of the web's.
 *
 * Until the tokens carried shadows the elevated card was a flat rectangle on
 * both platforms — the one variant whose whole meaning is its shadow.
 */
fun Modifier.ccShadow(layers: List<CocsoShadowLayer>, shape: Shape): Modifier {
    val softest = layers.maxByOrNull { it.blur } ?: return this
    return shadow(
        elevation = softest.blur / 2,
        shape = shape,
        ambientColor = softest.color.copy(alpha = 1f),
        spotColor = softest.color.copy(alpha = 1f),
    )
}
