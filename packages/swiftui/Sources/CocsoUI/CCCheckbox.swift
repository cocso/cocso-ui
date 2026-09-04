import SwiftUI

/// A checkbox with three states, matching the web's `status`.
public struct CCCheckbox: View {
    private let label: String
    private let status: CCCheckboxStatus
    private let size: CCCheckboxSize
    private let onChange: (CCCheckboxStatus) -> Void

    @Environment(\.colorScheme) private var colorScheme
    @Environment(\.isEnabled) private var isEnabled

    public init(
        label: String,
        status: CCCheckboxStatus = .off,
        size: CCCheckboxSize = .medium,
        onChange: @escaping (CCCheckboxStatus) -> Void
    ) {
        self.label = label
        self.status = status
        self.size = size
        self.onChange = onChange
    }

    public var body: some View {
        let style = CCCheckboxStyle.resolve(size: size, status: status, scheme: colorScheme)
        let side = style.size ?? 16
        Button(action: { onChange(status == .on ? .off : .on) }) {
            HStack(spacing: CocsoTokens.Spacing.s5) {
                RoundedRectangle(cornerRadius: style.radius ?? 2)
                    .fill(style.bgColor ?? CocsoTokens.Color.surfacePrimary(colorScheme))
                    .overlay(
                        RoundedRectangle(cornerRadius: style.radius ?? 2)
                            .strokeBorder(
                                style.borderColor ?? CocsoTokens.Color.borderPrimary(colorScheme),
                                lineWidth: 1
                            )
                    )
                    .overlay(glyph(side: side))
                    .frame(width: side, height: side)
                CCTypography(label, type: .body, size: .medium)
            }
            .ccMinimumTouchTarget()
        }
        .buttonStyle(.plain)
        .opacity(isEnabled ? 1 : 0.4)
        .accessibilityElement(children: .ignore)
        .accessibilityLabel(label)
        .accessibilityAddTraits(status == .on ? [.isButton, .isSelected] : .isButton)
        // `.isSelected` has two states and the recipe has three, so the third
        // is spoken rather than left sounding like "off".
        .accessibilityValue(Text(status == .intermediate ? "Mixed" : ""))
    }

    @ViewBuilder
    private func glyph(side: CGFloat) -> some View {
        // `text-on-primary`, not white: the fill is `interactive-primary`, which
        // the dark theme flips to a near-white. That pairing is why the web's
        // checkbox was 1.09:1 in dark mode.
        let tint = CocsoTokens.Color.textOnPrimary(colorScheme)
        switch status {
        case .on:
            Image(systemName: "checkmark")
                .font(.system(size: side * 0.7, weight: .bold))
                .foregroundStyle(tint)
        case .intermediate:
            RoundedRectangle(cornerRadius: 1)
                .fill(tint)
                .frame(width: side * 0.55, height: 2)
        case .off:
            EmptyView()
        }
    }
}
