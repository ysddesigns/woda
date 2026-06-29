import type { ExpoConfig } from 'expo/config';

/**
 * Dynamic config (not app.json) so `android.googleServicesFile` can read the path EAS Build
 * injects from the GOOGLE_SERVICES_JSON project secret (see `eas secret:create`). Locally,
 * it falls back to a git-ignored google-services.json in the project root.
 */
const config: ExpoConfig = {
  name: 'woda',
  slug: 'woda',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: 'woda',
  userInterfaceStyle: 'automatic',
  runtimeVersion: {
    policy: 'appVersion',
  },
  ios: {
    icon: './assets/expo.icon',
    bundleIdentifier: 'com.kashify.woda',
    // Standard HTTPS only (no custom encryption) — skips the export-compliance prompt on
    // every build/submission. Revisit if the app ever adds its own crypto.
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false,
      NSLocationWhenInUseUsageDescription: 'Used to show how far you are from a World Cup venue. Optional — only requested when you tap "Show my distance".',
    },
  },
  android: {
    package: 'com.kashify.woda',
    googleServicesFile: process.env.GOOGLE_SERVICES_JSON ?? './google-services.json',
    adaptiveIcon: {
      backgroundColor: '#E6F4FE',
      foregroundImage: './assets/images/android-icon-foreground.png',
      backgroundImage: './assets/images/android-icon-background.png',
      monochromeImage: './assets/images/android-icon-monochrome.png',
    },
    predictiveBackGestureEnabled: false,
  },
  web: {
    output: 'static',
    favicon: './assets/images/favicon.png',
  },
  plugins: [
    'expo-router',
    [
      'expo-splash-screen',
      {
        image: './assets/images/splash-icon.png',
        imageWidth: 220,
        resizeMode: 'contain',
        backgroundColor: '#F9FAFB',
        dark: {
          image: './assets/images/splash-icon.png',
          backgroundColor: '#0B0F14',
        },
      },
    ],
    [
      'expo-notifications',
      {
        icon: './assets/images/android-icon-monochrome.png',
        color: '#15803D',
        defaultChannel: 'default',
      },
    ],
    [
      'expo-location',
      {
        locationWhenInUsePermission: 'Used to show how far you are from a World Cup venue. Optional — only requested when you tap "Show my distance".',
      },
    ],
    [
      'expo-build-properties',
      {
        android: {
          minSdkVersion: 24,
          enableProguardInReleaseBuilds: true,
          enableShrinkResourcesInReleaseBuilds: true,
        },
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
  extra: {
    router: {},
    eas: {
      projectId: 'e4fc0411-891e-4f2b-9f3c-a5cd8f677077',
    },
  },
  owner: 'yusufbyusuf',
  updates: {
    url: 'https://u.expo.dev/e4fc0411-891e-4f2b-9f3c-a5cd8f677077',
  },
};

export default config;
