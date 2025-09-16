/**
 * ResourceSection displays a list of materials or tools with proper styling
 * and bullet points, matching the guide design.
 */
import React from "react";
import { View, StyleSheet } from "react-native";
import Typography from "./Typography";
import Colors from "@/constants/Colors";
import { useColorScheme } from "./useColorScheme";

interface ResourceSectionProps {
  title: string;
  items: string[];
  style?: any;
}

const ResourceSection: React.FC<ResourceSectionProps> = ({
  title,
  items,
  style,
}) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  if (items.length === 0) return null;

  return (
    <View style={[styles.container, { backgroundColor: colors.cardBackground }, style]}>
      <Typography
        variant="h5"
        weight="semiBold"
        color={colors.text}
      >
        {title}
      </Typography>
      <View style={styles.itemList}>
        {items.map((item, index) => (
          <Typography
            key={index}
            variant="body"
            color={colors.secondaryText}

          >
            • {item}
          </Typography>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 12,
    borderRadius: 8,
    gap: 4,
  },
  itemList: {
    gap: 2,
  }
});

export default ResourceSection;