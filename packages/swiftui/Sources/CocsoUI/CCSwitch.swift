import SwiftUI

/// A toggle.
public struct CCSwitch: View {
    private let label: String
    private let isOn: Bool
    private let variant: CCSwitchVariant
    private let size: CCSwitchSize
    private let onChange: (Bool) -> Void

    @Environment(\.colorScheme) private var colorScheme
    @Environment(\.isEnabled) private var isEnabled

    public init(
        label: String,
        isOn: Bool,
        variant: CCSwitchVariant = .primary,
        size: CCSwitchSize = .medium,
        onChange: @escaping (Bool) -> Void
    ) {
        self.label = label
        self.isOn = isOn
        self.variant = variant
        self.size = size
        self.onChange = onChange
    }

    public var body: some View {
        let style = CCSwitchStyle.resolve(
            variant: variant,
            size: size,
            checked: isOn ? CCSwitchChecked.`true` : CCSwitchChecked.`false`,
            scheme: colorScheme
        )
        let track = CGSize(width: style.width ?? 36, height: style.height ?? 20)
        let thumb = style.thumbSize ?? 16
        let inset = style.thumbOffset ?? 2

        Button(action: { onChange(!isOn) }) {
            HStack(spacing: CocsoTokens.Spacing.s5) {
                ZStack(alignment: isOn ? .trailing : .leading) {
                    Capsule()
                        .fill(
                            (isOn ? style.checkedBgColor : style.switchBgColor)
                                ?? CocsoTokens.Color.surfaceNeutral(colorScheme)
                        )
                    Circle()
                        .fill(CocsoTokens.Color.surfacePrimary(colorScheme))
                        .frame(width: thumb, height: thumb)
                        .padding(.horizontal, inset)
                }
                .frame(width: track.width, height: track.height)
                CCTypography(label, type: .body, size: .medium)
            }
            .ccMinimumTouchTarget()
        }
        .buttonStyle(.plain)
        .opacity(isEnabled ? 1 : 0.4)
        .accessibilityElement(children: .ignore)
        .accessibilityLabel(label)
        .accessibilityAddTraits(.isButton)
        .accessibilityValue(Text(isOn ? "On" : "Off"))
    }
}
