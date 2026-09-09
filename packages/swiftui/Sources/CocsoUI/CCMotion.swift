import SwiftUI

/**
 The animations the views share, built from the motion tokens.

 The web transitions a colour with `duration-fast` + `easing-default`, moves a
 switch thumb with `duration-fast` + `easing-soft`, fills a progress bar with
 `duration-normal` + `easing-soft`, and brings things in on `easing-entrance`.
 The same four here, so a control on iOS travels on the curve the web's does
 rather than on a duration each view picked for itself — which is what the
 spinner's `0.8` and the skeleton's `1` were.

 Every one returns `nil` under Reduce Motion. The web sets `transition: none`
 there, and motion in every view is decoration: each reads the same without it.
 */
public enum CCMotion {
    /// A colour or opacity change — a pressed fill, a border, a dimmed control.
    public static func colour(reduced: Bool) -> Animation? {
        reduced ? nil : CocsoTokens.Easing.default(CocsoTokens.Duration.fast)
    }

    /// Something that moves a short way — a switch thumb, a pressed scale.
    public static func movement(reduced: Bool) -> Animation? {
        reduced ? nil : CocsoTokens.Easing.soft(CocsoTokens.Duration.fast)
    }

    /// A value that fills — the progress bar's width.
    public static func fill(reduced: Bool) -> Animation? {
        reduced ? nil : CocsoTokens.Easing.soft(CocsoTokens.Duration.normal)
    }

    /// Something arriving or leaving — an error message, a checkbox glyph.
    public static func entrance(reduced: Bool) -> Animation? {
        reduced ? nil : CocsoTokens.Easing.entrance(CocsoTokens.Duration.slow)
    }

    /// The scale a touchable shrinks to while pressed. The web has no
    /// equivalent — a pointer does not press — so it is small enough to be
    /// felt rather than seen.
    public static let pressedScale: CGFloat = 0.97

    /// The opacity a pressable without recipe colours dips to while pressed —
    /// a row, a tile, an icon. Deep enough to be seen on any fill, shallow
    /// enough that the content stays readable for the moment it lasts.
    public static let pressedOpacity: Double = 0.72
}
