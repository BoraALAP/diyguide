import React from "react";
import { View, StyleSheet, ViewProps } from "react-native";
import Typography from "./Typography";
import Colors from "@/constants/Colors";
import { useColorScheme } from "./useColorScheme";

interface CategoryBadgeProps extends ViewProps {
  categoryName?: string;
  colorIndicator?: string;
  style?: any;
}

const CategoryBadge: React.FC<CategoryBadgeProps> = ({
  categoryName = "Electronics",
  colorIndicator = "#cc0055",
  style,
  ...props
}) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  return (
    <View
      {...props}
      style={[
        styles.container,
        {
          backgroundColor: colors.badgeBackground,
        },
        style,
      ]}
    >
      <View
        style={[
          styles.colorIndicator,
          { backgroundColor: colorIndicator },
        ]}
      />
      <Typography
        variant="label"
        weight="medium"
        color={colors.text}
        numberOfLines={1}
      >
        {categoryName}
      </Typography>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    gap: 8,
    alignSelf: "flex-start",
  },
  colorIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    flexShrink: 0,
  },
});

export default CategoryBadge;