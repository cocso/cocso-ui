// swift-tools-version: 5.9
import PackageDescription

// The manifest a consumer reaches by URL:
//
//   .package(url: "https://github.com/cocso/cocso-ui", from: "1.0.1")
//
// It points at the same sources as packages/swiftui/Package.swift, which
// cocso/mobile consumes by path and which carries the test target. This one
// carries no tests, so a consumer's graph holds only what ships — Xcode
// resolves a path package's testTarget dependencies too, and ViewInspector
// reached the app that way. Tags are plain semver (`1.0.0`), from
// packages/compose/gradle.properties VERSION_NAME, cut by the mobile-release
// workflow; the npm packages' `@cocso-ui/x@y` tags are not semver and SwiftPM
// ignores them.
let package = Package(
    name: "CocsoUI",
    defaultLocalization: "en",
    platforms: [.iOS(.v16), .macOS(.v13)],
    products: [.library(name: "CocsoUI", targets: ["CocsoUI"])],
    targets: [
        .target(
            name: "CocsoUI",
            path: "packages/swiftui/Sources/CocsoUI",
            resources: [.process("Resources")]
        )
    ]
)
