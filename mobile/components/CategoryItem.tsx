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
      className="rounded active:opacity-70"
      style={style}
    >
      <View className="flex-row items-center py-1 gap-2">
        <View
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: colorIndicator }}
        />
        <Typography variant="h6" color={colors.text} numberOfLines={1}>
          {categoryName}
        </Typography>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({});

export default CategoryItem;
