import SwiftUI

/**
 The minimum a finger can reliably hit.

 WCAG 2.2 SC 2.5.8 asks 24×24, which is what the web enforces. Apple's Human
 Interface Guidelines ask 44×44, and a phone is the case the stricter number was
 written for — a checkbox drawn at 16 points is a target either way, and the
 platform floor is the one that applies here.

 The visual box keeps the size the recipe gives it; only the hit area grows.
 */
enum CCTouchTarget {
    static let minimum: CGFloat = 44
}

extension View {
    /// Expands the tappable area to the platform minimum without resizing the
    /// drawn control.
    func ccMinimumTouchTarget() -> some View {
        frame(
            minWidth: CCTouchTarget.minimum,
            minHeight: CCTouchTarget.minimum
        )
        .contentShape(Rectangle())
    }
}
