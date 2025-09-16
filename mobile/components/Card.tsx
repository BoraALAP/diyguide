/**
 * Card provides a padded, theme-aware surface for grouping related content.
 * Use to visually separate lists or sections from the background.
 */
import Colors from "@/constants/Colors";
import { ReactNode } from "react"
import { StyleSheet, useColorScheme, View } from "react-native"


export const Card = ({ children }: { children: ReactNode }) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.cardBackground,
        },
      ]}
    >
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    overflow: "hidden",
  },
});