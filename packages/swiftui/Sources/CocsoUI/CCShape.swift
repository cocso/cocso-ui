import SwiftUI

/**
 The rounded box a recipe's radius describes: circular corners, never more
 than half the short side.

 Two things differ from `RoundedRectangle(cornerRadius:)` and `Capsule()`, and
 both are why this exists.

 The corners are circular arcs. SwiftUI's default is `.continuous`, which the
 web does not draw — CSS `border-radius` is an arc — and which the offscreen
 renderer the app's snapshot tests use (`CALayer.render(in:)`) cannot stroke at
 pill radius: every outlined capsule came out with a short vertical bar at
 each end, in the goldens and nowhere else. `.circular` draws the same shape
 on screen and in the golden.

 The radius is clamped. The recipe's `radius-full` is a length (1000), so a
 badge 20 tall was asked for a 1000-point corner. Clamping to half the short
 side makes that a pill by definition rather than by whatever the rasterizer
 does with an impossible radius.
 */
struct CCRoundedShape: InsettableShape {
    var radius: CGFloat
    private var inset: CGFloat = 0

    init(radius: CGFloat) {
        self.radius = radius
    }

    /// A pill: the radius is always half the short side.
    static let pill = CCRoundedShape(radius: .greatestFiniteMagnitude)

    func path(in rect: CGRect) -> Path {
        let box = rect.insetBy(dx: inset, dy: inset)
        guard box.width > 0, box.height > 0 else { return Path() }
        let corner = max(0, min(radius - inset, min(box.width, box.height) / 2))
        return RoundedRectangle(cornerRadius: corner, style: .circular).path(in: box)
    }

    // Concentric, as `RoundedRectangle` is: the border drawn inside the edge
    // keeps the same centre for its arcs, so the radius shrinks with the inset.
    func inset(by amount: CGFloat) -> CCRoundedShape {
        var shape = self
        shape.inset += amount
        return shape
    }
}
