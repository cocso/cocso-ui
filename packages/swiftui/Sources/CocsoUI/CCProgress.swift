import SwiftUI

/// A determinate progress bar.
public struct CCProgress: View {
    private let value: Double
    private let total: Double
    private let variant: CCProgressVariant
    private let size: CCProgressSize
    private let label: String

    @Environment(\.colorScheme) private var colorScheme

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
        let style = CCProgressStyle.resolve(variant: variant, size: size, scheme: colorScheme)
        let fraction = total > 0 ? min(max(value / total, 0), 1) : 0
        let height = style.height ?? 8
        GeometryReader { geometry in
            ZStack(alignment: .leading) {
                Capsule().fill(style.bgColor ?? CocsoTokens.Color.surfaceNeutral(colorScheme))
                Capsule()
                    .fill(style.fillColor ?? CocsoTokens.Color.interactivePrimary(colorScheme))
                    .frame(width: geometry.size.width * fraction)
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
