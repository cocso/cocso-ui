package ai.cocso.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.ui.Modifier
import android.graphics.BitmapFactory
import java.io.File
import androidx.compose.ui.test.junit4.createComposeRule
import androidx.compose.ui.test.onRoot
import androidx.compose.ui.unit.dp
import com.github.takahirom.roborazzi.captureRoboImage
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
@Config(sdk = [34], qualifiers = "w360dp-h2200dp")
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
    }

    @Test
    fun everyComponentDrawsInLightTheme() = render("components-light") { everything() }

    @Test
    @Config(sdk = [34], qualifiers = "w360dp-h2200dp-night")
    fun everyComponentDrawsInDarkTheme() = render("components-dark") { everything() }

    /**
     * The brand reaches the views. An overlay the views never read would leave
     * the app's own primary blue while every design-system view stayed black —
     * two primaries on one screen. The base default is black; under the cocso
     * brand the primary button's fill is the info blue, read back from pixels.
     */
    @Test
    fun brandRecoloursThePrimaryButton() {
        composeRule.setContent {
            CompositionLocalProvider(LocalCocsoBrand provides CocsoBrand.Cocso) {
                CCButton(title = "Brand", onClick = {}, modifier = Modifier.width(200.dp))
            }
        }
        composeRule.waitForIdle()
        val path = "src/test/screenshots/button-brand-cocso.png"
        composeRule.onRoot().captureRoboImage(path)
        val image = BitmapFactory.decodeFile(path)
        // A point inside the fill, away from the label.
        val px = image.getPixel(image.width / 8, image.height / 2)
        val r = (px shr 16) and 0xFF; val g = (px shr 8) and 0xFF; val b = px and 0xFF
        assertTrue("primary 가 파랑이 아니다: #%02X%02X%02X".format(r, g, b), b > 0xC0 && r < 0x60 && g in 0x50..0x90)
    }
}
