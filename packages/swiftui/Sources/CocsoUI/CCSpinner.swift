import SwiftUI

/// An indeterminate activity indicator.
public struct CCSpinner: View {
    private let variant: CCSpinnerVariant
    private let size: CCSpinnerSize
    private let label: String

    @Environment(\.colorScheme) private var colorScheme
    // The brand the app set at its root. Tokens and resolvers take it so a
    // design-system view draws the same primary the app does.
    @Environment(\.cocsoBrand) private var brand
    @Environment(\.accessibilityReduceMotion) private var reduceMotion
    @State private var spinning = false

    public init(
        variant: CCSpinnerVariant = .primary,
        size: CCSpinnerSize = .medium,
        label: String = CCStrings.loading
    ) {
        self.variant = variant
        self.size = size
        self.label = label
    }

    public var body: some View {
        let style = CCSpinnerStyle.resolve(variant: variant, size: size, scheme: colorScheme, brand: brand)
        let side = style.output ?? 16
        let bladeCount = style.blades ?? 8
        ZStack {
            ForEach(0..<max(bladeCount, 1), id: \.self) { index in
                RoundedRectangle(cornerRadius: style.bladeRadius ?? 1)
                    .fill(style.bladeColor ?? CocsoTokens.Color.interactivePrimary(colorScheme, brand: brand))
                    .frame(width: style.bladeWidth ?? 2, height: style.bladeHeight ?? 5)
                    .offset(y: -side / 2 + (style.bladeHeight ?? 5) / 2)
                    .rotationEffect(.degrees(Double(index) / Double(max(bladeCount, 1)) * 360))
                    .opacity(Double(index + 1) / Double(max(bladeCount, 1)))
            }
        }
        .frame(width: side, height: side)
        // One turn per `duration-decorative`, the period of the web's
        // `spinner-blade-fade` — a rotating opacity ramp is the same picture as
        // eight blades fading in turn.
        .rotationEffect(.degrees(spinning && !reduceMotion ? 360 : 0))
        // Reduced motion: the web swaps the spin for a slow pulse of the whole
        // indicator (`spinner-reduced-pulse`, 0.4 ↔ 0.8 over 2s), and so does
        // this — still says work is happening, without anything travelling.
        .opacity(reduceMotion ? (spinning ? 0.8 : 0.4) : 1)
        .animation(
            reduceMotion
                ? CocsoTokens.Easing.default(1).repeatForever(autoreverses: true)
                : .linear(duration: CocsoTokens.Duration.decorative).repeatForever(autoreverses: false),
            value: spinning
        )
        .onAppear { spinning = true }
        .accessibilityElement()
        .accessibilityLabel(label)
    }
}
