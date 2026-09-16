import SwiftUI

/**
 The minimum a finger can reliably hit.

 WCAG 2.2 SC 2.5.8 asks 24×24, which is what the web enforces. Apple's Human
 Interface Guidelines ask 44×44, and a phone is the case the stricter number was
 written for — a checkbox drawn at 16 points is a target either way, and the
 platform floor is the one that applies here.

 The visual box keeps the size the recipe gives it; only the hit area grows.
 */
public enum CCTouchTarget {
    public static let minimum: CGFloat = 44
}

extension View {
    /// Expands the tappable area to the platform minimum without resizing the
    /// drawn control.
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
