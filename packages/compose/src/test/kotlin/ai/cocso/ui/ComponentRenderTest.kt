package ai.cocso.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.ui.Modifier
import android.graphics.BitmapFactory
import androidx.compose.ui.platform.LocalView
import androidx.compose.runtime.SideEffect
import android.view.View
import android.graphics.Canvas
import android.graphics.Bitmap
import java.io.File
import androidx.compose.ui.test.junit4.createComposeRule
import androidx.compose.ui.test.onRoot
import androidx.compose.foundation.layout.Box
import androidx.compose.ui.unit.dp
import com.github.takahirom.roborazzi.captureRoboImage
import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Rule
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.RobolectricTestRunner
import org.robolectric.annotation.Config
import org.robolectric.annotation.GraphicsMode

/**
 * The views, drawn.
 *
 * Everything else about this package is checked without drawing anything: the
 * generators are compared to their sources, the two platforms are compared to
 * each other, and the Kotlin is compiled. A view that compiles and draws
 * nothing — or draws its label in the colour of its own background — passes all
 * of that. `cocso/mobile` has screenshot tests; the design system its
 * components come from had none.
 *
 * Each component is rendered in both themes. The golden images catch a change
 * in appearance; the ink assertion catches the case a golden cannot, which is
 * the first run of a component that was never visible in the first place.
 */
@RunWith(RobolectricTestRunner::class)
@GraphicsMode(GraphicsMode.Mode.NATIVE)
// 창이 내용보다 짧으면 아래쪽 컴포넌트가 잘린 채로 골든이 박힌다. 처음 기록한
// 이미지가 정확히 그랬고 — 체크박스·스위치·입력 셋이 빠져 있었다 — 눈으로 보지
// 않았으면 셋을 보지 않는 테스트를 통과시켰을 것이다.
@Config(sdk = [34], qualifiers = "w360dp-h3200dp")
class ComponentRenderTest {

    @get:Rule
    val composeRule = createComposeRule()

    private fun render(name: String, content: @Composable () -> Unit) {
        composeRule.setContent {
            Column(
                Modifier
                    .width(320.dp)
                    .background(CocsoTokens.Color.surfacePrimary())
                    .padding(16.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp),
            ) {
                content()
            }
        }
        composeRule.waitForIdle()
        val path = "src/test/screenshots/$name.png"
        composeRule.onRoot().captureRoboImage(path)
        assertHasInk(File(path))
    }

    /**
     * A component that draws nothing, or draws only its own background colour,
     * produces a single-colour image. That is the failure a golden cannot catch
     * on the run that records it.
     */
    private fun assertHasInk(file: File) {
        val image = BitmapFactory.decodeFile(file.path)
        val first = image.getPixel(0, 0)
        var different = 0
        for (y in 0 until image.height step 2) {
            for (x in 0 until image.width step 2) {
                if (image.getPixel(x, y) != first) {
                    different++
                }
            }
        }
        assertTrue("그려진 것이 없다 — 단색 이미지 ($file)", different > 20)

        // 마지막 컴포넌트 아래에 여백이 남아야 잘리지 않은 것이다. 바닥 줄이
        // 전부 배경색이면 내용이 창을 넘지 않았다는 뜻이다.
        val background = image.getPixel(0, 0)
        val bottom = (0 until image.width).count {
            image.getPixel(it, image.height - 1) != background
        }
        assertTrue("바닥이 잘렸다 — 창을 넘는 내용이 있다 ($file)", bottom == 0)
    }

    @Composable
    private fun everything() {
        CCTypography("Typography", type = CCTypographyType.heading, size = CCTypographySize.large)
        CCButton(title = "Button", onClick = {})
        // Variants whose only visible difference is a border. The primary
        // button hid a permanent hairline by being the same colour as it; the
        // outlined card had no edge at all. Neither showed in a golden that
        // drew only the defaults.
        CCButton(title = "Secondary", onClick = {}, variant = CCButtonVariant.secondary)
        CCButton(title = "Outline", onClick = {}, variant = CCButtonVariant.outline)
        CCButton(title = "Glass", onClick = {}, variant = CCButtonVariant.glass)
        // The see-through variants on a filled surface. On the page they look
        // right whatever they fill with, because the page is `surface-primary`
        // too — which is how Compose drew a white slab behind the outline and
        // error-ghost buttons and a grey outline badge without a golden moving.
        CCCard(variant = CCCardVariant.filled) {
            CCButton(title = "Outline on fill", onClick = {}, variant = CCButtonVariant.outline)
            CCButton(title = "Error ghost on fill", onClick = {}, variant = CCButtonVariant.errorGhost)
            CCBadge(text = "Outline badge", variant = CCBadgeVariant.outline)
        }
        // The spinner on the fill: a Material indicator in the system grey all
        // but vanished on the primary fill.
        CCButton(title = "Loading", onClick = {}, loading = true)
        CCBadge(text = "Badge")
        CCBadge(text = "Outline", variant = CCBadgeVariant.outline)
        CCCard { CCTypography("Card") }
        CCCard(variant = CCCardVariant.outlined) { CCTypography("Outlined card") }
        CCCard(variant = CCCardVariant.glass) { CCTypography("Glass card") }
        CCGlassBar { CCTypography("Glass bar") }
        CCAlert(title = "Alert", message = "message")
        CCAvatar(initials = "CO", label = "코쏘")
        CCSkeleton(modifier = Modifier.fillMaxWidth())
        CCSkeleton(modifier = Modifier.fillMaxWidth(), animation = CCSkeletonAnimation.wave)
        CCProgress(value = 60f)
        CCSpinner()
        // 상태가 있는 컴포넌트는 상태마다 그린다. 켠 스위치만 그리던 동안
        // 꺼진 손잡이의 테두리를 고쳐도 골든이 움직이지 않았다 — 렌더 게이트는
        // 그리는 것만큼만 본다.
        CCCheckbox(label = "Checkbox on", status = CCCheckboxStatus.on, onChange = {})
        CCCheckbox(label = "Checkbox off", status = CCCheckboxStatus.off, onChange = {})
        CCCheckbox(label = "Checkbox mixed", status = CCCheckboxStatus.intermediate, onChange = {})
        CCSwitch(label = "Switch on", checked = true, onChange = {})
        CCSwitch(label = "Switch off", checked = false, onChange = {})
        CCInput(label = "Input", value = "value", onValueChange = {}, placeholder = "placeholder")
        CCRadioGroup(
            label = "Radio",
            options = listOf(CCRadioOption("a", "A"), CCRadioOption("b", "B")),
            selection = "a",
            onSelectionChange = {},
        )
        CCSelect(label = "Select", options = listOf(CCSelectOption("a", "Option A")), selection = "a", onSelectionChange = {})
        // The panel alone: the presenting `CCDialog` opens a window Robolectric
        // does not capture through `onRoot`.
        CCDialogPanel(title = "Dialog", message = "message") { CCButton(title = "OK", onClick = {}) }
        CCLink(title = "Link", onClick = {})
        CCBreadcrumb(items = listOf(CCBreadcrumbItem("a", "Home"), CCBreadcrumbItem("b", "Here")), onSelect = {})
        CCPagination(page = 3, totalPages = 10, onChange = {})
        Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
            CCStockQuantityStatus(CCStockQuantityStatusQuantity.sufficient)
            CCStockQuantityStatus(CCStockQuantityStatusQuantity.normal)
            CCStockQuantityStatus(CCStockQuantityStatusQuantity.insufficient)
        }
    }

    @Test
    fun everyComponentDrawsInLightTheme() = render("components-light") { everything() }

    @Test
    @Config(sdk = [34], qualifiers = "w360dp-h3200dp-night")
    fun everyComponentDrawsInDarkTheme() = render("components-dark") { everything() }

    /**
     * A see-through variant shows the surface behind it.
     *
     * The outline and error-ghost buttons and the outline badge are transparent
     * on the web and on SwiftUI. Compose filled them — `surface-primary` behind
     * the buttons, `surface-secondary` behind the badge — and no golden moved:
     * on the page those fills are the page colour, and on a filled card the
     * difference sits inside Roborazzi's tolerance.
     *
     * So this does not go through a golden. A first attempt did, and passed with
     * the defect put back: in verify mode `captureRoboImage(path)` compares and
     * leaves `path` alone, so reading `path` read the committed image, not the
     * render. This draws the live view into a bitmap and compares two pixels of
     * that one render — inside each control, clear of its label and border,
     * against the surface beside it.
     */
    @Test
    fun seeThroughVariantsShowTheSurfaceBehindThem() {
        var host: View? = null
        composeRule.setContent {
            val view = LocalView.current
            SideEffect { host = view }
            Column(
                Modifier
                    .width(320.dp)
                    .background(CocsoTokens.Color.surfaceSecondary())
                    .padding(horizontal = 16.dp, vertical = 12.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp),
            ) {
                CCButton(title = "Outline", onClick = {}, variant = CCButtonVariant.outline)
                CCButton(title = "Ghost", onClick = {}, variant = CCButtonVariant.errorGhost)
                Box(Modifier.width(240.dp)) {
                    CCBadge(text = "Badge", variant = CCBadgeVariant.outline, modifier = Modifier.width(200.dp))
                }
            }
        }
        composeRule.waitForIdle()
        // The Compose view itself, not its root: the root is the window's decor,
        // with an action bar above the content that shifts every coordinate.
        val view = requireNotNull(host)
        val image = Bitmap.createBitmap(view.width, view.height, Bitmap.Config.ARGB_8888)
        view.draw(Canvas(image))

        val density = view.resources.displayMetrics.density
        fun px(dp: Float) = (dp * density).toInt()
        val surface = image.getPixel(px(4f), px(4f))
        // Each point: a column clear of the label, at the control's vertical centre.
        // Buttons are 36 tall with a centred label; the badge's label starts at
        // its left edge, so its point sits past the label, inside the badge.
        val points = listOf(
            Triple("outline button", 48f, 12f + 18f),
            Triple("error-ghost button", 48f, 12f + 36f + 12f + 18f),
            Triple("outline badge", 180f, 12f + 36f + 12f + 36f + 12f + 10f),
        )
        for ((name, x, y) in points) {
            val inside = image.getPixel(px(x), px(y))
            assertEquals(
                "$name fills its background instead of showing the surface: #%08X vs #%08X".format(inside, surface),
                surface,
                inside,
            )
        }
    }

    /**
     * The brand reaches the views. An overlay the views never read would leave
     * the app's own primary blue while every design-system view stayed black —
     * two primaries on one screen. The base default is black; under the cocso
     * brand the primary button's fill is the info blue, read back from pixels.
     */
    @Test
    fun brandRecoloursThePrimaryButton() {
        var host: View? = null
        composeRule.setContent {
            val view = LocalView.current
            SideEffect { host = view }
            CompositionLocalProvider(LocalCocsoBrand provides CocsoBrand.Cocso) {
                CCButton(title = "Brand", onClick = {}, modifier = Modifier.width(200.dp))
            }
        }
        composeRule.waitForIdle()
        // The golden still records the button, and its comparison is what
        // catches a large change in appearance.
        composeRule.onRoot().captureRoboImage("src/test/screenshots/button-brand-cocso.png")
        // The colour is read from the live render. This used to decode the
        // screenshot path after capturing, which in verify mode is the committed
        // image, not this run — the assertion held whatever the view drew.
        val view = requireNotNull(host)
        val image = Bitmap.createBitmap(view.width, view.height, Bitmap.Config.ARGB_8888)
        view.draw(Canvas(image))
        // A point inside the fill, away from the label.
        val px = image.getPixel(image.width / 8, image.height / 2)
        val r = (px shr 16) and 0xFF; val g = (px shr 8) and 0xFF; val b = px and 0xFF
        assertTrue("primary 가 파랑이 아니다: #%02X%02X%02X".format(r, g, b), b > 0xC0 && r < 0x60 && g in 0x50..0x90)
    }
}
