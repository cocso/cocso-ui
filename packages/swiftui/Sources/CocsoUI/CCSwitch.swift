import SwiftUI

/// Which side of the track the label sits on — the web's `position`.
public enum CCSwitchLabelPosition: Sendable {
    /// Label before the track. The web's `position="left"`.
    case leading
    /// Label after the track. The web's default.
    case trailing
}

/// A toggle.
public struct CCSwitch: View {
    private let label: String
    private let isOn: Bool
    private let variant: CCSwitchVariant
    private let size: CCSwitchSize
    private let labelPosition: CCSwitchLabelPosition
    private let onChange: (Bool) -> Void

    @Environment(\.colorScheme) private var colorScheme
    // The brand the app set at its root. Tokens and resolvers take it so a
    // design-system view draws the same primary the app does.
    @Environment(\.cocsoBrand) private var brand
    @Environment(\.isEnabled) private var isEnabled
    @Environment(\.accessibilityReduceMotion) private var reduceMotion
    // WCAG 2.4.7 applies wherever there is a keyboard, and an iPad has one.
    // The web draws `.switch:focus-visible`; this drew nothing.
    @FocusState private var isFocused: Bool

    public init(
        label: String,
        isOn: Bool,
        variant: CCSwitchVariant = .primary,
        size: CCSwitchSize = .medium,
        labelPosition: CCSwitchLabelPosition = .trailing,
        onChange: @escaping (Bool) -> Void
    ) {
        self.label = label
        self.isOn = isOn
        self.variant = variant
        self.size = size
        self.labelPosition = labelPosition
        self.onChange = onChange
    }

    public var body: some View {
        let style = CCSwitchStyle.resolve(
            variant: variant,
            size: size,
            checked: isOn ? CCSwitchChecked.`true` : CCSwitchChecked.`false`,
            scheme: colorScheme, brand: brand
        )
        let track = CGSize(width: style.width ?? 36, height: style.height ?? 20)
        let thumb = style.thumbSize ?? 16
        let inset = style.thumbOffset ?? 2

        Button(action: { onChange(!isOn) }) {
            HStack(spacing: CocsoTokens.Spacing.s5) {
                if labelPosition == .leading {
                    CCTypography(label, type: .body, size: .medium)
                }
                ZStack(alignment: isOn ? .trailing : .leading) {
                    Capsule()
                        .fill(
                            (isOn ? style.checkedBgColor : style.switchBgColor)
                                ?? CocsoTokens.Color.surfaceNeutral(colorScheme, brand: brand)
                        )
                        // 꺼진 트랙은 페이지와 1.23:1 이라 스위치가 어디 있는지
                        // 보이지 않았다. 색은 레시피가 정한다.
                        .overlay(
                            Capsule().strokeBorder(
                                style.borderColor
                                    ?? CocsoTokens.Color.borderStrong(colorScheme, brand: brand),
                                lineWidth: 1
                            )
                        )
                    Circle()
                        // 레시피가 정한다. 세 플랫폼이 각자 고르던 자리였다.
                        .fill(style.thumbColor ?? CocsoTokens.Color.textOnPrimary(colorScheme, brand: brand))
                        // 꺼진 상태에만 값이 온다 — 손잡이와 트랙이 1.23:1 이라
                        // 경계가 필요하고, 켜진 트랙 위에서는 이미 18:1 이다.
                        .overlay(
                            Circle().strokeBorder(
                                style.thumbBorderColor ?? .clear,
                                lineWidth: 1
                            )
                        )
                        .frame(width: thumb, height: thumb)
                        // The web's `--cocso-shadow-thumb`: the handle lifts off the track.
                        .ccShadow(CocsoTokens.Shadow.thumb(colorScheme))
                        .padding(.horizontal, inset)
                }
                .frame(width: track.width, height: track.height)
                .ccFocusRing(isFocused, in: Capsule())
                // The thumb travels and the track recolours on the web's
                // `transition: transform fast soft` — not on one frame.
                .animation(CCMotion.movement(reduced: reduceMotion), value: isOn)
                if labelPosition == .trailing {
                    CCTypography(label, type: .body, size: .medium)
                }
            }
            .ccMinimumTouchTarget()
        }
        .buttonStyle(CCPressStyle())
        .focused($isFocused)
        .opacity(isEnabled ? 1 : 0.4)
        .animation(CCMotion.colour(reduced: reduceMotion), value: isEnabled)
        .accessibilityElement(children: .ignore)
        .accessibilityLabel(label)
        .accessibilityAddTraits(.isButton)
        .accessibilityValue(Text(isOn ? CCStrings.on : CCStrings.off))
    }
}
