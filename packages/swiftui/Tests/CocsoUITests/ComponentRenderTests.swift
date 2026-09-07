#if canImport(AppKit)
import AppKit
import SnapshotTesting
import SwiftUI
import XCTest

@testable import CocsoUI

/**
 The views, drawn.

 Everything else about this package is checked without drawing anything: the
 generators are compared to their sources, the two platforms are compared to
 each other, and the Swift is compiled. A view that compiles and draws nothing
 — or draws its label in the colour of its own background — passes all of that.
 `packages/compose` sees the same thing through Roborazzi; this is the half
 that was missing while the Compose half made the pair look covered.

 It renders on macOS rather than in a simulator, because `swift test` needs no
 device and the CI job for this package already runs on macOS. Nothing here
 touches UIKit, so the same SwiftUI draws either way — the metrics differ from
 an iPhone's, which is why the reference images are a change detector rather
 than a description of how iOS looks.

 The reference catches a change in appearance. The ink assertion catches what a
 reference cannot: the first run of a component that was never visible, since
 that run records whatever it is handed.
 */
final class ComponentRenderTests: XCTestCase {
    @MainActor
    private func render(
        _ name: String,
        _ appearance: NSAppearance.Name,
        @ViewBuilder _ content: () -> some View
    ) {
        let view = VStack(alignment: .leading, spacing: 12) {
            content()
        }
        .padding(16)
        // 높이까지 고정해야 배경이 이미지 전체를 채운다. 폭만 주면 내용 아래가
        // 투명하게 남아, 참조 이미지가 무엇 위에 그려진 것인지 알 수 없다 —
        // Compose 쪽 렌더 테스트와 같은 조건으로 맞춘다.
        .frame(width: 320, height: 900, alignment: .topLeading)
        .background(
            CocsoTokens.Color.surfacePrimary(appearance == .darkAqua ? .dark : .light)
        )

        let controller = NSHostingController(rootView: view)
        controller.view.appearance = NSAppearance(named: appearance)
        controller.view.frame = CGRect(x: 0, y: 0, width: 320, height: 900)

        assertSnapshot(of: controller, as: .image, named: name)
        assertHasInk(controller.view, name: name)
    }

    /// A single-colour image means nothing was drawn.
    @MainActor
    private func assertHasInk(_ view: NSView, name: String) {
        guard let rep = view.bitmapImageRepForCachingDisplay(in: view.bounds) else {
            return XCTFail("\(name): 비트맵을 만들지 못했다")
        }
        view.cacheDisplay(in: view.bounds, to: rep)
        let first = rep.colorAt(x: 0, y: 0)
        var different = 0
        for x in stride(from: 0, to: rep.pixelsWide, by: 4) {
            for y in stride(from: 0, to: rep.pixelsHigh, by: 4)
            where rep.colorAt(x: x, y: y) != first {
                different += 1
            }
        }
        XCTAssertGreaterThan(different, 20, "\(name): 그려진 것이 없다 — 단색")
    }

    @ViewBuilder
    private func everything() -> some View {
        CCTypography("Typography", type: .heading, size: .large)
        CCButton("Button") {}
        CCBadge("Badge")
        CCCard { CCTypography("Card") }
        CCAlert("Alert", message: "message")
        CCAvatar(initials: "CO", label: "코쏘")
        CCProgress(value: 60)
        CCSpinner()
        CCCheckbox(label: "Checkbox on", status: .on) { _ in }
        CCCheckbox(label: "Checkbox off", status: .off) { _ in }
        CCSwitch(label: "Switch on", isOn: true) { _ in }
        CCSwitch(label: "Switch off", isOn: false) { _ in }
    }

    @MainActor
    func testEveryComponentDrawsInLightTheme() {
        render("light", .aqua) { everything() }
    }

    @MainActor
    func testEveryComponentDrawsInDarkTheme() {
        render("dark", .darkAqua) { everything() }
    }
}
#endif
