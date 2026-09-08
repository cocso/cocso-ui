import SwiftUI

/**
 A modal panel over a scrim.

 Values come from `CCDialogStyle.resolve`, generated from `dialog.recipe.ts`;
 the scrim, the shadow and the entrance are the web's `dialog.module.css`:
 `black-alpha-30`, `shadow-dialog`, and a fade-and-settle on the entrance curve.

 `CCDialogPanel` is the panel alone; present it with `.ccDialog(isPresented:)`
 on the view it should cover. It is
 drawn in place rather than through `.sheet` so the scrim and the panel arrive
 on the design system's curve, and so a tap on the scrim dismisses it the way
 the web's does.
 */
public struct CCDialogPanel<Actions: View>: View {
    private let title: String
    private let message: String?
    private let size: CCDialogSize
    private let onDismiss: (() -> Void)?
    private let actions: Actions

    @Environment(\.colorScheme) private var colorScheme
    // The brand the app set at its root. Tokens and resolvers take it so a
    // design-system view draws the same primary the app does.
    @Environment(\.cocsoBrand) private var brand

    public init(
        _ title: String,
        message: String? = nil,
        size: CCDialogSize = .medium,
        onDismiss: (() -> Void)? = nil,
        @ViewBuilder actions: () -> Actions
    ) {
        self.title = title
        self.message = message
        self.size = size
        self.onDismiss = onDismiss
        self.actions = actions()
    }

    public var body: some View {
        let style = CCDialogStyle.resolve(size: size, scheme: colorScheme, brand: brand)
        let radius = style.borderRadius ?? 0
        VStack(alignment: .leading, spacing: CocsoTokens.Spacing.s7) {
            HStack(alignment: .top) {
                CCTypography(title, type: .heading, size: .small)
                Spacer(minLength: CocsoTokens.Spacing.s5)
                if let onDismiss {
                    // The web's `DialogClose`: a 14pt cross, named for a screen reader.
                    Button(action: onDismiss) {
                        Image(systemName: "xmark")
                            .font(.system(size: 14, weight: .medium))
                            .foregroundStyle(CocsoTokens.Color.textSecondary(colorScheme, brand: brand))
                    }
                    .buttonStyle(.plain)
                    .ccMinimumTouchTarget()
                    .accessibilityLabel(CCStrings.close)
                }
            }
            if let message {
                CCTypography(message, type: .body, size: .medium)
            }
            actions
        }
        .padding(.top, style.paddingTop ?? 0)
        .padding(.bottom, style.paddingBottom ?? 0)
        .padding(.leading, style.paddingLeft ?? 0)
        .padding(.trailing, style.paddingRight ?? 0)
        // The recipe's width is a maximum — the web's `max-width`.
        .frame(maxWidth: style.width, alignment: .topLeading)
        .background(style.bgColor ?? CocsoTokens.Color.surfacePrimary(colorScheme, brand: brand))
        .clipShape(RoundedRectangle(cornerRadius: radius))
        .overlay(
            RoundedRectangle(cornerRadius: radius)
                .strokeBorder(
                    style.borderColor ?? CocsoTokens.Color.borderSecondary(colorScheme, brand: brand),
                    lineWidth: style.borderWidth ?? 1
                )
        )
        .ccShadow(CocsoTokens.Shadow.dialog(colorScheme))
        .accessibilityAddTraits(.isModal)
    }
}

extension View {
    /// Covers the view with a scrim and the dialog while `isPresented` is true.
    /// A tap on the scrim, or the close button, sets it false.
    public func ccDialog<Actions: View>(
        isPresented: Binding<Bool>,
        _ title: String,
        message: String? = nil,
        size: CCDialogSize = .medium,
        @ViewBuilder actions: @escaping () -> Actions
    ) -> some View {
        modifier(
            DialogPresenter(
                isPresented: isPresented,
                title: title,
                message: message,
                size: size,
                actions: actions
            )
        )
    }
}

private struct DialogPresenter<Actions: View>: ViewModifier {
    @Binding var isPresented: Bool
    let title: String
    let message: String?
    let size: CCDialogSize
    let actions: () -> Actions

    @Environment(\.accessibilityReduceMotion) private var reduceMotion

    func body(content: Content) -> some View {
        ZStack {
            content
            if isPresented {
                // The web's `.overlay`: `black-alpha-30`, a raw alpha on purpose —
                // a scrim stays black in both themes.
                CocsoTokens.Color.blackAlpha30
                    .ignoresSafeArea()
                    .onTapGesture { isPresented = false }
                    .transition(.opacity)
                    .accessibilityHidden(true)
                CCDialogPanel(title, message: message, size: size, onDismiss: { isPresented = false }, actions: actions)
                    .padding(CocsoTokens.Spacing.s9)
                    // The web's `content-show`: fade in from 0.995, settling up.
                    .transition(.scale(scale: 0.98).combined(with: .opacity))
            }
        }
        .animation(CCMotion.entrance(reduced: reduceMotion), value: isPresented)
    }
}

#if DEBUG
#Preview {
    Text("Behind")
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .ccDialog(isPresented: .constant(true), "Delete this record?", message: "This cannot be undone.") {
            HStack {
                CCButton("Cancel", variant: .secondary) {}
                CCButton("Delete", variant: .error) {}
            }
        }
}
#endif
