#if canImport(AppKit)
import AppKit
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

 There is no pixel reference here — see `render` for why. Each component is
 drawn alone and checked for ink, which is deterministic across machines and
 catches the failure a reference cannot on its first run: a component that was
 never visible.
 */
final class ComponentRenderTests: XCTestCase {
    /// 열두 개를 한 화면에 그려 그 전체에 잉크가 있는지 본다.
    ///
    /// 여기엔 픽셀 참조가 없다. macOS 는 SwiftUI·SF Pro·힌팅 버전에 따라
    /// 기계마다 다르게 그려서, 한 곳에서 기록한 참조가 다른 곳에서 틀린다 —
    /// 지각 허용치 0.9 로도 CI 러너와 개발 머신 사이의 차이가 넘쳤다.
    /// Robolectric 은 결정론적이라 Compose 쪽은 골든을 갖고, iOS 쪽은 그 대신
    /// 결정론적인 것만 검사한다: 그려졌는가. 모양의 변화를 잡는 일은 Compose
    /// 골든과 웹의 Visual Regression 이 맡는다.
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
        .frame(width: 320, height: 900, alignment: .topLeading)
        .background(
            CocsoTokens.Color.surfacePrimary(appearance == .darkAqua ? .dark : .light)
        )
        let controller = NSHostingController(rootView: view)
        controller.view.appearance = NSAppearance(named: appearance)
        controller.view.frame = CGRect(x: 0, y: 0, width: 320, height: 900)
        assertHasInk(controller.view, name: name)
    }

    /// A single-colour image means nothing was drawn.
    @MainActor
    private func assertHasInk(_ view: NSView, name: String) {
        guard let rep = view.bitmapImageRepForCachingDisplay(in: view.bounds) else {
            return XCTFail("\(name): 비트맵을 만들지 못했다")
        }
        view.cacheDisplay(in: view.bounds, to: rep)
        // 전해상도로 센다. 4픽셀 간격으로 샘플링하면 16pt 스피너가 정확히
        // 임계값에 걸린다 — 작은 컴포넌트가 큰 것과 같은 기준을 통과하려면
        // 픽셀을 다 봐야 한다. 사라진 라벨은 0 이고, 어떤 컴포넌트든 그려졌다면
        // 수백 픽셀은 넘는다.
        let first = rep.colorAt(x: 0, y: 0)
        var different = 0
        for x in 0..<rep.pixelsWide {
            for y in 0..<rep.pixelsHigh where rep.colorAt(x: x, y: y) != first {
                different += 1
            }
        }
        XCTAssertGreaterThan(different, 50, "\(name): 그려진 것이 없다 — 단색")
    }

    /// 컴포넌트 하나를 제 표면 위에 홀로 그려 잉크를 검사한다.
    ///
    /// 합쳐 그린 이미지의 잉크 검사는 전체가 단색일 때만 반응한다 — 버튼의
    /// 채움과 배지가 잉크를 주므로 라벨 하나가 사라져도 통과했다. 처음엔 픽셀
    /// 정확 참조가 그 회귀를 잡았는데, 기계마다 다른 macOS 렌더 때문에 참조에
    /// 허용치를 두자 그 가드도 사라졌다. 홀로 그리면 라벨이 그 컴포넌트의
    /// 잉크 전부이거나 대부분이라, 없어지면 단색에 가까워져 걸린다.
    @MainActor
    private func assertDraws(_ name: String, _ scheme: NSAppearance.Name, @ViewBuilder _ content: () -> some View) {
        // 높이까지 고정한다. 폭만 주면 내용 아래가 투명하게 남고, 그 투명
        // 픽셀이 "배경과 다른 픽셀" 로 세어져 라벨이 사라져도 통과했다 —
        // 위 `render` 에서 한 번 고친 실수를 여기서 다시 했다.
        let view = content()
            .padding(16)
            .frame(width: 320, height: 120, alignment: .topLeading)
            .background(CocsoTokens.Color.surfacePrimary(scheme == .darkAqua ? .dark : .light))
        let controller = NSHostingController(rootView: view)
        controller.view.appearance = NSAppearance(named: scheme)
        controller.view.frame = CGRect(x: 0, y: 0, width: 320, height: 120)
        assertHasInk(controller.view, name: "\(name)-\(scheme.rawValue)")
    }

    @MainActor
    private func eachComponentDraws(_ scheme: NSAppearance.Name) {
        assertDraws("typography", scheme) { CCTypography("Typography", type: .heading, size: .large) }
        assertDraws("button", scheme) { CCButton("Button") {} }
        assertDraws("badge", scheme) { CCBadge("Badge") }
        assertDraws("card", scheme) { CCCard { CCTypography("Card") } }
        assertDraws("alert", scheme) { CCAlert("Alert", message: "message") }
        assertDraws("avatar", scheme) { CCAvatar(initials: "CO", label: "코쏘") }
        assertDraws("progress", scheme) { CCProgress(value: 60) }
        assertDraws("spinner", scheme) { CCSpinner() }
        assertDraws("checkbox-on", scheme) { CCCheckbox(label: "Checkbox", status: .on) { _ in } }
        assertDraws("checkbox-off", scheme) { CCCheckbox(label: "Checkbox", status: .off) { _ in } }
        assertDraws("switch-on", scheme) { CCSwitch(label: "Switch", isOn: true) { _ in } }
        assertDraws("switch-off", scheme) { CCSwitch(label: "Switch", isOn: false) { _ in } }
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
        eachComponentDraws(.aqua)
        render("light", .aqua) { everything() }
    }

    @MainActor
    func testEveryComponentDrawsInDarkTheme() {
        eachComponentDraws(.darkAqua)
        render("dark", .darkAqua) { everything() }
    }
}
#endif
