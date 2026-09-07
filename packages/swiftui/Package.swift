// swift-tools-version: 5.9
import PackageDescription

// macOS is declared alongside iOS so `swift build` verifies the generated
// tokens without a simulator. iOS 16 is the floor the first consumer
// (cocso/mobile) targets.
let package = Package(
    name: "CocsoUI",
    platforms: [.iOS(.v16), .macOS(.v13)],
    products: [.library(name: "CocsoUI", targets: ["CocsoUI"])],
    dependencies: [
        // 뷰를 실제로 그려 보기 위한 것. 이 패키지는 컴파일과 텍스트 비교로만
        // 검증되고 있었고, 컴파일되지만 아무것도 그리지 않는 뷰는 그것을 그대로
        // 통과한다. Compose 쪽은 Roborazzi 로 같은 것을 본다.
        .package(
            url: "https://github.com/pointfreeco/swift-snapshot-testing",
            from: "1.17.0"
        )
    ],
    targets: [
        .target(name: "CocsoUI", path: "Sources/CocsoUI"),
        .testTarget(
            name: "CocsoUITests",
            dependencies: [
                "CocsoUI",
                .product(
                    name: "SnapshotTesting",
                    package: "swift-snapshot-testing"
                )
            ],
            path: "Tests/CocsoUITests"
        )
    ]
)
