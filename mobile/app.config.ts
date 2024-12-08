import { ConfigContext, ExpoConfig } from "expo/config";

const getBundleID = () => {
  if (process.env.APP_VARIANT === "production") {
    return "com.boraalap.diyguide";
  }

  if (process.env.APP_VARIANT === "preview") {
    return "com.boraalap.diyguide.preview";
  }

  return "com.boraalap.diyguide.development";
};

const bundleID = getBundleID();

const getAppName = () => {
  if (process.env.APP_VARIANT === "production") {
    return "DIY Guide";
  }

  if (process.env.APP_VARIANT === "preview") {
    return "DIY Guide Preview";
  }

  return "DIY Guide Dev";
};

const appName = getAppName();

export default ({ config }: ConfigContext): ExpoConfig => {
  return {
    ...config,
    name: appName,
    slug: "diyguide",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "com.diyguide",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    jsEngine: "hermes",
    splash: {
      image: "./assets/images/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    ios: {
      bundleIdentifier: bundleID,
      config: {
        usesNonExemptEncryption: false,
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      package: bundleID,
      versionCode: 5,
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png",
    },
    plugins: [
      "expo-router",
      "expo-font",
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
