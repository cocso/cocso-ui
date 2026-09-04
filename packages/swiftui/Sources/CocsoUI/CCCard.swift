import SwiftUI

/**
 A surface that groups content.

 Values come from `CCCardStyle.resolve`, generated from `card.recipe.ts`.
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

    public var body: some View {
        let style = CCCardStyle.resolve(
            variant: variant,
            padding: padding,
            scheme: colorScheme
        )
        content
            // The recipe's 12/16/24. Picking these from the spacing scale by
            // hand gave 8/12/20 — every card was tighter than the web's.
            .padding(.horizontal, style.paddingX ?? 0)
            .padding(.vertical, style.paddingY ?? 0)
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
