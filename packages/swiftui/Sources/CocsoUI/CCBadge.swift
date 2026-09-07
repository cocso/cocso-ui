import SwiftUI

/**
 A small status label.

 Values come from `CCBadgeStyle.resolve`, generated from `badge.recipe.ts`.
 */
public struct CCBadge: View {
    private let text: String
    private let variant: CCBadgeVariant
    private let size: CCBadgeSize
    private let shape: CCBadgeShape

    @Environment(\.colorScheme) private var colorScheme
    // The brand the app set at its root. Tokens and resolvers take it so a
    // design-system view draws the same primary the app does.
    @Environment(\.cocsoBrand) private var brand

    public init(
        _ text: String,
        variant: CCBadgeVariant = .primary,
        size: CCBadgeSize = .medium,
        shape: CCBadgeShape = .square
    ) {
        self.text = text
        self.variant = variant
        self.size = size
        self.shape = shape
    }

    public var body: some View {
        let style = CCBadgeStyle.resolve(
            variant: variant,
            size: size,
            shape: shape,
            scheme: colorScheme, brand: brand
        )
        Text(text)
            .font(.system(size: style.fontSize ?? 12, weight: .semibold))
            .foregroundStyle(style.fontColor ?? CocsoTokens.Color.textPrimary(colorScheme, brand: brand))
            .padding(.horizontal, style.paddingX ?? 0)
            .padding(.vertical, style.paddingY ?? 0)
            .background(style.bgColor ?? .clear)
            // A percentage radius has no length to travel as, so the recipe
            // sends `borderRadiusFull` and a capsule is what it means here.
            .clipShape(
                style.borderRadiusFull == true
                    ? AnyShape(Capsule())
                    : AnyShape(RoundedRectangle(cornerRadius: style.borderRadius ?? 0))
            )
            // The recipe's border — the outline variant.
            .overlay(recipeBorder(style))
    }

    /// `AnyShape` is not `InsettableShape`, so `strokeBorder` has to be called on
    /// the concrete shape. Nothing when the variant has no border.
    @ViewBuilder
    private func recipeBorder(_ style: CCBadgeStyle) -> some View {
        if let color = style.borderColor {
            if style.borderRadiusFull == true {
                Capsule().strokeBorder(color, lineWidth: style.borderWidth ?? 1)
            } else {
                RoundedRectangle(cornerRadius: style.borderRadius ?? 0)
                    .strokeBorder(color, lineWidth: style.borderWidth ?? 1)
            }
        }
    }
}

#if DEBUG
#Preview {
    HStack {
        CCBadge("Primary")
        CCBadge("Success", variant: .success)
        CCBadge("Error", variant: .error)
        CCBadge("Pill", shape: .circle)
    }
    .padding()
}
#endif
