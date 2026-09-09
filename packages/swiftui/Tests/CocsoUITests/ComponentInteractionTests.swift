import SwiftUI
import ViewInspector
import XCTest

@testable import CocsoUI

/**
 The views, used — the SwiftUI half of `ComponentInteractionTest.kt`.

 `swift test` has no UI-test host to tap a view, so ViewInspector walks the
 view's body and fires the actions the way a finger would. The render tests
 say a control is drawn; these say it calls back.
 */
final class ComponentInteractionTests: XCTestCase {
    func testButtonCallsAction() throws {
        var taps = 0
        let view = CCButton("Save") { taps += 1 }
        try view.inspect().find(ViewType.Button.self).tap()
        XCTAssertEqual(taps, 1)
    }

    func testLoadingButtonSwallowsTheTap() throws {
        var taps = 0
        let view = CCButton("Save", loading: true) { taps += 1 }
        try view.inspect().find(ViewType.Button.self).tap()
        XCTAssertEqual(taps, 0)
    }

    func testCheckboxTogglesOn() throws {
        var status: CCCheckboxStatus?
        let view = CCCheckbox(label: "Agree", status: .off) { status = $0 }
        try view.inspect().find(ViewType.Button.self).tap()
        XCTAssertEqual(status, .on)
    }

    func testSwitchToggles() throws {
        var isOn: Bool?
        let view = CCSwitch(label: "Alerts", isOn: false) { isOn = $0 }
        try view.inspect().find(ViewType.Button.self).tap()
        XCTAssertEqual(isOn, true)
    }

    func testRadioSelects() throws {
        var selected = false
        let view = CCRadio("Large", selected: false) { selected = true }
        try view.inspect().find(ViewType.Button.self).tap()
        XCTAssertTrue(selected)
    }

    func testDialogCloseAsksToDismiss() throws {
        var dismissed = false
        let view = CCDialogPanel("Delete?", onDismiss: { dismissed = true }) { EmptyView() }
        try view.inspect().find(ViewType.Button.self).tap()
        XCTAssertTrue(dismissed)
    }

    func testPaginationMovesAndTruncates() throws {
        var page = 3
        let view = CCPagination(page: 3, totalPages: 10) { page = $0 }
        // First button is "previous".
        try view.inspect().find(ViewType.Button.self).tap()
        XCTAssertEqual(page, 2)
        // The web's window: `maxVisible` pages after the first, then the gap.
        XCTAssertEqual(CCPagination(page: 3, totalPages: 10) { _ in }.slotsForTesting, [1, 2, 3, 4, 5, nil, 10])
        XCTAssertEqual(CCPagination(page: 8, totalPages: 10) { _ in }.slotsForTesting, [1, nil, 6, 7, 8, 9, 10])
        XCTAssertEqual(CCPagination(page: 3, totalPages: 7) { _ in }.slotsForTesting, [1, 2, 3, 4, 5, 6, 7])
    }

    func testLinkAndBreadcrumbCallBack() throws {
        var linked = 0
        try CCLink("Terms") { linked += 1 }.inspect().find(ViewType.Button.self).tap()
        XCTAssertEqual(linked, 1)
        var crumb: String?
        let crumbs = CCBreadcrumb(items: [.init(id: "h", title: "Home"), .init(id: "x", title: "Here")]) { crumb = $0.id }
        try crumbs.inspect().find(ViewType.Button.self).tap()
        XCTAssertEqual(crumb, "h")
    }

    /// `ccPressable` is a button: its action fires on a tap.
    func testPressableCallsAction() throws {
        var taps = 0
        let view = Text("Row").ccPressable { taps += 1 }
        try view.inspect().find(ViewType.Button.self).tap()
        XCTAssertEqual(taps, 1)
    }

    /// The strings are resources, and the Korean table is shipped.
    func testStringsAreLocalisedResources() {
        let korean = Bundle.module.path(forResource: "Localizable", ofType: "strings", inDirectory: nil, forLocalization: "ko")
        XCTAssertNotNil(korean, "ko.lproj/Localizable.strings is not in the bundle")
        XCTAssertFalse(CCStrings.on.isEmpty)
        XCTAssertNotEqual(CCStrings.on, "cc.on", "the key came back instead of the string")
    }
}
