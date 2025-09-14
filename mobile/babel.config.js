module.exports = function (api) {
  api.cache(true);
  return {
    // NativeWind's export re-exports a preset (react-native-css-interop/babel)
    // so include it under presets, not plugins.
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
    plugins: [],
  };
};
