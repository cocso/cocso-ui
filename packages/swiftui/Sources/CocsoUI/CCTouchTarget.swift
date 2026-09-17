import SwiftUI

/**
 The minimum a finger can reliably hit.

 WCAG 2.2 SC 2.5.8 asks 24×24, which is what the web enforces. Apple's Human
 Interface Guidelines ask 44×44, and a phone is the case the stricter number was
 written for — a checkbox drawn at 16 points is a target either way, and the
 platform floor is the one that applies here.

 What grows is the slot the control lays out in and the area that answers a
 tap. What is drawn keeps the recipe's size, centred in that slot — provided
 the modifier comes after the drawing. So a 36-point button takes a 44-point
 row, and the pill in it is still 36.

 **Apply it inside a `Button`'s (or `Menu`'s) label, never after the button.**
 A button is tapped where its label says it can be. Applied outside, the
 modifier still lays the button out at 44 but leaves the added strip dead:
 measured on an iOS 26 simulator, a tap 3 points inside the 44-point box of an
 outside-applied floor did nothing, while the same tap on an inside-applied one
 fired, and a tap on either glyph fired both. The close buttons of `CCAlert`
 and `CCDialog` and the reveal button of `CCInput` had it outside. The parity
 suite rejects that order now.
 */
public enum CCTouchTarget {
    public static let minimum: CGFloat = 44
}

extension View {
    /// Grows the layout slot and the tappable area to the platform minimum,
    /// centring what was drawn before it. Inside a button's label — see
    /// `CCTouchTarget`.
    ///
    /// Public because an app builds controls the design system does not have —
    /// an empty state's action, a row that is its own button — and the floor
    /// they have to clear is this one, not a number they pick again.
    public func ccMinimumTouchTarget() -> some View {
        frame(
            minWidth: CCTouchTarget.minimum,
            minHeight: CCTouchTarget.minimum
        )
        .contentShape(Rectangle())
    }
}
