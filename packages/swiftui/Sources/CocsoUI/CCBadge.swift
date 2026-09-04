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
            scheme: colorScheme
        )
        Text(text)
            .font(.system(size: style.fontSize ?? 12, weight: .semibold))
            .foregroundStyle(style.fontColor ?? CocsoTokens.Color.textPrimary(colorScheme))
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
