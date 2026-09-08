import SwiftUI

/// A determinate progress bar.
public struct CCProgress: View {
    private let value: Double
    private let total: Double
    private let variant: CCProgressVariant
    private let size: CCProgressSize
    private let label: String

    @Environment(\.colorScheme) private var colorScheme
    // The brand the app set at its root. Tokens and resolvers take it so a
    // design-system view draws the same primary the app does.
    @Environment(\.cocsoBrand) private var brand
    @Environment(\.accessibilityReduceMotion) private var reduceMotion

    public init(
        value: Double,
        total: Double = 100,
        label: String = "Progress",
        variant: CCProgressVariant = .primary,
        size: CCProgressSize = .md
    ) {
        self.value = value
        self.total = total
        self.label = label
        self.variant = variant
        self.size = size
    }

    public var body: some View {
        let style = CCProgressStyle.resolve(variant: variant, size: size, scheme: colorScheme, brand: brand)
        let fraction = total > 0 ? min(max(value / total, 0), 1) : 0
        let height = style.height ?? 8
        GeometryReader { geometry in
            // The recipe gives a radius per size. A capsule here ignored it,
            // and Android did not — the same bar was a different shape on the
            // two platforms.
            let shape = RoundedRectangle(cornerRadius: style.borderRadius ?? height / 2)
            ZStack(alignment: .leading) {
                shape.fill(style.bgColor ?? CocsoTokens.Color.surfaceNeutral(colorScheme, brand: brand))
                shape
                    .fill(style.fillColor ?? CocsoTokens.Color.interactivePrimary(colorScheme, brand: brand))
                    .frame(width: geometry.size.width * fraction)
                    // The web's `transition: width normal soft`: the bar fills
                    // to the new value rather than jumping to it.
                    .animation(CCMotion.fill(reduced: reduceMotion), value: fraction)
            }
        }
        .frame(height: height)
        // `role="progressbar"` is invalid without a name on the web, and the
        // equivalent here is a value with something naming it.
        .accessibilityElement()
        .accessibilityLabel(label)
        .accessibilityValue(Text("\(Int(fraction * 100))%"))
    }
}
