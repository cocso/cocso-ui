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

private struct GlassUsesMaterialKey: EnvironmentKey {
    static let defaultValue = false
}

public extension EnvironmentValues {
    /// Draw glass as the material fallback even where Liquid Glass is available.
    ///
    /// For offscreen renders. `glassEffect` is composited, and an offscreen
    /// `cacheDisplay` / `swift-snapshot-testing` render does not capture it —
    /// worse, the layout around it collapses, so a snapshot of a screen with a
    /// glass bar came back as the bar drawn twice and the body gone. A snapshot
    /// harness sets this once and keeps checking the screen's layout, colours
    /// and composition; the material itself is verified on a device or a
    /// simulator, which is the only place it draws.
    var cocsoGlassUsesMaterial: Bool {
        get { self[GlassUsesMaterialKey.self] }
        set { self[GlassUsesMaterialKey.self] = newValue }
    }
}

extension View {
    /// Glass filling the view's bounds, extending under the safe area the way a
    /// bar's background should. For a floating shape use `ccGlass(in:)`.
    public func ccGlass() -> some View {
        background { GlassPane(shape: Rectangle(), edge: false).ignoresSafeArea() }
    }

    /// Glass clipped to a shape — a floating pill or a card over a photo.
    /// `interactive` makes the glass answer a press the way the system's
    /// controls do; give it to a control, not to a surface.
    public func ccGlass<S: InsettableShape>(in shape: S, interactive: Bool = false) -> some View {
        background { GlassPane(shape: shape, edge: true, interactive: interactive) }
    }
}

/**
 Several glass pieces side by side — a menu circle beside an action circle.

 A row, deliberately not a `GlassEffectContainer`. The container renders its
 descendants' glass as one layer and, with the pane drawn behind the content
 as `GlassPane` does, that layer came out over the content: the icons on the
 mobile app's circles went faint as if behind the glass. The merging animation
 the container gives up is cosmetic; legible icons are not. Same API as the
 Compose row, so a bar built from pieces is written once.
 */
public struct CCGlassGroup<Content: View>: View {
    private let spacing: CGFloat?
    private let content: Content

    public init(spacing: CGFloat? = nil, @ViewBuilder content: () -> Content) {
        self.spacing = spacing
        self.content = content()
    }

    public var body: some View {
        HStack(spacing: spacing ?? CocsoTokens.Spacing.s5) { content }
    }
}

/**
 The pane itself: what every glass surface in the system is made of.

 On iOS 26 and macOS 26 it is the platform's Liquid Glass — `glassEffect`,
 which refracts what is beneath, answers the light around it, and reads that
 backdrop to keep what sits on it legible, switching itself between a light and
 a dark pane. It is tinted with `surface-glass-liquid`, a third of the material's tint, and
 has no hairline: the first cut laid `surface-glass` over it, and a tint sized
 to carry contrast on its own covered the refraction and left a flat plate (the
 mobile app's menu circle read as a plain grey disc). Untinted, the glass keeps
 `text-primary` at 15:1 / 10:1 in the light scheme but only 4.8:1 in the dark
 scheme over a bright backdrop; the light tint lifts that to 6.4:1 and better
 while the refraction stays visible. Measured on an iOS 26 simulator.

 Before iOS 26 it is `.ultraThinMaterial` under the `surface-glass` tint with a
 `border-glass` hairline; there the tint is what makes the contrast, and the
 tokens are sized for that.

 The glass is drawn behind the content, on a clear pane, rather than applied
 to the content itself. Applied to the content, Liquid Glass reads the label
 as part of what it must stay legible against and, over a bright backdrop in
 the dark scheme, turns light while the token text stays near-white — 1.6:1.
 Behind the content it keeps the scheme's pane, 6:1 and better.

 `CCCard` and `CCButton` draw their glass variants on this pane too, with the
 tint the recipe gives them for the material path, so one change here reaches
 every glass surface.
 */
struct GlassPane<S: Shape>: View {
    let shape: S
    /// A hairline in `border-glass` on the shape's edge, on the material path.
    /// Bars draw their own on the inner edge instead; the recipe-backed views
    /// draw the recipe's. Liquid Glass draws its own rim.
    let edge: Bool
    /// Liquid Glass that answers a press. For controls.
    var interactive: Bool = false
    /// The material path's tint; the Liquid path takes `surface-glass-liquid`.
    var tint: SwiftUI.Color?

    @Environment(\.colorScheme) private var colorScheme
    @Environment(\.cocsoBrand) private var brand
    @Environment(\.cocsoGlassUsesMaterial) private var usesMaterial

    var body: some View {
        if #available(iOS 26.0, macOS 26.0, *), !usesMaterial {
            let glass = Glass.regular.tint(CocsoTokens.Color.surfaceGlassLiquid(colorScheme, brand: brand))
            Color.clear.glassEffect(interactive ? glass.interactive() : glass, in: shape)
        } else {
            let fill = tint ?? CocsoTokens.Color.surfaceGlass(colorScheme, brand: brand)
            ZStack {
                shape.fill(fill).background(.ultraThinMaterial, in: shape)
                if edge {
                    shape.stroke(CocsoTokens.Color.borderGlass(colorScheme, brand: brand), lineWidth: 1)
                }
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
