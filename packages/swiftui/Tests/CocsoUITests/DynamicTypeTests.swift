#if canImport(UIKit)
import SwiftUI
import UIKit
import XCTest

@testable import CocsoUI

/**
 The design system's text, at the reader's size.

 Dynamic Type only exists on iOS — on macOS `@ScaledMetric` returns what it was
 given — so this is the one suite that runs in a simulator. It measures what a
 view lays out at a Dynamic Type size, which is the only way to tell a label
 that scales from one that says it does.
 */
@MainActor
final class DynamicTypeTests: XCTestCase {
    private func size(_ view: some View, at dynamicType: DynamicTypeSize) -> CGSize {
        let host = UIHostingController(rootView: view.environment(\.dynamicTypeSize, dynamicType))
        return host.sizeThatFits(in: CGSize(width: 1000, height: 1000))
    }

    /// Views whose width follows their text.
    private var hugging: [(String, AnyView)] {
        [
            ("CCTypography", AnyView(CCTypography("Scaled label"))),
            ("CCButton", AnyView(CCButton("Scaled label") {}.fixedSize())),
            ("CCBadge", AnyView(CCBadge("Scaled label"))),
            // Not `CCLink`: it has no size of its own and takes the font of the
            // text it sits in, as the web's link does, so its ceiling is the
            // caller's.
        ]
    }

    func testTextGrowsWithTheReadersSize() {
        for (name, view) in hugging {
            let base = size(view, at: .large)
            let larger = size(view, at: .xxxLarge)
            XCTAssertGreaterThan(larger.width, base.width, "\(name) is \(base.width) wide at large and \(larger.width) at xxxLarge")
        }
    }

    func testTextStopsAtTheCeiling() {
        for (name, view) in hugging {
            let ceiling = size(view, at: CCTypeScale.ceiling)
            let beyond = size(view, at: .accessibility5)
            XCTAssertEqual(beyond.width, ceiling.width, accuracy: 0.5, "\(name) grows past the ceiling")
            XCTAssertGreaterThan(ceiling.width, size(view, at: .large).width, "\(name) does not reach the ceiling")
        }
    }

    func testTheDefaultSizeIsTheRecipesSize() {
        // `large` is the size nobody has changed; there the scaled label must be
        // the recipe's point size exactly, or every snapshot moves.
        let style = CCTypographyStyle.resolve(type: .body, size: .medium, scheme: .light)
        let scaled = size(CCTypography("Scaled label"), at: .large)
        let fixed = size(
            Text("Scaled label").font(.system(size: style.fontSize ?? 0, weight: style.fontWeight ?? .regular)),
            at: .large
        )
        XCTAssertEqual(scaled.width, fixed.width, accuracy: 0.01)
        XCTAssertEqual(scaled.height, fixed.height, accuracy: 0.01)
    }

    func testAButtonGrowsAroundItsLabelInsteadOfClippingIt() {
        // Below the ceiling nothing a recipe sets is taller than its control,
        // so the only way to see the floor is a label that is. A long label in
        // a narrow button wraps to two lines.
        let view = CCButton("A label long enough to need a second line at this size", size: .xSmall) {}
            .frame(width: 120)
        let height = size(view, at: .xxxLarge).height
        XCTAssertGreaterThan(height, CCTouchTarget.minimum, "the button stayed \(height) tall around a two-line label")
    }
}
#endif
