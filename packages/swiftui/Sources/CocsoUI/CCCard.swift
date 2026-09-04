import SwiftUI

/**
 A surface that groups content.

 Values come from `CCCardStyle.resolve`, generated from `card.recipe.ts`. The
 recipe's `padding` dimension is CSS shorthand, which does not cross as a
 length, so the inset is taken from the spacing scale here and named as such.
 */
public struct CCCard<Content: View>: View {
    private let variant: CCCardVariant
    private let padding: CCCardPadding
    private let content: Content

    @Environment(\.colorScheme) private var colorScheme

    public init(
        variant: CCCardVariant = .elevated,
        padding: CCCardPadding = .md,
        @ViewBuilder content: () -> Content
    ) {
        self.variant = variant
        self.padding = padding
        self.content = content()
    }

    private var inset: CGFloat {
        switch padding {
        case .sm: return CocsoTokens.Spacing.s5
        case .md: return CocsoTokens.Spacing.s7
        case .lg: return CocsoTokens.Spacing.s9
        }
    }

    public var body: some View {
        let style = CCCardStyle.resolve(
            variant: variant,
            padding: padding,
            scheme: colorScheme
        )
        content
            .padding(inset)
            .background(style.bgColor ?? CocsoTokens.Color.surfacePrimary(colorScheme))
            .clipShape(RoundedRectangle(cornerRadius: style.borderRadius ?? 0))
    }
}

#if DEBUG
#Preview {
    VStack {
        CCCard { Text("Elevated") }
        CCCard(variant: .outlined) { Text("Outlined") }
    }
    .padding()
}
#endif
