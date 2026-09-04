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
            .foregroundStyle(CocsoTokens.Color.textPrimary(colorScheme))
    }
}
