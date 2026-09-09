import SwiftUI

/**
 Page navigation: previous and next, and a truncated run of page numbers.

 Values come from `CCPaginationStyle.resolve`, generated from
 `pagination.recipe.ts`: a 32-point square per page, the active one filled.
 The truncation is the web's — first and last always shown, `maxVisible`
 around the current page, an ellipsis where pages are skipped.
 */
public struct CCPagination: View {
    private let page: Int
    private let totalPages: Int
    private let maxVisible: Int
    private let onChange: (Int) -> Void

    @Environment(\.colorScheme) private var colorScheme
    // The brand the app set at its root. Tokens and resolvers take it so a
    // design-system view draws the same primary the app does.
    @Environment(\.cocsoBrand) private var brand
    @Environment(\.accessibilityReduceMotion) private var reduceMotion
    // The web draws `.arrow:focus-visible, .item:focus-visible`; these drew
    // nothing. One binding per control, keyed by the page it belongs to.
    @FocusState private var focused: Focusable?

    private enum Focusable: Hashable {
        case previous, next, page(Int)
    }

    public init(page: Int, totalPages: Int, maxVisible: Int = 5, onChange: @escaping (Int) -> Void) {
        self.page = page
        self.totalPages = totalPages
        self.maxVisible = maxVisible
        self.onChange = onChange
    }

    /// The web's range: every page when they fit, otherwise the ends and a
    /// window around the current page, `nil` where an ellipsis goes.
    private var slots: [Int?] {
        if totalPages <= maxVisible + 2 {
            return Array(1...max(totalPages, 1))
        }
        let half = Int((Double(maxVisible) / 2).rounded(.up))
        var out: [Int?] = [1]
        if page > 1 + half { out.append(nil) }
        for index in 0..<maxVisible {
            let number = page - half + index + 1
            if number > 1 && number < totalPages { out.append(number) }
        }
        if page < totalPages - half { out.append(nil) }
        out.append(totalPages)
        return out
    }

    /// `slots`, for the tests — the range logic is the part worth pinning.
    var slotsForTesting: [Int?] { slots }

    public var body: some View {
        HStack(spacing: CocsoTokens.Spacing.s3) {
            if totalPages > 1 {
                arrow("chevron.left", label: CCStrings.previousPage, enabled: page > 1, focus: .previous) { onChange(page - 1) }
            }
            ForEach(Array(slots.enumerated()), id: \.offset) { _, slot in
                if let number = slot {
                    pageButton(number)
                } else {
                    Image(systemName: "ellipsis")
                        .foregroundStyle(CocsoTokens.Color.textSecondary(colorScheme, brand: brand))
                        .frame(width: 32, height: 32)
                        .accessibilityHidden(true)
                }
            }
            if totalPages > 1 {
                arrow("chevron.right", label: CCStrings.nextPage, enabled: page < totalPages, focus: .next) { onChange(page + 1) }
            }
        }
        .animation(CCMotion.colour(reduced: reduceMotion), value: page)
        .accessibilityElement(children: .contain)
        .accessibilityLabel(CCStrings.pagination)
    }

    @ViewBuilder
    private func pageButton(_ number: Int) -> some View {
        let style = CCPaginationStyle.resolve(
            pageState: number == page ? CCPaginationPageState.active : CCPaginationPageState.inactive,
            scheme: colorScheme, brand: brand
        )
        Button(action: { onChange(number) }) {
            Text("\(number)")
                .font(.system(size: style.fontSize ?? 14, weight: style.fontWeight ?? .regular))
                .foregroundStyle(style.fontColor ?? CocsoTokens.Color.textPrimary(colorScheme, brand: brand))
                .frame(width: style.width ?? 32, height: style.height ?? 32)
                .background(style.bgColor ?? .clear)
                .clipShape(RoundedRectangle(cornerRadius: style.borderRadius ?? 8))
                .ccFocusRing(focused == .page(number), in: RoundedRectangle(cornerRadius: style.borderRadius ?? 8))
                .ccMinimumTouchTarget()
        }
        .buttonStyle(CCPressStyle())
        .focused($focused, equals: .page(number))
        .accessibilityLabel(CCStrings.page(number))
        .accessibilityAddTraits(number == page ? [.isButton, .isSelected] : .isButton)
    }

    @ViewBuilder
    private func arrow(
        _ glyph: String,
        label: String,
        enabled: Bool,
        focus: Focusable,
        action: @escaping () -> Void
    ) -> some View {
        let style = CCPaginationStyle.resolve(pageState: enabled ? .inactive : .disabled, scheme: colorScheme, brand: brand)
        Button(action: action) {
            Image(systemName: glyph)
                .font(.system(size: style.fontSize ?? 14, weight: .medium))
                .foregroundStyle(style.fontColor ?? CocsoTokens.Color.textPrimary(colorScheme, brand: brand))
                .frame(width: style.width ?? 32, height: style.height ?? 32)
                .ccFocusRing(focused == focus, in: RoundedRectangle(cornerRadius: style.borderRadius ?? 8))
                .ccMinimumTouchTarget()
        }
        .buttonStyle(CCPressStyle())
        .focused($focused, equals: focus)
        .disabled(!enabled)
        .accessibilityLabel(label)
    }
}
