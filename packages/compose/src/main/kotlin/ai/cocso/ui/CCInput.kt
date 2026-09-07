package ai.cocso.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Visibility
import androidx.compose.material.icons.filled.VisibilityOff
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.clip
import androidx.compose.ui.focus.onFocusChanged
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

/** A single-line text field. */
@Composable
fun CCInput(
    label: String,
    value: String,
    onValueChange: (String) -> Unit,
    modifier: Modifier = Modifier,
    placeholder: String = "",
    size: CCInputSize = CCInputSize.medium,
    isSecure: Boolean = false,
    errorMessage: String? = null,
    enabled: Boolean = true,
) {
    val style = cCInputStyle(size = size)
    val shape = RoundedCornerShape(style.borderRadius ?: 4.dp)
    val fontSize = (style.fontSize?.value ?: 14f).sp
    var revealed by remember { mutableStateOf(false) }
    // 웹의 `.input:focus-visible` — 쉬는 테두리와 다른 토큰이어야 포커스가
    // 보인다(2.4.7). 쉬는 상태는 이제 `border-strong` 이다.
    var isFocused by remember { mutableStateOf(false) }
    val interactionSource = remember { MutableInteractionSource() }

    Column(
        modifier = modifier.alpha(if (enabled) 1f else 0.4f),
        verticalArrangement = Arrangement.spacedBy(CocsoTokens.Spacing.s3),
    ) {
        CCTypography(label, type = CCTypographyType.body, size = CCTypographySize.small)
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .height(style.height ?: 36.dp)
                .clip(shape)
                .background(CocsoTokens.Color.surfacePrimary())
                .border(
                    if (isFocused) 2.dp else 1.dp,
                    // 웹의 순서: 오류가 먼저, 그다음 포커스, 그다음 쉬는 상태.
                    when {
                        errorMessage != null -> CocsoTokens.Color.feedbackDanger()
                        isFocused -> CocsoTokens.Color.focusRing()
                        else -> style.borderColor ?: CocsoTokens.Color.borderStrong()
                    },
                    shape,
                )
                .padding(horizontal = style.paddingX ?: 12.dp),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Box(modifier = Modifier.weight(1f), contentAlignment = Alignment.CenterStart) {
                if (value.isEmpty() && placeholder.isNotEmpty()) {
                    Text(
                        text = placeholder,
                        // 웹의 `.input::placeholder` 와 같은 토큰.
                        color = CocsoTokens.Color.textSecondary(),
                        fontSize = fontSize,
                    )
                }
                BasicTextField(
                    value = value,
                    onValueChange = onValueChange,
                    enabled = enabled,
                    singleLine = true,
                    modifier = Modifier
                        .fillMaxWidth()
                        .onFocusChanged { isFocused = it.isFocused },
                    textStyle = TextStyle(
                        color = CocsoTokens.Color.textPrimary(),
                        fontSize = fontSize,
                    ),
                    // Toggled rather than overlaid, so the system's password
                    // autofill keeps working either way.
                    visualTransformation = if (isSecure && !revealed) {
                        PasswordVisualTransformation()
                    } else {
                        VisualTransformation.None
                    },
                )
            }
            if (isSecure) {
                Icon(
                    imageVector = if (revealed) Icons.Filled.VisibilityOff else Icons.Filled.Visibility,
                    contentDescription = if (revealed) "Hide password" else "Show password",
                    // One step back from the value, and it clears AA in both
                    // themes; `text-tertiary` is 3.08:1 on white.
                    tint = CocsoTokens.Color.textSecondary(),
                    modifier = Modifier
                        .clickable(
                            interactionSource = interactionSource,
                            indication = null,
                            onClick = { revealed = !revealed },
                        )
                        .ccMinimumTouchTarget(),
                )
            }
        }
        if (errorMessage != null) {
            // The text level, not the fill level: `feedback-danger` is 4.18:1
            // on a card in the light theme.
            Text(
                text = errorMessage,
                color = CocsoTokens.Color.feedbackDangerText(),
                fontSize = 12.sp,
            )
        }
    }
}
