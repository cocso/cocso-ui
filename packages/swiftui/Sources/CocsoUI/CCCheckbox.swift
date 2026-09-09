import SwiftUI

/// A checkbox with three states, matching the web's `status`.
public struct CCCheckbox: View {
    private let label: String
    private let status: CCCheckboxStatus
    private let size: CCCheckboxSize
    private let onChange: (CCCheckboxStatus) -> Void

    @Environment(\.colorScheme) private var colorScheme
    // The brand the app set at its root. Tokens and resolvers take it so a
    // design-system view draws the same primary the app does.
    @Environment(\.cocsoBrand) private var brand
    @Environment(\.isEnabled) private var isEnabled
    @Environment(\.accessibilityReduceMotion) private var reduceMotion
    // WCAG 2.4.7 applies wherever there is a keyboard, and an iPad has one.
    // The recipe carries the ring's colour; without this it went unread.
    @FocusState private var isFocused: Bool

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
        let style = CCCheckboxStyle.resolve(size: size, status: status, scheme: colorScheme, brand: brand)
        let side = style.size ?? 16
        Button(action: { onChange(status == .on ? .off : .on) }) {
            HStack(spacing: CocsoTokens.Spacing.s5) {
                RoundedRectangle(cornerRadius: style.radius ?? 2)
                    .fill(style.bgColor ?? CocsoTokens.Color.surfacePrimary(colorScheme, brand: brand))
                    .overlay(
                        RoundedRectangle(cornerRadius: style.radius ?? 2)
                            .strokeBorder(
                                style.borderColor ?? CocsoTokens.Color.borderPrimary(colorScheme, brand: brand),
                                lineWidth: 1
                            )
                    )
                    // The fill arrives on the web's colour curve; the glyph
                    // pops in on the entrance curve, from small and clear.
                    .animation(CCMotion.colour(reduced: reduceMotion), value: status)
                    .overlay(
                        glyph(side: side)
                            .animation(CCMotion.entrance(reduced: reduceMotion), value: status)
                    )
                    .overlay(
                        RoundedRectangle(cornerRadius: (style.radius ?? 2) + 2)
                            .strokeBorder(
                                style.focusRingColor ?? CocsoTokens.Color.focusRing(colorScheme, brand: brand),
                                lineWidth: isFocused ? 2 : 0
                            )
                            .padding(-2)
                    )
                    .frame(width: side, height: side)
                CCTypography(label, type: .body, size: .medium)
            }
            .ccMinimumTouchTarget()
        }
        .buttonStyle(CCPressStyle())
        .focused($isFocused)
        .opacity(isEnabled ? 1 : 0.4)
        .animation(CCMotion.colour(reduced: reduceMotion), value: isEnabled)
        .accessibilityElement(children: .ignore)
        .accessibilityLabel(label)
        .accessibilityAddTraits(status == .on ? [.isButton, .isSelected] : .isButton)
        // `.isSelected` has two states and the recipe has three, so the third
        // is spoken rather than left sounding like "off".
        .accessibilityValue(Text(status == .intermediate ? CCStrings.mixed : ""))
    }

    @ViewBuilder
    private func glyph(side: CGFloat) -> some View {
        // `text-on-primary`, not white: the fill is `interactive-primary`, which
        // the dark theme flips to a near-white. That pairing is why the web's
        // checkbox was 1.09:1 in dark mode.
        let tint = CocsoTokens.Color.textOnPrimary(colorScheme, brand: brand)
        switch status {
        case .on:
            Image(systemName: "checkmark")
                .font(.system(size: side * 0.7, weight: .bold))
                .foregroundStyle(tint)
                .transition(.scale(scale: 0.5).combined(with: .opacity))
        case .intermediate:
            RoundedRectangle(cornerRadius: 1)
                .fill(tint)
                .frame(width: side * 0.55, height: 2)
                .transition(.scale(scale: 0.5).combined(with: .opacity))
        case .off:
            EmptyView()
        }
    }
}
