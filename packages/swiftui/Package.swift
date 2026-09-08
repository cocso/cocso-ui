// swift-tools-version: 5.9
import PackageDescription

// macOS is declared alongside iOS so `swift build` verifies the generated
// tokens without a simulator. iOS 16 is the floor the first consumer
// (cocso/mobile) targets.
let package = Package(
    name: "CocsoUI",
    defaultLocalization: "en",
    platforms: [.iOS(.v16), .macOS(.v13)],
    products: [.library(name: "CocsoUI", targets: ["CocsoUI"])],
    dependencies: [
        // Tests only: taps and reads SwiftUI views without a UI-test host.
        .package(url: "https://github.com/nalexn/ViewInspector", from: "0.10.0")
    ],
    targets: [
        // The strings the views speak, in en and ko — see CCStrings.
        .target(
            name: "CocsoUI",
            path: "Sources/CocsoUI",
            resources: [.process("Resources")]
        ),
        .testTarget(
            name: "CocsoUITests",
            dependencies: ["CocsoUI", "ViewInspector"],
            path: "Tests/CocsoUITests"
        )
    ]
)
