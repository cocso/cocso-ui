package ai.cocso.ui

import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.RectangleShape
import androidx.compose.ui.unit.dp
import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test

/**
 * `ccShadow` puts a shadow on the node.
 *
 * Robolectric does not render elevation, so the goldens cannot show the card's
 * shadow and the render test cannot miss it. This reads the modifier chain
 * instead: the softest layer becomes a `shadow` element with half its blur as
 * the elevation, and no layers add nothing.
 */
class ShadowModifierTest {
    private val layers = listOf(
        CocsoShadowLayer(x = 0.dp, y = 0.dp, blur = 2.dp, spread = 0.dp, color = Color(0x0A000000)),
        CocsoShadowLayer(x = 0.dp, y = 4.dp, blur = 8.dp, spread = 0.dp, color = Color(0x14000000)),
    )

    private fun elementNames(modifier: Modifier): List<String> =
        modifier.foldIn(mutableListOf()) { acc, element -> acc.also { it += element::class.java.simpleName } }

    @Test
    fun addsAShadowElementForTheSoftestLayer() {
        val names = elementNames(Modifier.ccShadow(layers, RectangleShape))
        assertTrue("no shadow element in $names", names.any { it.contains("Shadow", ignoreCase = true) })
        // The element's string form carries the elevation Compose will draw.
        val element = Modifier.ccShadow(layers, RectangleShape).foldIn<Any?>(null) { acc, e -> acc ?: e }
        assertTrue("elevation is half the softest blur (4dp): $element", element.toString().contains("4.0.dp"))
    }

    @Test
    fun addsNothingForNoLayers() {
        assertEquals(Modifier, Modifier.ccShadow(emptyList(), RectangleShape))
    }
}
