import SwiftUI

/// A placeholder while content loads.
public struct CCSkeleton: View {
    private let variant: CCSkeletonVariant
    private let animation: CCSkeletonAnimation

    @Environment(\.colorScheme) private var colorScheme
    // The brand the app set at its root. Tokens and resolvers take it so a
    // design-system view draws the same primary the app does.
    @Environment(\.cocsoBrand) private var brand
    @Environment(\.accessibilityReduceMotion) private var reduceMotion
    @State private var phase = false

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
            scheme: colorScheme, brand: brand
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
            .fill(style.bgColor ?? CocsoTokens.Color.surfaceNeutral(colorScheme, brand: brand))
            .frame(width: style.width, height: style.height ?? 16)
            // The web's `skeleton-pulse`: 1 → 0.4 → 1 over `duration-decorative-slow`
            // on `easing-default`. Half the period each way, auto-reversed.
            .opacity(animates && animation == .pulse && phase ? 0.4 : 1)
            .overlay(wave(animates: animates && animation == .wave))
            .clipShape(shape)
            .animation(
                animates
                    ? CocsoTokens.Easing.default(
                        animation == .pulse
                            ? CocsoTokens.Duration.decorativeSlow / 2
                            : CocsoTokens.Duration.decorativeSlow
                    )
                    .repeatForever(autoreverses: animation == .pulse)
                    : nil,
                value: phase
            )
            .onAppear { phase = animates }
            .accessibilityHidden(true)
    }

    /// The web's `skeleton-wave`: a band of `white-alpha-40` sweeping from off
    /// the left edge to off the right, once per `duration-decorative-slow`.
    @ViewBuilder
    private func wave(animates: Bool) -> some View {
        if animates {
            GeometryReader { geometry in
                LinearGradient(
                    colors: [.clear, CocsoTokens.Color.whiteAlpha40, .clear],
                    startPoint: .leading,
                    endPoint: .trailing
                )
                .offset(x: phase ? geometry.size.width : -geometry.size.width)
            }
        }
    }
}
