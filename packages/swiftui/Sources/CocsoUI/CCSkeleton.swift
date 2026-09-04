import SwiftUI

/// A placeholder while content loads.
public struct CCSkeleton: View {
    private let variant: CCSkeletonVariant
    private let animation: CCSkeletonAnimation

    @Environment(\.colorScheme) private var colorScheme
    @Environment(\.accessibilityReduceMotion) private var reduceMotion
    @State private var pulsing = false

    public init(
        variant: CCSkeletonVariant = .text,
        animation: CCSkeletonAnimation = .pulse
    ) {
        self.variant = variant
        self.animation = animation
    }

    public var body: some View {
        let style = CCSkeletonStyle.resolve(
            variant: variant,
            animation: animation,
            scheme: colorScheme
        )
        // Motion here is decoration, and the web stops it under
        // `prefers-reduced-motion`; this is the same setting on iOS.
        let animates = animation != .none && !reduceMotion
        // `variant: .circular` is a percentage radius in the recipe, which has
        // no length to travel as; before it arrived as a flag this drew a square.
        let shape = style.borderRadiusFull == true
            ? AnyShape(Circle())
            : AnyShape(RoundedRectangle(cornerRadius: style.borderRadius ?? 0))
        return shape
            .fill(style.bgColor ?? CocsoTokens.Color.surfaceNeutral(colorScheme))
            .frame(width: style.width, height: style.height ?? 16)
            .opacity(animates && pulsing ? 0.45 : 1)
            .animation(
                animates
                    ? .easeInOut(duration: 1).repeatForever(autoreverses: true)
                    : nil,
                value: pulsing
            )
            .onAppear { pulsing = animates }
            .accessibilityHidden(true)
    }
}
