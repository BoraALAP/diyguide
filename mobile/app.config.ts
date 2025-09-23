import { ConfigContext, ExpoConfig } from "expo/config";

type AppVariant = "production" | "preview" | "development" | string;

const resolveVariant = (): AppVariant => {
  const fromEnv = process.env.APP_VARIANT ?? process.env.environment;
  if (!fromEnv) return "development";
  return fromEnv.toLowerCase();
};

const appVariant = resolveVariant();
const bundleBase = process.env.EXPO_PUBLIC_BUNDLE_ID ??
  "com.barkingcode.diyguide";

const bundleSuffixMap: Record<string, string> = {
  production: "",
  preview: ".preview",
  development: ".dev",
};

const resolveBundleId = () => {
  const suffix = bundleSuffixMap[appVariant] ?? `.${appVariant}`;
  if (!suffix) return bundleBase;
  return `${bundleBase}${suffix}`;
};

const bundleID = resolveBundleId();

const resolveAppName = () => {
  const baseName = "DIY Guide";
  switch (appVariant) {
    case "production":
      return baseName;
    case "preview":
      return `${baseName} Preview`;
    default:
      return `${baseName} Dev`;
  }
};

const appName = resolveAppName();
const appVersion = process.env.APP_VERSION ?? "1.0.1";
const schemeBase = "com.diyguide";
const scheme = appVariant === "production"
  ? schemeBase
  : `${schemeBase}.${appVariant}`;

export default ({ config }: ConfigContext): ExpoConfig => {
  return {
    ...config,
    name: appName,
    slug: "diyguide",
    version: appVersion,
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme,
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    splash: {
      image: "./assets/images/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    ios: {
      bundleIdentifier: bundleID,
      usesAppleSignIn: true,
      config: {
        usesNonExemptEncryption: false,
      },
      // Next Release Needs to be this
      // buildNumber: "6.0.2",
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      package: bundleID,
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png",
    },
    plugins: [
      "expo-router",
      "expo-font",
      "expo-web-browser",
      "expo-build-properties",
      "expo-apple-authentication",
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
      appVariant,
    },
    // Bare workflow doesn't support runtime policies, so mirror the app version.
    runtimeVersion: appVersion,
    updates: {
      enabled: true,
      checkAutomatically: "ON_LOAD",
      url: "https://u.expo.dev/f4c0f14b-7975-46e8-85ff-1d5a031e2c2f",
    },
  };
};
