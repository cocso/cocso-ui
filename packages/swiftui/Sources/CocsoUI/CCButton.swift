import SwiftUI

/**
 A button.

 The values come from `CCButtonStyle.resolve`, which is generated from
 `button.recipe.ts` — the same recipe the web's CSS is generated from. Nothing
 here decides what a variant looks like, which is the point: adding one to the
 recipe adds it on all three platforms, and this file does not change.

 The props mirror `ButtonProps` on the web, minus the ones that are HTML
 (`render`, `svgOnly`) and plus nothing.
 */
public struct CCButton: View {
    private let title: String
    private let variant: CCButtonVariant
    private let size: CCButtonSize
    private let shape: CCButtonShape
    private let align: CCButtonAlign
    private let loading: Bool
    private let prefix: Image?
    private let suffix: Image?
    private let action: () -> Void

    @Environment(\.colorScheme) private var colorScheme
    // The brand the app set at its root. Tokens and resolvers take it so a
    // design-system view draws the same primary the app does.
    @Environment(\.cocsoBrand) private var brand
    @Environment(\.isEnabled) private var isEnabled
    @Environment(\.accessibilityReduceMotion) private var reduceMotion
    // 웹의 `.button:focus-visible` 과 같은 링. 키보드가 있는 곳이면 2.4.7 이
    // 적용되고, iPad 에는 있다.
    @FocusState private var isFocused: Bool
    // 웹의 `.button:active`. 레시피가 variant 마다 눌림 색을 정하고, 여기서
    // 정하지 않는다.
    @GestureState private var isPressed = false

    public init(
        _ title: String,
        variant: CCButtonVariant = .primary,
        size: CCButtonSize = .medium,
        shape: CCButtonShape = .square,
        align: CCButtonAlign = .center,
        loading: Bool = false,
        prefix: Image? = nil,
        suffix: Image? = nil,
        action: @escaping () -> Void
    ) {
        self.title = title
        self.variant = variant
        self.size = size
        self.shape = shape
        self.align = align
        self.loading = loading
        self.prefix = prefix
        self.suffix = suffix
        self.action = action
    }

    private var style: CCButtonStyle {
        CCButtonStyle.resolve(
            variant: variant,
            size: size,
            shape: shape,
            align: align,
            scheme: colorScheme, brand: brand
        )
    }

    private var alignment: Alignment {
        // The recipe's three: `between` spreads content in CSS, which has no
        // single alignment here — it maps to leading, and a caller wanting the
        // spread lays it out itself.
        switch align {
        case .start, .between: return .leading
        case .center: return .center
        }
    }

    public var body: some View {
        let resolved = style
        Button(action: {
            // A loading button is still enabled — it is working, not
            // unavailable — so the tap is swallowed here rather than by
            // disabling, which would also drop it out of the tab order.
            guard !loading else { return }
            action()
        }) {
            ZStack {
                // The web's `prefix` / `suffix`: an icon either side of the label,
                // at the label's size, in the label's colour.
                HStack(spacing: CocsoTokens.Spacing.s4) {
                    prefix?.font(.system(size: resolved.fontSize ?? 14, weight: .medium))
                    Text(title)
                        .font(.system(size: resolved.fontSize ?? 14))
                    suffix?.font(.system(size: resolved.fontSize ?? 14, weight: .medium))
                }
                // The recipe pads the label inside the button as well as
                // the button itself; dropping it made every button narrower
                // than the web's by the difference.
                .padding(.horizontal, resolved.contentPaddingX ?? 0)
                .padding(.vertical, resolved.contentPaddingY ?? 0)
                .opacity(loading ? 0 : 1)
                if loading {
                    ProgressView()
                        .controlSize(.small)
                        .transition(.opacity)
                }
            }
            // The label fades and the indicator fades in over it, rather than
            // swapping on one frame.
            .animation(CCMotion.colour(reduced: reduceMotion), value: loading)
            .frame(maxWidth: .infinity, alignment: alignment)
            .padding(.horizontal, resolved.paddingInline ?? 0)
            .frame(height: resolved.height)
        }
        .buttonStyle(.plain)
        .simultaneousGesture(
            DragGesture(minimumDistance: 0).updating($isPressed) { _, state, _ in
                state = true
            }
        )
        .focused($isFocused)
        .foregroundStyle(
            (isPressed ? resolved.fontColorPressed : nil)
                ?? resolved.fontColor
                ?? CocsoTokens.Color.textPrimary(colorScheme, brand: brand)
        )
        // Glass is the system's pane (Liquid Glass on iOS 26, material before)
        // with the recipe's tint, pressed tint included — see `GlassPane`. Every
        // other variant is a plain fill.
        .background {
            let fill = (isPressed ? resolved.bgColorPressed : nil) ?? resolved.bgColor ?? .clear
            if variant == .glass {
                GlassPane(
                    shape: resolved.borderRadiusFull == true
                        ? AnyShape(Capsule())
                        : AnyShape(RoundedRectangle(cornerRadius: resolved.borderRadius ?? 0)),
                    edge: false,
                    tint: fill
                )
            } else {
                fill
            }
        }
        .clipShape(
            // `shape: .circle` is a percentage radius in the recipe, which has
            // no length to travel as; before it arrived as a flag this drew a
            // square.
            resolved.borderRadiusFull == true
                ? AnyShape(Capsule())
                : AnyShape(RoundedRectangle(cornerRadius: resolved.borderRadius ?? 0))
        )
        // The recipe's border — the outline variant. Until the generator carried
        // compound borders this variant had no edge on either platform.
        .overlay(recipeBorder(resolved))
        .overlay(
            RoundedRectangle(cornerRadius: (resolved.borderRadius ?? 0) + 2)
                .strokeBorder(
                    CocsoTokens.Color.focusRing(colorScheme, brand: brand),
                    lineWidth: isFocused ? 2 : 0
                )
                .padding(-2)
        )
        // The pressed colours arrive on the web's curve (`duration-fast`,
        // `easing-default`) rather than on the frame the finger lands, and the
        // button gives a little under it — the one thing a touch has that a
        // pointer does not.
        .animation(CCMotion.colour(reduced: reduceMotion), value: isPressed)
        .scaleEffect(isPressed ? CCMotion.pressedScale : 1)
        .animation(CCMotion.movement(reduced: reduceMotion), value: isPressed)
        // WCAG 1.4.3 exempts an inactive control, and the web dims a disabled
        // button the same way rather than restating every variant.
        .opacity(isEnabled ? 1 : 0.4)
        .animation(CCMotion.colour(reduced: reduceMotion), value: isEnabled)
        .accessibilityLabel(title)
        .accessibilityAddTraits(.isButton)
    }

    /// `AnyShape` is not `InsettableShape`, so `strokeBorder` has to be called on
    /// the concrete shape — and keeping it out of `body` keeps the type-checker
    /// inside its time budget. Nothing when the variant has no border.
    @ViewBuilder
    private func recipeBorder(_ style: CCButtonStyle) -> some View {
        if let color = style.borderColor {
            if style.borderRadiusFull == true {
                Capsule().strokeBorder(color, lineWidth: style.borderWidth ?? 1)
            } else {
                RoundedRectangle(cornerRadius: style.borderRadius ?? 0)
                    .strokeBorder(color, lineWidth: style.borderWidth ?? 1)
            }
        }
    }
}

#if DEBUG
#Preview {
    VStack(spacing: 12) {
        CCButton("Primary") {}
        CCButton("Secondary", variant: .secondary) {}
        CCButton("Outline", variant: .outline) {}
        CCButton("Loading", loading: true) {}
        CCButton("Disabled") {}.disabled(true)
        CCButton("Glass", variant: .glass, shape: .rounded) {}
        CCButton("Add", variant: .outline, prefix: Image(systemName: "plus")) {}
    }
    .padding()
    .background(LinearGradient(colors: [.blue, .green], startPoint: .topLeading, endPoint: .bottomTrailing))
}
#endif
