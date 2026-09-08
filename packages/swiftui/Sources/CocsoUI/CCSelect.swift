import SwiftUI

/// One choice a `CCSelect` offers.
public struct CCSelectOption: Identifiable, Equatable, Sendable {
    public let id: String
    public let title: String

    public init(id: String, title: String) {
        self.id = id
        self.title = title
    }
}

/**
 A single choice from a short list.

 Values come from `CCSelectStyle.resolve`, generated from `select.recipe.ts`.
 The trigger is the web's `<select>`: the chosen title, or the placeholder in
 `text-secondary`, with the selector glyph at the recipe's inset. The list is
 the platform's menu — a native `Menu` — since a rolled list of options is what
 a phone user expects a select to open.
 */
public struct CCSelect: View {
    private let label: String
    private let options: [CCSelectOption]
    @Binding private var selection: String?
    private let placeholder: String
    private let size: CCSelectSize

    @Environment(\.colorScheme) private var colorScheme
    // The brand the app set at its root. Tokens and resolvers take it so a
    // design-system view draws the same primary the app does.
    @Environment(\.cocsoBrand) private var brand
    @Environment(\.isEnabled) private var isEnabled
    @Environment(\.accessibilityReduceMotion) private var reduceMotion
    // 웹의 `.select:focus-visible` (2.4.7). 쉬는 테두리는 `border-strong`.
    @FocusState private var isFocused: Bool

    public init(
        label: String,
        options: [CCSelectOption],
        selection: Binding<String?>,
        placeholder: String = CCStrings.select,
        size: CCSelectSize = .medium
    ) {
        self.label = label
        self.options = options
        self._selection = selection
        self.placeholder = placeholder
        self.size = size
    }

    public var body: some View {
        let style = CCSelectStyle.resolve(size: size, scheme: colorScheme, brand: brand)
        let radius = style.borderRadius ?? 4
        let chosen = options.first { $0.id == selection }
        VStack(alignment: .leading, spacing: CocsoTokens.Spacing.s3) {
            CCTypography(label, type: .body, size: .small)
            Menu {
                ForEach(options) { option in
                    Button(action: { selection = option.id }) {
                        if option.id == selection {
                            Label(option.title, systemImage: "checkmark")
                        } else {
                            Text(option.title)
                        }
                    }
                }
            } label: {
                HStack(spacing: 0) {
                    Text(chosen?.title ?? placeholder)
                        .font(.system(size: style.fontSize ?? 14))
                        .foregroundStyle(
                            chosen == nil
                                ? CocsoTokens.Color.textSecondary(colorScheme, brand: brand)
                                : CocsoTokens.Color.textPrimary(colorScheme, brand: brand)
                        )
                        .lineLimit(1)
                    Spacer(minLength: CocsoTokens.Spacing.s5)
                    // The web's `SelectorIcon`, at the recipe's `iconRight`.
                    Image(systemName: "chevron.up.chevron.down")
                        .font(.system(size: 12, weight: .medium))
                        .foregroundStyle(CocsoTokens.Color.textSecondary(colorScheme, brand: brand))
                        .padding(.trailing, style.iconRight ?? 12)
                }
                .padding(.leading, style.paddingLeft ?? 12)
                // The recipe's right inset already leaves room for the glyph.
                .padding(.trailing, (style.paddingRight ?? 38) - (style.iconRight ?? 12) - 12)
                .frame(minWidth: style.minWidth, maxWidth: .infinity)
                .frame(height: style.height ?? 36)
                .contentShape(Rectangle())
            }
            .menuStyle(.button)
            .buttonStyle(.plain)
            .focused($isFocused)
            .background(CocsoTokens.Color.surfacePrimary(colorScheme, brand: brand))
            .clipShape(RoundedRectangle(cornerRadius: radius))
            .overlay(
                RoundedRectangle(cornerRadius: radius)
                    .strokeBorder(
                        isFocused
                            ? CocsoTokens.Color.focusRing(colorScheme, brand: brand)
                            : style.borderColor ?? CocsoTokens.Color.borderStrong(colorScheme, brand: brand),
                        lineWidth: isFocused ? 2 : 1
                    )
                    .animation(CCMotion.colour(reduced: reduceMotion), value: isFocused)
            )
            // The chosen title cross-fades in rather than swapping.
            .animation(CCMotion.colour(reduced: reduceMotion), value: selection)
        }
        .opacity(isEnabled ? 1 : 0.4)
        .animation(CCMotion.colour(reduced: reduceMotion), value: isEnabled)
        .accessibilityElement(children: .contain)
        .accessibilityLabel(label)
        .accessibilityValue(Text(chosen?.title ?? placeholder))
    }
}
