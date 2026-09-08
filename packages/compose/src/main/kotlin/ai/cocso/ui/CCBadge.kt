package ai.cocso.ui

import androidx.compose.animation.AnimatedContent
import androidx.compose.animation.animateColorAsState
import androidx.compose.animation.core.FiniteAnimationSpec
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.slideInVertically
import androidx.compose.animation.slideOutVertically
import androidx.compose.animation.togetherWith
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color as ComposeColor
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.IntOffset
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

/**
 * A small status label.
 *
 * Values come from [cCBadgeStyle], generated from `badge.recipe.ts`.
 */
@Composable
fun CCBadge(
    text: String,
    modifier: Modifier = Modifier,
    variant: CCBadgeVariant = CCBadgeVariant.primary,
    size: CCBadgeSize = CCBadgeSize.medium,
    shape: CCBadgeShape = CCBadgeShape.square,
) {
    val style = cCBadgeStyle(variant = variant, size = size, shape = shape)
    // A percentage radius has no length to travel as, so the recipe sends
    // `borderRadiusFull` and a fully rounded corner is what it means here.
    val badgeShape = if (style.borderRadiusFull == true) {
        CircleShape
    } else {
        RoundedCornerShape(style.borderRadius ?: 0.dp)
    }

    // A variant that changes recolours on the web's colour curve.
    val fill by animateColorAsState(
        style.bgColor ?: CocsoTokens.Color.surfaceSecondary(),
        animationSpec = CCMotion.colour(),
        label = "badge-fill",
    )
    val edge by animateColorAsState(
        style.borderColor ?: ComposeColor.Transparent,
        animationSpec = CCMotion.colour(),
        label = "badge-border",
    )
    val ink by animateColorAsState(
        style.fontColor ?: CocsoTokens.Color.textPrimary(),
        animationSpec = CCMotion.colour(),
        label = "badge-text",
    )

    val slide: FiniteAnimationSpec<IntOffset> = CCMotion.colour()
    val fade: FiniteAnimationSpec<Float> = CCMotion.colour()

    // A count that changes rolls its text up — the counterpart of SwiftUI's
    // `numericText` transition.
    AnimatedContent(
        targetState = text,
        modifier = modifier
            .clip(badgeShape)
            .background(fill)
            // The recipe's border — the outline variant. Animated to
            // transparent rather than removed, so a variant change fades it.
            .border(style.borderWidth ?: 1.dp, edge, badgeShape)
            .padding(
                horizontal = style.paddingX ?: 0.dp,
                vertical = style.paddingY ?: 0.dp,
            ),
        transitionSpec = {
            (slideInVertically(slide) { it / 2 } + fadeIn(fade))
                .togetherWith(slideOutVertically(slide) { -it / 2 } + fadeOut(fade))
        },
        label = "badge-text",
    ) { shown ->
        Text(
            text = shown,
            color = ink,
            fontSize = (style.fontSize?.value ?: 12f).sp,
            fontWeight = FontWeight.SemiBold,
        )
    }
}
