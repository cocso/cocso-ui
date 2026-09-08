import SwiftUI

/// One crumb. The last one in a `CCBreadcrumb` is where the user is and has no action.
public struct CCBreadcrumbItem: Identifiable, Equatable, Sendable {
    public let id: String
    public let title: String

    public init(id: String, title: String) {
        self.id = id
        self.title = title
    }
}

/**
 Where the user is, and the way back.

 Values come from `CCBreadcrumbStyle.resolve`, generated from
 `breadcrumb.recipe.ts`. Every crumb but the last is a link in the recipe's
 `text-secondary`; the last is the current place, in `text-primary` at medium
 weight, as the web's `:last-child` draws it. Separators are `text-tertiary`
 chevrons — decoration, below AA on purpose and hidden from a screen reader.
 */
public struct CCBreadcrumb: View {
    private let items: [CCBreadcrumbItem]
    private let size: CCBreadcrumbSize
    private let onSelect: (CCBreadcrumbItem) -> Void

    @Environment(\.colorScheme) private var colorScheme
    // The brand the app set at its root. Tokens and resolvers take it so a
    // design-system view draws the same primary the app does.
    @Environment(\.cocsoBrand) private var brand

    public init(
        items: [CCBreadcrumbItem],
        size: CCBreadcrumbSize = .md,
        onSelect: @escaping (CCBreadcrumbItem) -> Void
    ) {
        self.items = items
        self.size = size
        self.onSelect = onSelect
    }

    public var body: some View {
        let style = CCBreadcrumbStyle.resolve(size: size, scheme: colorScheme, brand: brand)
        let fontSize = style.fontSize ?? 14
        HStack(spacing: CocsoTokens.Spacing.s2) {
            ForEach(Array(items.enumerated()), id: \.element.id) { index, item in
                if index == items.count - 1 {
                    Text(item.title)
                        .font(.system(size: fontSize, weight: .medium))
                        .foregroundStyle(CocsoTokens.Color.textPrimary(colorScheme, brand: brand))
                } else {
                    Button(action: { onSelect(item) }) {
                        Text(item.title)
                            .font(.system(size: fontSize))
                            .foregroundStyle(style.fontColor ?? CocsoTokens.Color.textSecondary(colorScheme, brand: brand))
                            .ccMinimumTouchTarget()
                    }
                    .buttonStyle(.plain)
                    .accessibilityAddTraits(.isLink)
                    Image(systemName: "chevron.right")
                        .font(.system(size: fontSize * 0.75, weight: .medium))
                        .foregroundStyle(CocsoTokens.Color.textTertiary(colorScheme, brand: brand))
                        .accessibilityHidden(true)
                }
            }
        }
        .accessibilityElement(children: .contain)
        .accessibilityLabel(CCStrings.breadcrumb)
    }
}
