import SwiftUI

/**
 A glass surface: what scrolls beneath it shows through, blurred.

 Glass is for the layers that float over content and stay put while it moves —
 a tab bar, a navigation bar, a floating card over a photo. The blur is the
 platform's (`Material`); the tint is `surface-glass` and the edge is
 `border-glass`, so the pane is the same tone on every platform and in both
 themes even where a platform cannot blur.

 The tint is opaque enough that `text-primary` clears AA on it over any
 backdrop — see the token. Lighter glass would be prettier over a light photo
 and unreadable over a dark one, and a tab bar cannot choose its photo.
 */
public enum CCGlassEdge: Sendable {
    /// A bar along the top of the screen — a navigation or a title bar.
    case top
    /// A bar along the bottom — a tab bar, a toolbar.
    case bottom
}

extension View {
    /// Glass filling the view's bounds, extending under the safe area the way a
    /// bar's background should. For a floating shape use `ccGlass(in:)`.
    public func ccGlass() -> some View {
        background { GlassPane(shape: Rectangle(), edge: false).ignoresSafeArea() }
    }

    /// Glass clipped to a shape — a floating pill or a card over a photo.
    public func ccGlass<S: InsettableShape>(in shape: S) -> some View {
        background { GlassPane(shape: shape, edge: true) }
    }
}

/**
 The pane itself: what every glass surface in the system is made of.

 On iOS 26 and macOS 26 it is the platform's Liquid Glass — `glassEffect`, which
 refracts and reflects what is beneath and answers the light around it — tinted
 with `surface-glass`. Before that it is `.ultraThinMaterial` under the same
 tint. The tint is the same on both, and that is the contrast promise: it is
 opaque enough that `text-primary` clears AA on the pane over any backdrop, and
 a tab bar cannot choose what scrolls beneath it. The mobile app drew its top
 bar and tab capsule on this and, on iOS 26, they read as a different material
 from the system's own; now they are the system's own.

 `CCCard` and `CCButton` draw their glass variants on this pane too, with the
 tint the recipe gives them, so one change here reaches every glass surface.
 */
struct GlassPane<S: Shape>: View {
    let shape: S
    /// A hairline in `border-glass` on the shape's edge. Bars draw their own
    /// on the inner edge instead; the recipe-backed views draw the recipe's.
    let edge: Bool
    var tint: SwiftUI.Color?

    @Environment(\.colorScheme) private var colorScheme
    @Environment(\.cocsoBrand) private var brand

    var body: some View {
        let fill = tint ?? CocsoTokens.Color.surfaceGlass(colorScheme, brand: brand)
        ZStack {
            if #available(iOS 26.0, macOS 26.0, *) {
                Color.clear.glassEffect(.regular.tint(fill), in: shape)
            } else {
                shape.fill(fill).background(.ultraThinMaterial, in: shape)
            }
            if edge {
                shape.stroke(CocsoTokens.Color.borderGlass(colorScheme, brand: brand), lineWidth: 1)
            }
        }
    }
}

/**
 A bar on glass — the surface a tab bar or a navigation bar sits on.

 Place it with `.safeAreaInset(edge: .bottom) { CCGlassBar { ... } }` and the
 glass runs under the home indicator while the content stays above it. The
 hairline sits on the inner edge, where the bar meets the content, so the pane
 has an edge the way a physical one does.

 The items are the app's — which tabs there are is not a design-system
 decision — and this is the surface they sit on, so every bar in every app on
 this system is the same glass.
 */
public struct CCGlassBar<Content: View>: View {
    private let edge: CCGlassEdge
    private let content: Content

    @Environment(\.colorScheme) private var colorScheme
    @Environment(\.cocsoBrand) private var brand

    public init(edge: CCGlassEdge = .bottom, @ViewBuilder content: () -> Content) {
        self.edge = edge
        self.content = content()
    }

    public var body: some View {
        content
            // 16 / 8: the inset a toolbar row has on the web.
            .padding(.horizontal, CocsoTokens.Spacing.s8)
            .padding(.vertical, CocsoTokens.Spacing.s5)
            .frame(maxWidth: .infinity)
            .overlay(alignment: edge == .bottom ? .top : .bottom) {
                Rectangle()
                    .fill(CocsoTokens.Color.borderGlass(colorScheme, brand: brand))
                    .frame(height: 1)
            }
            .ccGlass()
    }
}

#if DEBUG
#Preview {
    ZStack(alignment: .bottom) {
        LinearGradient(colors: [.blue, .green], startPoint: .topLeading, endPoint: .bottomTrailing)
            .ignoresSafeArea()
        VStack(spacing: 16) {
            CCCard(variant: .glass) { Text("Glass card") }
            Text("Pill").padding(.horizontal, 16).padding(.vertical, 8).ccGlass(in: Capsule())
        }
        .padding()
        CCGlassBar {
            HStack {
                Spacer(); Text("Home"); Spacer(); Text("Search"); Spacer(); Text("Me"); Spacer()
            }
        }
    }
}
#endif
