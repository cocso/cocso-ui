package ai.cocso.ui

import androidx.compose.runtime.Composable
import androidx.compose.runtime.ReadOnlyComposable
import androidx.compose.ui.res.stringResource

/**
 * The words the views speak, in the user's language.
 *
 * A screen reader read "On", "Off", "Loading" and "Show password" in English
 * to a Korean user, because the views wrote them as literals. These are the
 * module's string resources (English and Korean shipped), so an app adds a
 * language by adding a `values-xx` folder, and a view never carries a word.
 */
object CCStrings {
    @Composable @ReadOnlyComposable fun loading(): String = stringResource(R.string.cc_loading)
    @Composable @ReadOnlyComposable fun progress(): String = stringResource(R.string.cc_progress)
    @Composable @ReadOnlyComposable fun on(): String = stringResource(R.string.cc_on)
    @Composable @ReadOnlyComposable fun off(): String = stringResource(R.string.cc_off)
    @Composable @ReadOnlyComposable fun mixed(): String = stringResource(R.string.cc_mixed)
    @Composable @ReadOnlyComposable fun showPassword(): String = stringResource(R.string.cc_show_password)
    @Composable @ReadOnlyComposable fun hidePassword(): String = stringResource(R.string.cc_hide_password)
    @Composable @ReadOnlyComposable fun close(): String = stringResource(R.string.cc_close)
    @Composable @ReadOnlyComposable fun select(): String = stringResource(R.string.cc_select)
    @Composable @ReadOnlyComposable fun pagination(): String = stringResource(R.string.cc_pagination)
    @Composable @ReadOnlyComposable fun previousPage(): String = stringResource(R.string.cc_previous_page)
    @Composable @ReadOnlyComposable fun nextPage(): String = stringResource(R.string.cc_next_page)
    @Composable @ReadOnlyComposable fun breadcrumb(): String = stringResource(R.string.cc_breadcrumb)
    @Composable @ReadOnlyComposable fun stockSufficient(): String = stringResource(R.string.cc_stock_sufficient)
    @Composable @ReadOnlyComposable fun stockNormal(): String = stringResource(R.string.cc_stock_normal)
    @Composable @ReadOnlyComposable fun stockInsufficient(): String = stringResource(R.string.cc_stock_insufficient)
    /** "Page 3" — the number placed where the language puts it. */
    @Composable @ReadOnlyComposable fun page(number: Int): String = stringResource(R.string.cc_page, number)
}
