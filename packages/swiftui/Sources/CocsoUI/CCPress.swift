import SwiftUI

/**
 The press every touchable in the system gives back.

 A finger on a control should see the control answer. `CCButton` answers with
 the recipe's pressed colours and a small scale; a row, a tile or an icon has no
 recipe colours to change, so it answers with the same scale and a dip in
 opacity. Both come from `CCMotion`, so the whole system presses the same way
 and on the same curve as the web's `:active`. The mobile app kept a copy of
 this (`CCPressStyle`, `ccPressable`) with its own numbers; this is the one it
 deletes.

 Built on `Button`, so the system handles what a hand-rolled gesture had to —
 a press that turns into a scroll is cancelled, and the row stays a button to a
 screen reader.
 */
public struct CCPressStyle: ButtonStyle {
    @Environment(\.accessibilityReduceMotion) private var reduceMotion

    public init() {}

    public func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .scaleEffect(configuration.isPressed ? CCMotion.pressedScale : 1)
            .opacity(configuration.isPressed ? CCMotion.pressedOpacity : 1)
            .animation(CCMotion.movement(reduced: reduceMotion), value: configuration.isPressed)
    }
}

extension View {
    /// Makes the view a pressable control: `action` on release, the system's
    /// press feedback while held, cancelled if the finger scrolls instead.
    public func ccPressable(action: @escaping () -> Void) -> some View {
        Button(action: action) { self }
            .buttonStyle(CCPressStyle())
            .contentShape(Rectangle())
    }
}
