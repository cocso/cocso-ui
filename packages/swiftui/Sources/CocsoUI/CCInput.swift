import SwiftUI

/// A single-line text field.
public struct CCInput: View {
    private let label: String
    private let placeholder: String
    @Binding private var text: String
    private let size: CCInputSize
    private let isSecure: Bool
    private let description: String?
    private let errorMessage: String?

    @Environment(\.colorScheme) private var colorScheme
    // The brand the app set at its root. Tokens and resolvers take it so a
    // design-system view draws the same primary the app does.
    @Environment(\.cocsoBrand) private var brand
    @Environment(\.isEnabled) private var isEnabled
    @Environment(\.accessibilityReduceMotion) private var reduceMotion
    @State private var revealed = false
    // 웹의 `.input:focus-visible` — 쉬는 테두리와 다른 토큰이어야 포커스가
    // 보인다(2.4.7). 쉬는 상태는 이제 `border-strong` 이다.
    @FocusState private var isFocused: Bool

    public init(
        label: String,
        text: Binding<String>,
        placeholder: String = "",
        size: CCInputSize = .medium,
        isSecure: Bool = false,
        description: String? = nil,
        errorMessage: String? = nil
    ) {
        self.label = label
        self._text = text
        self.placeholder = placeholder
        self.size = size
        self.isSecure = isSecure
        self.description = description
        self.errorMessage = errorMessage
    }

    public var body: some View {
        let style = CCInputStyle.resolve(size: size, scheme: colorScheme, brand: brand)
        VStack(alignment: .leading, spacing: CocsoTokens.Spacing.s3) {
            CCTypography(label, type: .body, size: .small)
            HStack(spacing: 0) {
                ZStack(alignment: .leading) {
                    // SwiftUI 의 기본 플레이스홀더는 시스템 회색이다. 웹은
                    // `text-secondary` 로 그리므로 직접 그린다 — Compose 쪽도
                    // 같은 이유로 직접 그린다.
                    if text.isEmpty && !placeholder.isEmpty {
                        Text(placeholder)
                            .font(.system(size: style.fontSize ?? 14))
                            .foregroundStyle(CocsoTokens.Color.textSecondary(colorScheme, brand: brand))
                    }
                    field
                        // The system's bezel drew a box inside the box — visible
                        // on macOS renders, and not the web's single border.
                        .textFieldStyle(.plain)
                        .font(.system(size: style.fontSize ?? 14))
                        .foregroundStyle(CocsoTokens.Color.textPrimary(colorScheme, brand: brand))
                        .focused($isFocused)
                }
                if isSecure {
                    Button(action: { revealed.toggle() }) {
                        Image(systemName: revealed ? "eye.slash" : "eye")
                            // One step back from the value, and it clears AA in
                            // both themes; `text-tertiary` is 3.08:1 on white.
                            .foregroundStyle(CocsoTokens.Color.textSecondary(colorScheme, brand: brand))
                            // The two glyphs cross-fade rather than swap.
                            .id(revealed)
                            .transition(.opacity)
                    }
                    .animation(CCMotion.colour(reduced: reduceMotion), value: revealed)
                    .buttonStyle(.plain)
                    .ccMinimumTouchTarget()
                    .accessibilityLabel(revealed ? CCStrings.hidePassword : CCStrings.showPassword)
                }
            }
            .padding(.horizontal, style.paddingX ?? 12)
            .frame(height: style.height ?? 36)
            .background(CocsoTokens.Color.surfacePrimary(colorScheme, brand: brand))
            .clipShape(RoundedRectangle(cornerRadius: style.borderRadius ?? 4))
            .overlay(
                RoundedRectangle(cornerRadius: style.borderRadius ?? 4)
                    .strokeBorder(
                        borderColor(style),
                        lineWidth: isFocused ? 2 : 1
                    )
                    // The web's `transition: box-shadow fast soft` — the focus
                    // ring thickens and recolours rather than appearing.
                    .animation(CCMotion.colour(reduced: reduceMotion), value: isFocused)
                    .animation(CCMotion.colour(reduced: reduceMotion), value: errorMessage)
            )
            // The web's `description`: help under the field, in the quieter ink.
            if let description {
                Text(description)
                    .font(.system(size: 12))
                    .foregroundStyle(CocsoTokens.Color.textSecondary(colorScheme, brand: brand))
            }
            if let errorMessage {
                // The text level, not the fill level: `feedback-danger` is
                // 4.18:1 on a card in the light theme.
                Text(errorMessage)
                    .font(.system(size: 12))
                    .foregroundStyle(CocsoTokens.Color.feedbackDangerText(colorScheme, brand: brand))
                    .transition(.move(edge: .top).combined(with: .opacity))
            }
        }
        // The message slides in under the field on the entrance curve.
        .animation(CCMotion.entrance(reduced: reduceMotion), value: errorMessage)
        .opacity(isEnabled ? 1 : 0.4)
        .animation(CCMotion.colour(reduced: reduceMotion), value: isEnabled)
    }

    private func borderColor(_ style: CCInputStyle) -> SwiftUI.Color {
        // 웹의 순서: 오류가 먼저, 그다음 포커스, 그다음 쉬는 상태.
        if errorMessage != nil { return CocsoTokens.Color.feedbackDanger(colorScheme, brand: brand) }
        if isFocused { return CocsoTokens.Color.focusRing(colorScheme, brand: brand) }
        return style.borderColor ?? CocsoTokens.Color.borderStrong(colorScheme, brand: brand)
    }

    @ViewBuilder
    private var field: some View {
        // The secure entry is toggled rather than overlaid, so the system's
        // password autofill keeps working either way.
        if isSecure && !revealed {
            SecureField("", text: $text)
        } else {
            TextField("", text: $text)
        }
    }
}
