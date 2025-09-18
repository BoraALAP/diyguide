/**
 * Typography maps design-system text variants to loaded Lexend/Literata fonts.
 * Prefer this over raw Text for consistent typography.
 */
import React from "react";
import { StyleSheet, Text, TextProps, TextStyle } from "react-native";

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
} as const;

export type FontFamilyName = keyof typeof FontFamilies;
export type FontWeightName =
  | "thin"
  | "extraLight"
  | "light"
  | "regular"
  | "medium"
  | "semiBold"
  | "bold"
  | "extraBold"
  | "black";
export type VariantName =
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "body"
  | "caption"
  | "label"
  | "button";

export interface TypographyProps extends TextProps {
  variant?: VariantName;
  weight?: FontWeightName;
  font?: FontFamilyName;
  color?: string;
  italic?: boolean;
  children: React.ReactNode;
}

type VariantDefaults = Record<VariantName, { font: FontFamilyName; weight: FontWeightName }>;

const VARIANT_DEFAULTS: VariantDefaults = {
  h1: { font: "lexend", weight: "regular" },
  h2: { font: "literata", weight: "semiBold" },
  h3: { font: "lexend", weight: "bold" },
  h4: { font: "lexend", weight: "regular" },
  h5: { font: "lexend", weight: "regular" },
  h6: { font: "lexend", weight: "medium" },
  body: { font: "lexend", weight: "regular" },
  caption: { font: "lexend", weight: "regular" },
  label: { font: "lexend", weight: "light" },
  button: { font: "lexend", weight: "regular" },
};

const resolveFontFamily = (font: FontFamilyName, weight: FontWeightName, italic: boolean) => {
  if (font === "lexend") {
    return FontFamilies.lexend[weight];
  }

  const literataFamilies = FontFamilies.literata as Record<string, string>;

  if (italic) {
    const italicKey = `${weight}Italic`;
    if (literataFamilies[italicKey]) {
      return literataFamilies[italicKey];
    }
  }

  return literataFamilies[weight] ?? literataFamilies.regular;
};

const BaseTypography = React.forwardRef<Text, TypographyProps>(function Typography(
  {
    variant = "body",
    weight,
    font,
    color,
    italic = false,
    style,
    children,
    ...props
  },
  ref,
) {
  const defaults = VARIANT_DEFAULTS[variant];
  const resolvedFont = font ?? defaults.font;
  const resolvedWeight = weight ?? defaults.weight;
  const fontFamily = resolveFontFamily(resolvedFont, resolvedWeight, italic);

  const fontStyle: TextStyle["fontStyle"] =
    italic && resolvedFont === "lexend" ? "italic" : "normal";

  const inlineStyle: TextStyle = {
    fontFamily,
    fontStyle,
  };

  if (color) {
    inlineStyle.color = color;
  }

  return (
    <Text ref={ref} {...props} style={[styles[variant], inlineStyle, style]}>
      {children}
    </Text>
  );
});

BaseTypography.displayName = "Typography";

type VariantComponentProps = Omit<TypographyProps, "variant">;

const toPascalCase = (value: VariantName) => value.charAt(0).toUpperCase() + value.slice(1);

const createVariantComponent = (variant: VariantName) => {
  const VariantComponent = React.forwardRef<Text, VariantComponentProps>((props, ref) => (
    <BaseTypography {...props} ref={ref} variant={variant} />
  ));

  VariantComponent.displayName = `Typography${toPascalCase(variant)}`;

  return VariantComponent;
};

const variantComponents = {
  H1: createVariantComponent("h1"),
  H2: createVariantComponent("h2"),
  H3: createVariantComponent("h3"),
  H4: createVariantComponent("h4"),
  H5: createVariantComponent("h5"),
  H6: createVariantComponent("h6"),
  Body: createVariantComponent("body"),
  Caption: createVariantComponent("caption"),
  Label: createVariantComponent("label"),
  Button: createVariantComponent("button"),
} as const;

type TypographyComposite = typeof BaseTypography & typeof variantComponents;

const Typography = Object.assign(BaseTypography, variantComponents) as TypographyComposite;

// Typography styles based on Figma variables
// Using satisfies to ensure every variant has a matching style entry
const styles = StyleSheet.create(
  {
    h1: {
      fontSize: 28,
      lineHeight: 42,
    },
    h2: {
      // From Figma: Literata SemiBold 21px
      fontSize: 24,
      lineHeight: 36,
    },
    h3: {
      // From Figma: Lexend Bold 16px
      fontSize: 21,
      lineHeight: 28,
    },
    h4: {
      fontSize: 20,
      lineHeight: 30,
    },
    h5: {
      fontSize: 17,
      lineHeight: 26,
    },
    h6: {
      // From Figma: Lexend Medium 14px
      fontSize: 16,
      lineHeight: 24,
    },
    body: {
      // From Figma: Lexend Regular 14px with 1.5 line height
      fontSize: 15,
      lineHeight: 18,
    },
    caption: {
      fontSize: 12,
      lineHeight: 16,
    },
    label: {
      fontSize: 14,
      lineHeight: 18,
    },
    button: {
      fontSize: 14,
      lineHeight: 18,
      textTransform: "uppercase",
      letterSpacing: 1,
    },
  } satisfies Record<VariantName, TextStyle>,
);

export default Typography;
