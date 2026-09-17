import SwiftUI

/// Text at a role from the type scale. Values come from `typography.recipe.ts`.
public struct CCTypography: View {
    private let text: String
    private let type: CCTypographyType
    private let size: CCTypographySize
    private let color: SwiftUI.Color?

    @Environment(\.colorScheme) private var colorScheme
    // The brand the app set at its root. Tokens and resolvers take it so a
    // design-system view draws the same primary the app does.
    @Environment(\.cocsoBrand) private var brand

    public init(
        _ text: String,
        type: CCTypographyType = .body,
        size: CCTypographySize = .medium,
        // The web's `color` prop; `nil` is the default ink.
        color: SwiftUI.Color? = nil
    ) {
        self.text = text
        self.type = type
        self.size = size
        self.color = color
    }

    public var body: some View {
        let style = CCTypographyStyle.resolve(type: type, size: size, scheme: colorScheme, brand: brand)
        Text(text)
            .ccFont(size: style.fontSize ?? 14, weight: style.fontWeight ?? .regular)
            // Compose 와 같은 이유로 토큰을 쓴다. SwiftUI 의 기본 `.primary` 는
            // 테마를 따라가지만 순수 흑백이라 토큰과 미묘하게 다르고, 두 플랫폼이
            // 다른 규칙을 따르게 된다.
            .foregroundStyle(color ?? CocsoTokens.Color.textPrimary(colorScheme, brand: brand))
    }
}

/**
 How big the system says text should be, up to a ceiling.

 The recipes give a size in points — the web's pixels. Drawn as
 `.system(size:)` it stayed that size whatever the reader had set in Settings,
 while Compose, whose sizes are `sp`, grew with the system. This scales the
 recipe's size the way the app scales its own text, so a label in a design-
 system button and a label beside it grow together.

 The scale is `UIFontMetrics.default`'s — body-relative, which is what
 `@ScaledMetric(relativeTo: .body)` reads. Measured on an iOS 26 simulator
 against the app's method (the environment's size, turned into traits, into
 `UIFontMetrics.default.scaledValue(for:compatibleWith:)`): identical at every
 size from `xSmall` to `accessibility5`, for 11, 12, 14, 16 and 20 points. It
 reads the SwiftUI environment rather than UIKit's, so a snapshot host and the
 running app agree, and so does `.dynamicTypeSize(_:)`.

 **The ceiling is `accessibility1`**, the app's. Past it a 14-point label is
 30 points and more, and controls with a fixed shape — a 32-point page square,
 a switch's track — can no longer hold their text. A caller can lower it with
 `.dynamicTypeSize(_:)`; this does not raise it.

 macOS has no Dynamic Type, so there the size is the recipe's.
 */
enum CCTypeScale {
    static let ceiling: DynamicTypeSize = .accessibility1
}

private struct CCScaledFont: ViewModifier {
    @ScaledMetric private var size: CGFloat
    private let weight: Font.Weight

    init(size: CGFloat, weight: Font.Weight) {
        _size = ScaledMetric(wrappedValue: size, relativeTo: .body)
        self.weight = weight
    }

    func body(content: Content) -> some View {
        content.font(.system(size: size, weight: weight))
    }
}

extension View {
    /// The recipe's size and weight, scaled for Dynamic Type up to
    /// `CCTypeScale.ceiling`. Use it for any text or text-like glyph a view
    /// draws; the exceptions are text inside a fixed graphic (an avatar's
    /// initials, a checkbox's tick), which must fit the shape it is drawn in.
    func ccFont(size: CGFloat, weight: Font.Weight = .regular) -> some View {
        // The clamp wraps the modifier, so the `@ScaledMetric` inside it reads
        // the clamped size.
        modifier(CCScaledFont(size: size, weight: weight))
            .dynamicTypeSize(...CCTypeScale.ceiling)
    }
}
