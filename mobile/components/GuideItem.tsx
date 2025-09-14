import React from "react";
import { View, Pressable, StyleSheet, PressableProps } from "react-native";
import Typography from "./Typography";
import Colors from "@/constants/Colors";
import { useColorScheme } from "./useColorScheme";

interface GuideItemProps extends Omit<PressableProps, "style"> {
  guideName?: string;
  category?: string;
  stepAmount?: string;
  selected?: boolean;
  colorIndicator?: string;
  showCategoryContainer?: boolean;
  style?: any;
}

const GuideItem: React.FC<GuideItemProps> = ({
  guideName = "Name of the guide",
  category = "Category",
  stepAmount = "7 steps",
  selected = false,
  colorIndicator = "#cc0055",
  showCategoryContainer = true,
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
        {
          backgroundColor: selected ? colors.selectedPackage : "transparent",
          borderLeftWidth: selected ? 4 : 0,
          borderLeftColor: selected ? colors.tint : "transparent",
        },
        pressed && styles.pressed,
        style,
      ]}
    >
      <View style={styles.content}>
        <Typography
          variant="h6"
          color={colors.text}
          style={styles.guideName}
          numberOfLines={2}
        >
          {guideName}
        </Typography>

        <View style={styles.infoContainer}>
          {showCategoryContainer && (
            <View style={styles.categoryContainer}>
              <View
                style={[
                  styles.colorIndicator,
                  { backgroundColor: colorIndicator },
                ]}
              />
              <Typography
                variant="captionSm"
                color={colors.secondaryText}
                style={styles.category}
                numberOfLines={1}
              >
                {category}
              </Typography>
            </View>
          )}

          <Typography
            variant="label"
            color={colors.secondaryText}
            style={styles.stepAmount}
          >
            {stepAmount}
          </Typography>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 4,
    overflow: "hidden",
  },
  content: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    gap: 2,
  },
  guideName: {
    width: "100%",
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    gap: 16,
  },
  categoryContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    minWidth: 0,
    gap: 8,
  },
  colorIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    flexShrink: 0,
  },
  category: {
    flex: 1,
    minWidth: 0,
  },
  stepAmount: {
    textAlign: "right",
    flexShrink: 0,
  },
  pressed: {
    opacity: 0.7,
  },
});

export default GuideItem;