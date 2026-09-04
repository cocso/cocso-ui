import SwiftUI

/// An indeterminate activity indicator.
public struct CCSpinner: View {
    private let variant: CCSpinnerVariant
    private let size: CCSpinnerSize
    private let label: String

    @Environment(\.colorScheme) private var colorScheme
    @Environment(\.accessibilityReduceMotion) private var reduceMotion
    @State private var spinning = false

    public init(
        variant: CCSpinnerVariant = .primary,
        size: CCSpinnerSize = .medium,
        label: String = "Loading"
    ) {
        self.variant = variant
        self.size = size
        self.label = label
    }

    public var body: some View {
        let style = CCSpinnerStyle.resolve(variant: variant, size: size, scheme: colorScheme)
        let side = style.output ?? 16
        let bladeCount = Int(style.blades ?? 8)
        ZStack {
            ForEach(0..<max(bladeCount, 1), id: \.self) { index in
                Capsule()
                    .fill(style.bladeColor ?? CocsoTokens.Color.interactivePrimary(colorScheme))
                    .frame(width: style.bladeWidth ?? 2, height: style.bladeHeight ?? 5)
                    .offset(y: -side / 2 + (style.bladeHeight ?? 5) / 2)
                    .rotationEffect(.degrees(Double(index) / Double(max(bladeCount, 1)) * 360))
                    .opacity(Double(index + 1) / Double(max(bladeCount, 1)))
            }
        }
        .frame(width: side, height: side)
        .rotationEffect(.degrees(spinning ? 360 : 0))
        // Reduced motion stops the rotation; the indicator still says work is
        // happening through its accessibility value.
        .animation(
            reduceMotion ? nil : .linear(duration: 0.8).repeatForever(autoreverses: false),
            value: spinning
        )
        .onAppear { spinning = !reduceMotion }
        .accessibilityElement()
        .accessibilityLabel(label)
    }
}
