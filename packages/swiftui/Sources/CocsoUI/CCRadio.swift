import SwiftUI

/// One choice a `CCRadioGroup` offers.
public struct CCRadioOption: Identifiable, Equatable, Sendable {
    public let id: String
    public let title: String

    public init(id: String, title: String) {
        self.id = id
        self.title = title
    }
}

/**
 One of several, exactly one chosen.

 Values come from `CCRadioStyle.resolve`, generated from `radio-group.recipe.ts`
 — the recipe is named `radio`, so the style is `CCRadioStyle` and this file
 follows it. The group lays the options out and owns the selection; each row
 draws the ring, the dot, and a focus ring where there is a keyboard.
 */
public struct CCRadioGroup: View {
    private let label: String
    private let options: [CCRadioOption]
    @Binding private var selection: String?
    private let size: CCRadioSize

    public init(
        label: String,
        options: [CCRadioOption],
        selection: Binding<String?>,
        size: CCRadioSize = .medium
    ) {
        self.label = label
        self.options = options
        self._selection = selection
        self.size = size
    }

    public var body: some View {
        VStack(alignment: .leading, spacing: CocsoTokens.Spacing.s3) {
            CCTypography(label, type: .body, size: .small)
            ForEach(options) { option in
                CCRadio(
                    option.title,
                    selected: option.id == selection,
                    size: size,
                    onSelect: { selection = option.id }
                )
            }
        }
        .accessibilityElement(children: .contain)
        .accessibilityLabel(label)
    }
}

/// A single radio row. `CCRadioGroup` is the usual way to get several.
public struct CCRadio: View {
    private let title: String
    private let selected: Bool
    private let size: CCRadioSize
    private let onSelect: () -> Void

    @Environment(\.colorScheme) private var colorScheme
    // The brand the app set at its root. Tokens and resolvers take it so a
    // design-system view draws the same primary the app does.
    @Environment(\.cocsoBrand) private var brand
    @Environment(\.isEnabled) private var isEnabled
    @Environment(\.accessibilityReduceMotion) private var reduceMotion
    // WCAG 2.4.7 applies wherever there is a keyboard, and an iPad has one.
    @FocusState private var isFocused: Bool

    public init(
        _ title: String,
        selected: Bool,
        size: CCRadioSize = .medium,
        onSelect: @escaping () -> Void
    ) {
        self.title = title
        self.selected = selected
        self.size = size
        self.onSelect = onSelect
    }

    public var body: some View {
        let style = CCRadioStyle.resolve(
            size: size,
            selected: selected ? CCRadioSelected.`true` : CCRadioSelected.`false`,
            scheme: colorScheme, brand: brand
        )
        let side = style.size ?? 16
        let dot = style.dotSize ?? 7
        // The web's radio: the page's fill, a 2px ring (`spacing-2`) that takes
        // `checkedColor` when selected, and a `checkedColor` dot.
        let checked = style.checkedColor ?? CocsoTokens.Color.interactivePrimary(colorScheme, brand: brand)
        Button(action: onSelect) {
            HStack(spacing: CocsoTokens.Spacing.s5) {
                Circle()
                    .fill(style.bgColor ?? CocsoTokens.Color.surfacePrimary(colorScheme, brand: brand))
                    .overlay(
                        Circle().strokeBorder(
                            style.borderColor ?? CocsoTokens.Color.borderStrong(colorScheme, brand: brand),
                            lineWidth: CocsoTokens.Spacing.s2
                        )
                    )
                    // The ring recolours on the web's colour curve; the dot pops in
                    // on the entrance curve.
                    .animation(CCMotion.colour(reduced: reduceMotion), value: selected)
                    .overlay(
                        Group {
                            if selected {
                                Circle()
                                    .fill(checked)
                                    .frame(width: dot, height: dot)
                                    .transition(.scale(scale: 0.4).combined(with: .opacity))
                            }
                        }
                        .animation(CCMotion.entrance(reduced: reduceMotion), value: selected)
                    )
                    .overlay(
                        Circle()
                            .strokeBorder(
                                style.focusRingColor ?? CocsoTokens.Color.focusRing(colorScheme, brand: brand),
                                lineWidth: isFocused ? 2 : 0
                            )
                            .padding(-2)
                    )
                    .frame(width: side, height: side)
                CCTypography(title, type: .body, size: .medium)
            }
            .ccMinimumTouchTarget()
        }
        .buttonStyle(CCPressStyle())
        .focused($isFocused)
        .opacity(isEnabled ? 1 : 0.4)
        .animation(CCMotion.colour(reduced: reduceMotion), value: isEnabled)
        .accessibilityElement(children: .ignore)
        .accessibilityLabel(title)
        .accessibilityAddTraits(selected ? [.isButton, .isSelected] : .isButton)
    }
}
