import SwiftUI

/// Text at a role from the type scale. Values come from `typography.recipe.ts`.
public struct CCTypography: View {
    private let text: String
    private let type: CCTypographyType
    private let size: CCTypographySize

    @Environment(\.colorScheme) private var colorScheme

    public init(
        _ text: String,
        type: CCTypographyType = .body,
        size: CCTypographySize = .medium
    ) {
        self.text = text
        self.type = type
        self.size = size
    }

    public var body: some View {
        let style = CCTypographyStyle.resolve(type: type, size: size, scheme: colorScheme)
        Text(text)
            .font(.system(size: style.fontSize ?? 14, weight: style.fontWeight ?? .regular))
            // Compose 와 같은 이유로 토큰을 쓴다. SwiftUI 의 기본 `.primary` 는
            // 테마를 따라가지만 순수 흑백이라 토큰과 미묘하게 다르고, 두 플랫폼이
            // 다른 규칙을 따르게 된다.
            .foregroundStyle(CocsoTokens.Color.textPrimary(colorScheme))
    }
}
