// swift-tools-version: 5.9
import PackageDescription

// macOS is declared alongside iOS so `swift build` verifies the generated
// tokens without a simulator. iOS 16 is the floor the first consumer
// (cocso/mobile) targets.
let package = Package(
    name: "CocsoUI",
    platforms: [.iOS(.v16), .macOS(.v13)],
    products: [.library(name: "CocsoUI", targets: ["CocsoUI"])],
    targets: [.target(name: "CocsoUI", path: "Sources/CocsoUI")]
)
