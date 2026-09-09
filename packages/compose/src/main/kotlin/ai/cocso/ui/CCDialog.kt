package ai.cocso.ui

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.core.FiniteAnimationSpec
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.scaleIn
import androidx.compose.animation.scaleOut
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ColumnScope
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Close
import androidx.compose.material3.Icon
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.platform.LocalView
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.unit.dp
import androidx.compose.ui.window.Dialog
import androidx.compose.ui.window.DialogProperties
import androidx.compose.ui.window.DialogWindowProvider

/**
 * The panel of a modal dialog.
 *
 * Values come from [cCDialogStyle], generated from `dialog.recipe.ts`; the
 * shadow is the web's `shadow-dialog`. Use [CCDialog] to present it over a
 * scrim; this is the panel alone, for a screen that lays it out itself.
 */
@Composable
fun CCDialogPanel(
    title: String,
    modifier: Modifier = Modifier,
    message: String? = null,
    size: CCDialogSize = CCDialogSize.medium,
    onDismiss: (() -> Unit)? = null,
    actions: @Composable ColumnScope.() -> Unit,
) {
    val style = cCDialogStyle(size = size)
    val shape = RoundedCornerShape(style.borderRadius ?: 0.dp)
    val interactionSource = remember { MutableInteractionSource() }

    Column(
        modifier = modifier
            // The recipe's width is a maximum — the web's `max-width`.
            .widthIn(max = style.width ?: 520.dp)
            .ccShadow(CocsoTokens.Shadow.dialog(), shape)
            .clip(shape)
            .background(style.bgColor ?: CocsoTokens.Color.surfacePrimary())
            .border(
                style.borderWidth ?: 1.dp,
                style.borderColor ?: CocsoTokens.Color.borderSecondary(),
                shape,
            )
            .padding(
                top = style.paddingTop ?: 0.dp,
                bottom = style.paddingBottom ?: 0.dp,
                start = style.paddingLeft ?: 0.dp,
                end = style.paddingRight ?: 0.dp,
            )
            .semantics { contentDescription = title },
        verticalArrangement = Arrangement.spacedBy(CocsoTokens.Spacing.s7),
    ) {
        Row(verticalAlignment = Alignment.Top) {
            CCTypography(title, type = CCTypographyType.heading, size = CCTypographySize.small)
            Spacer(Modifier.weight(1f))
            if (onDismiss != null) {
                // The web's `DialogClose`: a 14dp cross, named for a screen reader.
                Icon(
                    imageVector = Icons.Filled.Close,
                    contentDescription = CCStrings.close(),
                    tint = CocsoTokens.Color.textSecondary(),
                    modifier = Modifier
                        .ccPressFeedback(interactionSource)
                        .clickable(
                            interactionSource = interactionSource,
                            indication = null,
                            role = Role.Button,
                            onClick = onDismiss,
                        )
                        .ccMinimumTouchTarget(),
                )
            }
        }
        if (message != null) {
            CCTypography(message, type = CCTypographyType.body, size = CCTypographySize.medium)
        }
        actions()
    }
}

/**
 * A modal dialog over a scrim.
 *
 * The scrim is the web's `black-alpha-30` — a raw alpha on purpose, a scrim
 * stays black in both themes — drawn here rather than by the window, whose own
 * dim is turned off so the two do not stack. A tap on the scrim dismisses, and
 * the panel arrives on the entrance curve the way the web's `content-show` does.
 */
@Composable
fun CCDialog(
    title: String,
    onDismissRequest: () -> Unit,
    message: String? = null,
    size: CCDialogSize = CCDialogSize.medium,
    actions: @Composable ColumnScope.() -> Unit,
) {
    val fade: FiniteAnimationSpec<Float> = CCMotion.entrance()
    val interactionSource = remember { MutableInteractionSource() }
    var shown by remember { mutableStateOf(false) }
    LaunchedEffect(Unit) { shown = true }

    Dialog(
        onDismissRequest = onDismissRequest,
        properties = DialogProperties(usePlatformDefaultWidth = false, decorFitsSystemWindows = false),
    ) {
        // The window's own dim would sit under our scrim; one scrim, the web's.
        (LocalView.current.parent as? DialogWindowProvider)?.window?.setDimAmount(0f)
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(CocsoTokens.Color.blackAlpha30)
                .clickable(
                    interactionSource = interactionSource,
                    indication = null,
                    onClick = onDismissRequest,
                )
                .padding(CocsoTokens.Spacing.s9),
            contentAlignment = Alignment.Center,
        ) {
            AnimatedVisibility(
                visible = shown,
                enter = fadeIn(fade) + scaleIn(fade, initialScale = 0.98f),
                exit = fadeOut(fade) + scaleOut(fade, targetScale = 0.98f),
            ) {
                CCDialogPanel(
                    title = title,
                    message = message,
                    size = size,
                    onDismiss = onDismissRequest,
                    // A tap on the panel is not a tap on the scrim.
                    modifier = Modifier
                        .fillMaxWidth()
                        .clickable(interactionSource = interactionSource, indication = null) {},
                    actions = actions,
                )
            }
        }
    }
}
