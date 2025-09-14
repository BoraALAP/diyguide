import React from "react";
import { Text, TextProps, StyleSheet } from "react-native";

// Font family constants
export const FontFamilies = {
  lexend: {
    thin: "Lexend_100Thin",
    extraLight: "Lexend_200ExtraLight",
    light: "Lexend_300Light",
    regular: "Lexend_400Regular",
    medium: "Lexend_500Medium",
    semiBold: "Lexend_600SemiBold",
    bold: "Lexend_700Bold",
    extraBold: "Lexend_800ExtraBold",
    black: "Lexend_900Black",
  },
  literata: {
    extraLight: "Literata_200ExtraLight",
    light: "Literata_300Light",
    regular: "Literata_400Regular",
    medium: "Literata_500Medium",
    semiBold: "Literata_600SemiBold",
    bold: "Literata_700Bold",
    extraBold: "Literata_800ExtraBold",
    black: "Literata_900Black",
    // Italic variants
    extraLightItalic: "Literata_200ExtraLight_Italic",
    lightItalic: "Literata_300Light_Italic",
    regularItalic: "Literata_400Regular_Italic",
    mediumItalic: "Literata_500Medium_Italic",
    semiBoldItalic: "Literata_600SemiBold_Italic",
    boldItalic: "Literata_700Bold_Italic",
    extraBoldItalic: "Literata_800ExtraBold_Italic",
    blackItalic: "Literata_900Black_Italic",
  },
};

interface TypographyProps extends TextProps {
  variant?:
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "h5"
    | "h6"
    | "body"
    | "body1"
    | "body2"
    | "subtitle1"
    | "subtitle2"
    | "caption"
    | "captionSm"
    | "label"
    | "button";
  weight?:
    | "thin"
    | "extraLight"
    | "light"
    | "regular"
    | "medium"
    | "semiBold"
    | "bold"
    | "extraBold"
    | "black";
  font?: "lexend" | "literata";
  color?: string;
  italic?: boolean;
  children: React.ReactNode;
}

const Typography: React.FC<TypographyProps> = ({
  variant = "body",
  weight,
  font,
  color,
  italic = false,
  style,
  children,
  ...props
}) => {
  // Get default font and weight for Figma-specific variants
  const getDefaultFontSettings = () => {
    switch (variant) {
      case "h2":
        return { font: "literata" as const, weight: "semiBold" as const };
      case "h3":
        return { font: "lexend" as const, weight: "bold" as const };
      case "h6":
        return { font: "lexend" as const, weight: "medium" as const };
      case "body":
        return { font: "lexend" as const, weight: "regular" as const };
      case "label":
      case "captionSm":
        return { font: "lexend" as const, weight: "light" as const };
      default:
        return { font: font || "lexend", weight: weight || "regular" };
    }
  };

  // Use Figma defaults if not specified
  const defaultSettings = getDefaultFontSettings();
  const finalFont = font || defaultSettings.font;
  const finalWeight = weight || defaultSettings.weight;

  const getFontFamily = () => {
    const weightMap = {
      thin: "100Thin",
      extraLight: "200ExtraLight",
      light: "300Light",
      regular: "400Regular",
      medium: "500Medium",
      semiBold: "600SemiBold",
      bold: "700Bold",
      extraBold: "800ExtraBold",
      black: "900Black",
    };

    const fontWeight = weightMap[finalWeight as keyof typeof weightMap];
    const italicSuffix = italic && finalFont === "literata" ? "_Italic" : "";

    if (finalFont === "lexend") {
      return `Lexend_${fontWeight}`;
    } else {
      return `Literata_${fontWeight}${italicSuffix}`;
    }
  };

  const getVariantStyle = () => {
    switch (variant) {
      case "h1":
        return styles.h1;
      case "h2":
        return styles.h2;
      case "h3":
        return styles.h3;
      case "h4":
        return styles.h4;
      case "h5":
        return styles.h5;
      case "h6":
        return styles.h6;
      case "body":
        return styles.body;
      case "body1":
        return styles.body1;
      case "body2":
        return styles.body2;
      case "subtitle1":
        return styles.subtitle1;
      case "subtitle2":
        return styles.subtitle2;
      case "caption":
        return styles.caption;
      case "captionSm":
        return styles.captionSm;
      case "label":
        return styles.label;
      case "button":
        return styles.button;
      default:
        return styles.body;
    }
  };


  return (
    <Text
      {...props}
      style={[
        getVariantStyle(),
        {
          fontFamily: getFontFamily(),
          color: color,
          fontStyle: italic && finalFont === "lexend" ? "italic" : "normal",
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
};

// Typography styles based on Figma variables
const styles = StyleSheet.create({
  h1: {
    fontSize: 36,
    lineHeight: 44,
  },
  h2: {
    // From Figma: Literata SemiBold 21px
    fontSize: 21,
    lineHeight: 21,
  },
  h3: {
    // From Figma: Lexend Bold 16px
    fontSize: 16,
    lineHeight: 16,
  },
  h4: {
    fontSize: 24,
    lineHeight: 32,
  },
  h5: {
    fontSize: 20,
    lineHeight: 28,
  },
  h6: {
    // From Figma: Lexend Medium 14px
    fontSize: 14,
    lineHeight: 14,
  },
  body: {
    // From Figma: Lexend Regular 14px with 1.5 line height
    fontSize: 14,
    lineHeight: 21,
  },
  body1: {
    fontSize: 16,
    lineHeight: 24,
  },
  body2: {
    fontSize: 14,
    lineHeight: 20,
  },
  subtitle1: {
    fontSize: 16,
    lineHeight: 24,
  },
  subtitle2: {
    fontSize: 14,
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    lineHeight: 16,
  },
  captionSm: {
    // From Figma: Lexend Light 11px with 1.5 line height
    fontSize: 11,
    lineHeight: 16.5,
  },
  label: {
    // From Figma: Lexend Light 11px
    fontSize: 11,
    lineHeight: 11,
  },
  button: {
    fontSize: 14,
    lineHeight: 20,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
});

export default Typography;