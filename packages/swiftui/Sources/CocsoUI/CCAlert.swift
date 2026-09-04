import SwiftUI

/**
 A status message.

 Values come from `CCAlertStyle.resolve`, generated from `alert.recipe.ts`.
 The border the recipe declares is a composite that does not cross as a single
 value, so its colour is used with a one-point stroke — the width the web draws.
 */
public struct CCAlert: View {
    private let title: String
    private let message: String?
    private let variant: CCAlertVariant

    @Environment(\.colorScheme) private var colorScheme

    public init(
        _ title: String,
        message: String? = nil,
        variant: CCAlertVariant = .info
    ) {
        self.title = title
        self.message = message
        self.variant = variant
    }

    public var body: some View {
        let style = CCAlertStyle.resolve(variant: variant, scheme: colorScheme)
        let radius = style.borderRadius ?? 0
        VStack(alignment: .leading, spacing: CocsoTokens.Spacing.s3) {
            Text(title)
                .font(.system(size: style.fontSize ?? 14, weight: .semibold))
            if let message {
                Text(message)
                    .font(.system(size: style.fontSize ?? 14))
            }
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .foregroundStyle(style.fontColor ?? CocsoTokens.Color.textPrimary(colorScheme))
        .padding(.horizontal, style.paddingX ?? 0)
        .padding(.vertical, style.paddingY ?? 0)
        .background(style.bgColor ?? .clear)
        .clipShape(RoundedRectangle(cornerRadius: radius))
        .overlay(
            RoundedRectangle(cornerRadius: radius)
                .strokeBorder(style.borderColor ?? .clear, lineWidth: 1)
        )
        .accessibilityElement(children: .combine)
    }
}

#if DEBUG
#Preview {
    VStack {
        CCAlert("정보", message: "안내 문구입니다.")
        CCAlert("완료", variant: .success)
        CCAlert("오류", variant: .error)
    }
    .padding()
}
#endif
