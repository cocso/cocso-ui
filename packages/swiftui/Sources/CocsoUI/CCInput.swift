import SwiftUI

/// A single-line text field.
public struct CCInput: View {
    private let label: String
    private let placeholder: String
    @Binding private var text: String
    private let size: CCInputSize
    private let isSecure: Bool
    private let errorMessage: String?

    @Environment(\.colorScheme) private var colorScheme
    @Environment(\.isEnabled) private var isEnabled
    @State private var revealed = false

    public init(
        label: String,
        text: Binding<String>,
        placeholder: String = "",
        size: CCInputSize = .medium,
        isSecure: Bool = false,
        errorMessage: String? = nil
    ) {
        self.label = label
        self._text = text
        self.placeholder = placeholder
        self.size = size
        self.isSecure = isSecure
        self.errorMessage = errorMessage
    }

    public var body: some View {
        let style = CCInputStyle.resolve(size: size, scheme: colorScheme)
        VStack(alignment: .leading, spacing: CocsoTokens.Spacing.s3) {
            CCTypography(label, type: .body, size: .small)
            HStack(spacing: 0) {
                field
                    .font(.system(size: style.fontSize ?? 14))
                    .foregroundStyle(CocsoTokens.Color.textPrimary(colorScheme))
                if isSecure {
                    Button(action: { revealed.toggle() }) {
                        Image(systemName: revealed ? "eye.slash" : "eye")
                            // One step back from the value, and it clears AA in
                            // both themes; `text-tertiary` is 3.08:1 on white.
                            .foregroundStyle(CocsoTokens.Color.textSecondary(colorScheme))
                    }
                    .buttonStyle(.plain)
                    .ccMinimumTouchTarget()
                    .accessibilityLabel(revealed ? "Hide password" : "Show password")
                }
            }
            .padding(.horizontal, style.paddingX ?? 12)
            .frame(height: style.height ?? 36)
            .background(CocsoTokens.Color.surfacePrimary(colorScheme))
            .clipShape(RoundedRectangle(cornerRadius: style.borderRadius ?? 4))
            .overlay(
                RoundedRectangle(cornerRadius: style.borderRadius ?? 4)
                    .strokeBorder(
                        errorMessage == nil
                            ? (style.borderColor ?? CocsoTokens.Color.borderSecondary(colorScheme))
                            : CocsoTokens.Color.feedbackDanger(colorScheme),
                        lineWidth: 1
                    )
            )
            if let errorMessage {
                // The text level, not the fill level: `feedback-danger` is
                // 4.18:1 on a card in the light theme.
                Text(errorMessage)
                    .font(.system(size: 12))
                    .foregroundStyle(CocsoTokens.Color.feedbackDangerText(colorScheme))
            }
        }
        .opacity(isEnabled ? 1 : 0.4)
    }

    @ViewBuilder
    private var field: some View {
        // The secure entry is toggled rather than overlaid, so the system's
        // password autofill keeps working either way.
        if isSecure && !revealed {
            SecureField(placeholder, text: $text)
        } else {
            TextField(placeholder, text: $text)
        }
    }
}
