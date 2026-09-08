import SwiftUI

/**
 A token shadow, drawn.

 The web's `box-shadow` is a list of layers, and the tokens carry it that way:
 `CocsoTokens.Shadow.card(scheme)` is two layers, a tight one and a soft one.
 SwiftUI's `.shadow` draws one, so this applies each in turn. The CSS blur is a
 diameter and SwiftUI's `radius` a sigma, so each is halved; `spread` has no
 SwiftUI equivalent and every token here writes `0`.

 Until the tokens carried shadows the elevated card was a flat rectangle on
 both platforms — the one variant whose whole meaning is its shadow.
 */
extension View {
    public func ccShadow(_ layers: [CocsoShadowLayer]) -> some View {
        modifier(ShadowLayers(layers: layers))
    }
}

private struct ShadowLayers: ViewModifier {
    let layers: [CocsoShadowLayer]

    func body(content: Content) -> some View {
        layers.reduce(AnyView(content)) { view, layer in
            AnyView(view.shadow(color: layer.color, radius: layer.blur / 2, x: layer.x, y: layer.y))
        }
    }
}
