package ai.cocso.ui

import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import dev.chrisbanes.haze.HazeState
import dev.chrisbanes.haze.hazeSource
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.semantics.SemanticsActions
import androidx.compose.ui.semantics.getOrNull
import androidx.compose.ui.test.assertHeightIsAtLeast
import androidx.compose.ui.test.hasClickAction
import androidx.compose.ui.test.assertIsOff
import androidx.compose.ui.test.assertIsOn
import androidx.compose.ui.test.assertIsSelected
import androidx.compose.ui.test.junit4.createComposeRule
import androidx.compose.ui.test.onNodeWithContentDescription
import androidx.compose.ui.test.onNodeWithText
import androidx.compose.ui.test.onRoot
import androidx.compose.ui.test.click
import androidx.compose.ui.test.performClick
import androidx.compose.ui.test.performTouchInput
import androidx.compose.ui.geometry.Offset
import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Rule
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.RobolectricTestRunner
import org.robolectric.annotation.Config

/**
 * The views, used.
 *
 * The render tests say a control is drawn; nothing said it works. A checkbox
 * that draws its glyph and never calls `onChange` passes every gate that
 * existed. These drive each control the way a finger does and read the
 * callback and the semantics back — the same two things a screen-reader user
 * depends on.
 */
@RunWith(RobolectricTestRunner::class)
@Config(sdk = [34])
class ComponentInteractionTest {

    @get:Rule
    val composeRule = createComposeRule()

    @Test
    fun buttonCallsOnClick() {
        var clicks = 0
        composeRule.setContent { CCButton(title = "Save", onClick = { clicks++ }) }
        composeRule.onNodeWithText("Save").performClick()
        assertEquals(1, clicks)
    }

    @Test
    fun everyButtonSizeIsATargetAFingerCanHit() {
        // The recipe draws the pill at 28 to 48 by size, and the four under 48
        // were a target Material says a finger misses. The row grows instead of
        // the pill, so this asserts both halves: the node is 48 tall, and the
        // strip above the pill clicks — a row that is only tall in layout is
        // not a target, which is what a `Modifier.height` on the pill gave.
        val sizes = listOf(
            CCButtonSize.xSmall, CCButtonSize.small, CCButtonSize.medium,
            CCButtonSize.large, CCButtonSize.xLarge,
        )
        var clicks = 0
        composeRule.setContent {
            Column { sizes.forEach { CCButton(title = it.name, onClick = { clicks++ }, size = it) } }
        }
        for (size in sizes) {
            composeRule.onNodeWithText(size.name).assertHeightIsAtLeast(CCTouchTarget.minimum)
        }
        composeRule.onNodeWithText(CCButtonSize.xSmall.name).performTouchInput {
            click(Offset(centerX, 1f))
        }
        assertEquals(1, clicks)
    }

    @Test
    // Tall enough that nothing is laid out below the screen, where a node
    // measures zero high and would read as a failure of its own.
    @Config(qualifiers = "w360dp-h3200dp")
    fun everyClickableIsATargetAFingerCanHit() {
        // Not per component but per clickable node, so a control added later is
        // measured without anyone listing it. Three were quietly failing a floor
        // they all appeared to apply: pagination's came after `size(32)`, where a
        // minimum does nothing, and select had none. See CCTouchTarget.
        composeRule.setContent {
            Column {
                CCButton(title = "Button", onClick = {}, size = CCButtonSize.xSmall)
                CCCheckbox(label = "Checkbox", status = CCCheckboxStatus.off, onChange = {})
                CCSwitch(label = "Switch", checked = false, onChange = {})
                CCRadioGroup(label = "Radio", options = listOf(CCRadioOption("a", "A")), selection = "a", onSelectionChange = {})
                CCSelect(label = "Select", options = listOf(CCSelectOption("a", "A")), selection = "a", onSelectionChange = {})
                CCInput(label = "Input", value = "", onValueChange = {}, isSecure = true)
                CCLink(title = "Link", onClick = {})
                CCBreadcrumb(items = listOf(CCBreadcrumbItem("h", "Home"), CCBreadcrumbItem("x", "Here")), onSelect = {})
                CCPagination(page = 2, totalPages = 3, onChange = {})
                CCAlert(title = "Alert", onClose = {})
                CCDialogPanel(title = "Dialog", onDismiss = {}) {}
            }
        }
        val density = composeRule.density.density
        val floor = CCTouchTarget.minimum.value
        val showPassword = androidx.test.core.app.ApplicationProvider
            .getApplicationContext<android.content.Context>()
            .getString(R.string.cc_show_password)
        val nodes = composeRule.onAllNodes(hasClickAction()).fetchSemanticsNodes()
        assertTrue("found only ${nodes.size} clickables", nodes.size >= 14)
        val short = nodes.mapNotNull { node ->
            val width = node.size.width / density
            val height = node.size.height / density
            val name = node.config.getOrNull(androidx.compose.ui.semantics.SemanticsProperties.ContentDescription)?.joinToString()
                ?: node.config.getOrNull(androidx.compose.ui.semantics.SemanticsProperties.Text)?.joinToString()
                ?: node.config.getOrNull(androidx.compose.ui.semantics.SemanticsProperties.EditableText)?.text
            when {
                // The text field is focused by the field it sits in, not by
                // its own line of text.
                node.config.contains(SemanticsActions.SetText) -> null
                // The reveal button lives inside the 36dp field and cannot be
                // taller than it; it is 48 wide.
                name == showPassword -> if (width >= floor) null else "$name ${width}x$height"
                width >= floor && height >= floor -> null
                else -> "$name ${width}x$height"
            }
        }
        assertEquals("clickables under ${floor}dp", emptyList<String>(), short)
    }

    @Test
    fun loadingButtonSwallowsTheTap() {
        var clicks = 0
        composeRule.setContent { CCButton(title = "Save", onClick = { clicks++ }, loading = true) }
        composeRule.onRoot().performClick()
        assertEquals(0, clicks)
    }

    @Test
    fun checkboxTogglesAndAnnouncesItsState() {
        composeRule.setContent {
            var status by remember { mutableStateOf(CCCheckboxStatus.off) }
            CCCheckbox(label = "Agree", status = status, onChange = { status = it })
        }
        composeRule.onNodeWithContentDescription("Agree").assertIsOff().performClick()
        composeRule.onNodeWithContentDescription("Agree").assertIsOn()
    }

    @Test
    fun switchTogglesAndAnnouncesItsState() {
        composeRule.setContent {
            var on by remember { mutableStateOf(false) }
            CCSwitch(label = "Alerts", checked = on, onChange = { on = it })
        }
        composeRule.onNodeWithContentDescription("Alerts").assertIsOff().performClick()
        composeRule.onNodeWithContentDescription("Alerts").assertIsOn()
    }

    @Test
    fun radioSelectsExactlyOne() {
        var chosen: String? = null
        composeRule.setContent {
            var selection by remember { mutableStateOf<String?>(null) }
            CCRadioGroup(
                label = "Size",
                options = listOf(CCRadioOption("s", "Small"), CCRadioOption("l", "Large")),
                selection = selection,
                onSelectionChange = { selection = it; chosen = it },
            )
        }
        composeRule.onNodeWithContentDescription("Large").performClick()
        assertEquals("l", chosen)
        composeRule.onNodeWithContentDescription("Large").assertIsSelected()
    }

    @Test
    fun selectOpensAndPicksAnOption() {
        var chosen: String? = null
        composeRule.setContent {
            var selection by remember { mutableStateOf<String?>(null) }
            CCSelect(
                label = "Region",
                options = listOf(CCSelectOption("kr", "Korea"), CCSelectOption("jp", "Japan")),
                selection = selection,
                onSelectionChange = { selection = it; chosen = it },
            )
        }
        composeRule.onNodeWithText("Select").performClick()
        composeRule.onNodeWithText("Japan").assertExists().performClick()
        assertEquals("jp", chosen)
        composeRule.onNodeWithText("Japan").assertExists()
    }

    @Test
    fun dialogCloseAsksToDismiss() {
        var dismissed = false
        composeRule.setContent {
            CCDialogPanel(title = "Delete?", onDismiss = { dismissed = true }) {}
        }
        composeRule.onNodeWithContentDescription("Close").performClick()
        assertTrue(dismissed)
    }

    @Test
    // Nine 48dp targets are 432dp wide — wider than the default test screen, and
    // a tap on a target laid out past its edge lands on a neighbour. See the
    // width note on CCPagination.
    @Config(qualifiers = "w480dp-h800dp")
    fun paginationMovesAndTruncates() {
        var page = 3
        composeRule.setContent { CCPagination(page = page, totalPages = 10, onChange = { page = it }) }
        composeRule.onNodeWithContentDescription("Next page").performClick()
        assertEquals(4, page)
        composeRule.onNodeWithContentDescription("Page 10").performClick()
        assertEquals(10, page)
        // The web's window: `maxVisible` pages after the first, then the gap.
        assertEquals(listOf(1, 2, 3, 4, 5, null, 10), paginationSlots(3, 10, 5))
        assertEquals(listOf(1, null, 6, 7, 8, 9, 10), paginationSlots(8, 10, 5))
        assertEquals(listOf(1, 2, 3, 4, 5, 6, 7), paginationSlots(3, 7, 5))
    }

    @Test
    fun linkAndBreadcrumbCallBack() {
        var linked = 0
        var crumb: String? = null
        composeRule.setContent {
            // Stacked: two siblings at the root overlap, and the top one takes the tap.
            Column {
                CCLink(title = "Terms", onClick = { linked++ })
                CCBreadcrumb(items = listOf(CCBreadcrumbItem("h", "Home"), CCBreadcrumbItem("x", "Here")), onSelect = { crumb = it.id })
            }
        }
        composeRule.onNodeWithText("Terms").performClick()
        composeRule.onNodeWithText("Home").performClick()
        assertEquals(1, linked)
        assertEquals("h", crumb)
    }

    /**
     * Glass with a haze state composes and lays out. Robolectric has no
     * RenderEffect, so this cannot say the blur is drawn — the render tests
     * draw the solid fallback — only that providing a state does not break a
     * screen: the bar is there and its content is reachable.
     */
    @Test
    fun glassWithHazeStateStillLaysOut() {
        composeRule.setContent {
            val haze = remember { HazeState() }
            CompositionLocalProvider(LocalCocsoHazeState provides haze) {
                Column {
                    Box(Modifier.fillMaxWidth().height(200.dp).hazeSource(haze)) { CCTypography("Content") }
                    CCGlassBar { CCButton(title = "Tab", onClick = {}) }
                    CCCard(variant = CCCardVariant.glass) { CCTypography("Glass card") }
                }
            }
        }
        composeRule.onNodeWithText("Tab").assertExists()
        composeRule.onNodeWithText("Glass card").assertExists()
    }

    @Test
    fun pressableCallsOnClick() {
        var taps = 0
        composeRule.setContent { CCTypography("Row", modifier = Modifier.ccPressable { taps++ }) }
        composeRule.onNodeWithText("Row").performClick()
        assertEquals(1, taps)
    }

    /** The strings are resources, so a Korean device hears Korean. */
    @Test
    @Config(sdk = [34], qualifiers = "ko")
    fun switchSpeaksKorean() {
        composeRule.setContent { CCSwitch(label = "알림", checked = true, onChange = {}) }
        composeRule.onNodeWithContentDescription("알림").assertIsOn()
        composeRule.onNodeWithText("Select").assertDoesNotExist()
    }
}
