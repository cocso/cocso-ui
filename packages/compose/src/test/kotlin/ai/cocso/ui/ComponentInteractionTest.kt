package ai.cocso.ui

import androidx.compose.foundation.layout.Column
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.test.assertIsOff
import androidx.compose.ui.test.assertIsOn
import androidx.compose.ui.test.assertIsSelected
import androidx.compose.ui.test.junit4.createComposeRule
import androidx.compose.ui.test.onNodeWithContentDescription
import androidx.compose.ui.test.onNodeWithText
import androidx.compose.ui.test.onRoot
import androidx.compose.ui.test.performClick
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

    /** The strings are resources, so a Korean device hears Korean. */
    @Test
    @Config(sdk = [34], qualifiers = "ko")
    fun switchSpeaksKorean() {
        composeRule.setContent { CCSwitch(label = "알림", checked = true, onChange = {}) }
        composeRule.onNodeWithContentDescription("알림").assertIsOn()
        composeRule.onNodeWithText("Select").assertDoesNotExist()
    }
}
