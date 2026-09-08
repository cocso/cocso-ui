plugins {
    alias(libs.plugins.android.library)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.kotlin.compose)
    alias(libs.plugins.roborazzi)
    `maven-publish`
}

// Coordinates, two ways in:
//   composite build:  includeBuild("<path>/packages/compose")
//   GitHub Packages:  maven { url = uri("https://maven.pkg.github.com/cocso/cocso-ui") }
//                     implementation("ai.cocso.ui:compose:<VERSION_NAME>")
// The artifact name is `rootProject.name` in settings.gradle.kts; the version
// is VERSION_NAME in gradle.properties, shared with the Swift package's tag.
group = "ai.cocso.ui"
version = providers.gradleProperty("VERSION_NAME").get()

android {
    namespace = "ai.cocso.ui"
    compileSdk = 35

    defaultConfig {
        // Matches the floor cocso/mobile targets.
        minSdk = 26
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    kotlinOptions { jvmTarget = "17" }
    buildFeatures { compose = true }

    testOptions {
        unitTests {
            // Robolectric 이 res/ 를 읽어야 테마·문자열이 있는 화면을 그린다.
            isIncludeAndroidResources = true
        }
    }

    publishing {
        singleVariant("release") { withSourcesJar() }
    }
}

// GitHub Packages, from the mobile-release workflow. GITHUB_ACTOR/GITHUB_TOKEN
// are what Actions provides; a developer publishing by hand sets the same two.
publishing {
    publications {
        register<MavenPublication>("release") {
            groupId = "ai.cocso.ui"
            artifactId = "compose"
            afterEvaluate { from(components["release"]) }
        }
    }
    repositories {
        maven {
            name = "GitHubPackages"
            url = uri("https://maven.pkg.github.com/cocso/cocso-ui")
            credentials {
                username = System.getenv("GITHUB_ACTOR")
                password = System.getenv("GITHUB_TOKEN")
            }
        }
    }
}

dependencies {
    implementation(platform(libs.compose.bom))
    implementation(libs.compose.ui)
    implementation(libs.compose.foundation)
    implementation(libs.compose.material3)
    implementation(libs.compose.material.icons.extended)
    // Glass: real backdrop blur when the app provides a HazeState — see CCGlass.
    implementation(libs.haze)

    testImplementation(platform(libs.compose.bom))
    testImplementation(libs.junit)
    testImplementation(libs.compose.ui.test.junit4)
    testImplementation(libs.roborazzi)
    testImplementation(libs.roborazzi.compose)
    testImplementation(libs.robolectric)
    debugImplementation(libs.compose.ui.test.manifest)
}
