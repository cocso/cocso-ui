package ai.cocso.ui

import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color as ComposeColor
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.sp

/** Text at a role from the type scale. Values come from `typography.recipe.ts`. */
@Composable
fun CCTypography(
    text: String,
    modifier: Modifier = Modifier,
    type: CCTypographyType = CCTypographyType.body,
    size: CCTypographySize = CCTypographySize.medium,
    // The web's `color` prop; `null` is the default ink.
    color: ComposeColor? = null,
) {
    val style = cCTypographyStyle(type = type, size = size)
    Text(
        text = text,
        modifier = modifier,
        // 웹은 `color: inherit` 이고, 페이지 루트가 색을 정해 주기 때문에 그것이
        // 동작한다. Compose 에는 그 루트가 없어 `LocalContentColor` 의 기본값인
        // 순수 검정으로 떨어지고, 다크 배경 위 검정 글자가 된다 — 렌더 테스트가
        // 1.14:1 로 잡았다. 카스케이드 루트가 없는 곳에서 `inherit` 을 흉내내는
        // 것은 색을 정하지 않는 것이 아니라 잘못 정하는 것이다.
        color = color ?: CocsoTokens.Color.textPrimary(),
        fontSize = (style.fontSize?.value ?: 14f).sp,
        fontWeight = style.fontWeight ?: FontWeight.Normal,
    )
}
