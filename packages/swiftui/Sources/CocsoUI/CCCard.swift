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
    // The brand the app set at its root. Tokens and resolvers take it so a
    // design-system view draws the same primary the app does.
    @Environment(\.cocsoBrand) private var brand

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
            scheme: colorScheme, brand: brand
        )
        content
            // The recipe's 12/16/24. Picking these from the spacing scale by
            // hand gave 8/12/20 — every card was tighter than the web's.
            .padding(.horizontal, style.paddingX ?? 0)
            .padding(.vertical, style.paddingY ?? 0)
            .background(style.bgColor ?? CocsoTokens.Color.surfacePrimary(colorScheme, brand: brand))
            // Glass: the recipe's tint (`surface-glass`) sits on the platform's
            // blur, which is the one part of glass that is not a value — see
            // `ccGlass`. The other variants put nothing under their fill.
            .background(
                variant == .glass ? AnyShapeStyle(.ultraThinMaterial) : AnyShapeStyle(.clear),
                in: RoundedRectangle(cornerRadius: style.borderRadius ?? 0)
            )
            .clipShape(RoundedRectangle(cornerRadius: style.borderRadius ?? 0))
            // The recipe's border — the outlined variant. Without it a white card
            // on a white surface had no edge at all.
            .overlay(
                style.borderColor.map { color in
                    RoundedRectangle(cornerRadius: style.borderRadius ?? 0)
                        .strokeBorder(color, lineWidth: style.borderWidth ?? 1)
                }
            )
    }
}

#if DEBUG
#Preview {
    VStack {
        CCCard { Text("Elevated") }
        CCCard(variant: .outlined) { Text("Outlined") }
        CCCard(variant: .glass) { Text("Glass") }
    }
    .padding()
    .background(LinearGradient(colors: [.blue, .green], startPoint: .topLeading, endPoint: .bottomTrailing))
}
#endif
