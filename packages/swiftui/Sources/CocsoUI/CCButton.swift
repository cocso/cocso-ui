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
    private let action: () -> Void

    @Environment(\.colorScheme) private var colorScheme
    @Environment(\.isEnabled) private var isEnabled

    public init(
        _ title: String,
        variant: CCButtonVariant = .primary,
        size: CCButtonSize = .medium,
        shape: CCButtonShape = .square,
        align: CCButtonAlign = .center,
        loading: Bool = false,
        action: @escaping () -> Void
    ) {
        self.title = title
        self.variant = variant
        self.size = size
        self.shape = shape
        self.align = align
        self.loading = loading
        self.action = action
    }

    private var style: CCButtonStyle {
        CCButtonStyle.resolve(
            variant: variant,
            size: size,
            shape: shape,
            align: align,
            scheme: colorScheme
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
                Text(title)
                    .font(.system(size: resolved.fontSize ?? 14))
                    .opacity(loading ? 0 : 1)
                if loading {
                    ProgressView()
                        .controlSize(.small)
                }
            }
            .frame(maxWidth: .infinity, alignment: alignment)
            .padding(.horizontal, resolved.paddingInline ?? 0)
            .frame(height: resolved.height)
        }
        .buttonStyle(.plain)
        .foregroundStyle(resolved.fontColor ?? CocsoTokens.Color.textPrimary(colorScheme))
        .background(resolved.bgColor ?? .clear)
        .clipShape(RoundedRectangle(cornerRadius: resolved.borderRadius ?? 0))
        // WCAG 1.4.3 exempts an inactive control, and the web dims a disabled
        // button the same way rather than restating every variant.
        .opacity(isEnabled ? 1 : 0.4)
        .accessibilityLabel(title)
        .accessibilityAddTraits(.isButton)
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
    }
    .padding()
}
#endif
