/**
 * CategoryItem is a pressable row that displays a category name and color
 * indicator. Use in category lists that navigate to detail views.
 */
import React from "react";
import { View, Pressable, StyleSheet, PressableProps } from "react-native";
import Typography from "./Typography";
import Colors from "@/constants/Colors";
import { useColorScheme } from "./useColorScheme";

interface CategoryItemProps extends Omit<PressableProps, "style"> {
  categoryName?: string;
  colorIndicator?: string;
  style?: any;
}

const CategoryItem: React.FC<CategoryItemProps> = ({
  categoryName = "Category Name",
  colorIndicator = "#cc0055",
  style,
  ...props
}) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  return (
    <Pressable
      {...props}
      style={({ pressed }) => [
        styles.container,
        pressed && styles.pressed,
        style,
      ]}
    >
      <View style={styles.content}>
        <View
          style={[
            styles.colorIndicator,
            { backgroundColor: colorIndicator },
          ]}
        />
        <Typography
          variant="h6"
          color={colors.text}
          numberOfLines={1}
          style={styles.categoryText}
        >
          {categoryName}
        </Typography>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 4,
    overflow: "hidden",
    width: "100%",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    height: 42, // Fixed height from Figma
    paddingVertical: 4,
    gap: 8, // 8px gap from Figma
  },
  colorIndicator: {
    width: 8, // size-2 = 8px
    height: 8,
    borderRadius: 4, // rounded-[9999px] = fully rounded
    flexShrink: 0,
  },
  categoryText: {
    flex: 1,
    minWidth: 0,
  },
  pressed: {
    opacity: 0.7,
  },
});

export default CategoryItem;