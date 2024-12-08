/**
 * Learn more about Light and Dark modes:
 * https://docs.expo.io/guides/color-schemes/
 */

import {
  Text as DefaultText,
  View as DefaultView,
  ScrollView as DefaultScrollView,
  StyleSheet,
} from "react-native";

import Colors from "@/constants/Colors";
import { useColorScheme } from "./useColorScheme";

type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
};

export type TextProps = ThemeProps & DefaultText["props"];
export type ViewProps = ThemeProps & DefaultView["props"];
export type ScrollViewProps = ThemeProps & DefaultScrollView["props"];
export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const theme = useColorScheme() ?? "light";
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}

export function TextT(props: TextProps & { bold?: boolean }) {
  const { style, lightColor, darkColor, bold, ...otherProps } = props;
  const color = useThemeColor(
    {
      light: lightColor ?? Colors.light.text,
      dark: darkColor ?? Colors.dark.text,
    },
    "text"
  );

  return (
    <DefaultText
      style={[{ color }, bold && { fontWeight: "bold" }, style]}
      {...otherProps}
    />
  );
}

export function SecondaryText(props: TextProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const color = useThemeColor(
    { light: Colors.light.secondaryText, dark: Colors.dark.secondaryText },
    "secondaryText"
  );

  return (
    <DefaultText style={[{ color }, style, { fontSize: 13 }]} {...otherProps} />
  );
}

export function PageTitle(props: TextProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const color = useThemeColor(
    { light: Colors.light.text, dark: Colors.dark.text },
    "text"
  );
  return (
    <TextT
      style={[{ color }, style, { fontSize: 18, fontWeight: "bold" }]}
      {...otherProps}
    />
  );
}

export function ViewT(props: ViewProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor(
    { light: Colors.light.background, dark: Colors.dark.background },
    "background"
  );

  return <DefaultView style={[{ backgroundColor }, style]} {...otherProps} />;
}

export const ScrollViewT = (props: ScrollViewProps) => {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor(
    { light: Colors.light.background, dark: Colors.dark.background },
    "background"
  );
  return (
    <DefaultScrollView
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      style={[{ backgroundColor }, style]}
      {...otherProps}
    />
  );
};

export const useCardStyles = () => {
  const backgroundColor = useThemeColor(
    { light: Colors.light.cardBackground, dark: Colors.dark.cardBackground },
    "cardBackground"
  );

  return StyleSheet.create({
    card: {
      padding: 16,
      elevation: 1,
      boxShadow: "0px 0px 10px 0px rgba(0, 0, 0, 0.1)",
      flex: 1,
      marginHorizontal: 8,
      borderRadius: 8,
      backgroundColor,
    },
  });
};
