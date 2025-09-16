/**
 * GuideHeader displays the guide title, category badges, and description
 * at the top of a guide detail page.
 */
import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import Typography from "./Typography";
import CategoryBadge from "./CategoryBadge";
import Colors from "@/constants/Colors";
import { useColorScheme } from "./useColorScheme";

interface Category {
  name: string;
  color: string;
}

interface GuideHeaderProps {
  title: string;
  description: string;
  categories?: Category[];
  style?: any;
}

const GuideHeader: React.FC<GuideHeaderProps> = ({
  title,
  description,
  categories = [],
  style,
}) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  return (
    <View style={[styles.container, style]}>
      <View style={styles.content}>
        {/* Title */}
        <Typography
          variant="h2"
          weight="semiBold"
          color={colors.text}
          style={styles.title}
        >
          {title}
        </Typography>

        {/* Category Badges */}
        {categories.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryList}
          >
            {categories.map((category, index) => (
              <CategoryBadge
                key={index}
                categoryName={category.name}
                colorIndicator={category.color}
              />
            ))}
          </ScrollView>
        )}

        {/* Description */}
        <Typography
          variant="body"
          color={colors.secondaryText}
          style={styles.description}
        >
          {description}
        </Typography>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 0,
  },
  content: {
    gap: 8,
  },
  title: {
    fontSize: 21,
    lineHeight: 21, // 100% line height
  },
  categoryList: {
    flexDirection: "row",
    gap: 8,
    paddingRight: 16, // Extra padding for horizontal scroll
  },
  description: {
    lineHeight: 21, // 1.5 * 14
  },
});

export default GuideHeader;