pluginManagement {
    repositories {
        google()
        mavenCentral()
        gradlePluginPortal()
    }
}
dependencyResolutionManagement {
    repositories {
        google()
        mavenCentral()
    }
}

// The artifact: `ai.cocso.ui:compose`, the way npm has `@cocso-ui/react`.
// `cocso-ui-compose` under `ai.cocso.ui` read as `ai.cocso.ui.cocso-ui-compose`.
rootProject.name = "compose"
