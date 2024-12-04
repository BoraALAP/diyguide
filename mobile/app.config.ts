import { ConfigContext, ExpoConfig } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => {
  const isProduction = process.env.APP_ENV === "production";
  const isPreview = process.env.APP_ENV === "preview";

  // Helper function to get the appropriate bundle identifier
  const getBundleIdentifier = () => {
    if (isProduction) {
      return "com.boraalap.diyguide";
    } else if (isPreview) {
      return "com.boraalap.diyguide.preview";
    }
    return "com.boraalap.diyguide.development";
  };

  return {
    name: "diyguide",
    slug: "diyguide",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "myapp",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    jsEngine: "hermes",
    splash: {
      image: "./assets/images/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: getBundleIdentifier(),
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      package: getBundleIdentifier(),
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png",
    },
    plugins: [
      "expo-router",
      "expo-font",
      [
        "react-native-google-mobile-ads",
        {
          "androidAppId": process.env.EXPO_PUBLIC_ADMOBS_ANDROID,
          "iosAppId": process.env.EXPO_PUBLIC_ADMOBS_IOS,
        },
      ],
      "expo-build-properties",
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      router: {
        origin: false,
      },
      eas: {
        projectId: "f4c0f14b-7975-46e8-85ff-1d5a031e2c2f",
      },
    },
    runtimeVersion: {
      policy: "appVersion",
    },
    updates: {
      url: "https://u.expo.dev/f4c0f14b-7975-46e8-85ff-1d5a031e2c2f",
    },
  };
};
