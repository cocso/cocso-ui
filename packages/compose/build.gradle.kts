plugins {
    alias(libs.plugins.android.library)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.kotlin.compose)
    alias(libs.plugins.roborazzi)
}

// Coordinates a consumer names when it pulls this in as a composite build:
//   includeBuild("<path>/packages/compose")
//   implementation("ai.cocso.ui:cocso-ui-compose")
// The name is `rootProject.name` in settings.gradle.kts. Publication to a
// repository waits for a second consumer; cocso/mobile consumes by path.
group = "ai.cocso.ui"
version = "0.1.0"

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
}

dependencies {
    implementation(platform(libs.compose.bom))
    implementation(libs.compose.ui)
    implementation(libs.compose.foundation)
    implementation(libs.compose.material3)
    implementation(libs.compose.material.icons.extended)

    testImplementation(platform(libs.compose.bom))
    testImplementation(libs.junit)
    testImplementation(libs.compose.ui.test.junit4)
    testImplementation(libs.roborazzi)
    testImplementation(libs.roborazzi.compose)
    testImplementation(libs.robolectric)
    debugImplementation(libs.compose.ui.test.manifest)
}
