import SwiftUI

/**
 Text that goes somewhere.

 Values come from `CCLinkStyle.resolve`, generated from `link.recipe.ts`. The
 `inline` variant is underlined the way the web's is — a link inside running
 text needs more than colour to be found — and `current` takes the surrounding
 ink (`currentColor` on the web, which the generator leaves to the platform).
 */
public struct CCLink: View {
    private let title: String
    private let variant: CCLinkVariant
    private let action: () -> Void

    @Environment(\.colorScheme) private var colorScheme
    // The brand the app set at its root. Tokens and resolvers take it so a
    // design-system view draws the same primary the app does.
    @Environment(\.cocsoBrand) private var brand
    @Environment(\.isEnabled) private var isEnabled
    @Environment(\.accessibilityReduceMotion) private var reduceMotion
    @GestureState private var isPressed = false

    public init(_ title: String, variant: CCLinkVariant = .inline, action: @escaping () -> Void) {
        self.title = title
        self.variant = variant
        self.action = action
    }

    public var body: some View {
        let style = CCLinkStyle.resolve(variant: variant, scheme: colorScheme, brand: brand)
        Button(action: action) {
            Text(title)
                .underline(variant == .inline)
                // The web's `.current:hover { opacity: 0.7 }` — the press is the touch's hover.
                .opacity(isPressed ? 0.7 : 1)
                .ccMinimumTouchTarget()
        }
        .buttonStyle(.plain)
        .simultaneousGesture(
            DragGesture(minimumDistance: 0).updating($isPressed) { _, state, _ in state = true }
        )
        // `nil` is `currentColor`: the surrounding ink, which `.primary` follows.
        .foregroundStyle(style.color.map(AnyShapeStyle.init) ?? AnyShapeStyle(.primary))
        .animation(CCMotion.colour(reduced: reduceMotion), value: isPressed)
        .opacity(isEnabled ? 1 : 0.4)
        .accessibilityAddTraits(.isLink)
    }
}
