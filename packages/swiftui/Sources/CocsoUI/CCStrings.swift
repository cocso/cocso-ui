import Foundation

/**
 The words the views speak, in the user's language.

 A screen reader read "On", "Off", "Mixed", "Loading" and "Show password" in
 English to a Korean user, because the views wrote them as literals. These are
 keys into the package's `Localizable.strings` (English and Korean shipped), so
 an app adds a language by adding a table, and a view never carries a word.
 */
public enum CCStrings {
    public static var loading: String { localized("cc.loading") }
    public static var progress: String { localized("cc.progress") }
    public static var on: String { localized("cc.on") }
    public static var off: String { localized("cc.off") }
    public static var mixed: String { localized("cc.mixed") }
    public static var showPassword: String { localized("cc.showPassword") }
    public static var hidePassword: String { localized("cc.hidePassword") }
    public static var close: String { localized("cc.close") }
    public static var select: String { localized("cc.select") }
    public static var pagination: String { localized("cc.pagination") }
    public static var previousPage: String { localized("cc.previousPage") }
    public static var nextPage: String { localized("cc.nextPage") }
    public static var breadcrumb: String { localized("cc.breadcrumb") }
    public static var stockSufficient: String { localized("cc.stockSufficient") }
    public static var stockNormal: String { localized("cc.stockNormal") }
    public static var stockInsufficient: String { localized("cc.stockInsufficient") }
    /// "Page 3" — the number placed where the language puts it.
    public static func page(_ number: Int) -> String {
        String(format: localized("cc.page"), locale: .current, Int64(number))
    }

    private static func localized(_ key: String) -> String {
        NSLocalizedString(key, bundle: .module, comment: "")
    }
}
