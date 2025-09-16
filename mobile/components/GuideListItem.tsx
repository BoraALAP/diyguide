/**
 * GuideListItem is a condensed row that surfaces a guide title and step count.
 * Use in denser lists like category detail pages.
 */
import React from "react";
import { Pressable, StyleSheet, PressableProps, View } from "react-native";
import Typography from "./Typography";
import Colors from "@/constants/Colors";
import { useColorScheme } from "./useColorScheme";


interface GuideListItemProps extends Omit<PressableProps, "style"> {
  title?: string;
  steps?: number;
  style?: any;
}

const GuideListItem: React.FC<GuideListItemProps> = ({
  title = "Guide Title",
  steps = 0,
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
        <Typography
          variant="h6"
          color={colors.text}
          style={styles.title}
        >
          {title}
        </Typography>
        <View style={styles.infoContainer}>
          <Typography
            variant="caption"
            weight="light"
            color={colors.secondaryText}
            style={styles.stepCount}
          >
            {steps} steps
          </Typography>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    width: "100%",
  },
  content: {
    flexDirection: "column",
    gap: 2, // 0.5 * 4 = 2px gap from Figma
    paddingVertical: 4, // py-1 from Figma
    paddingHorizontal: 0, // px-0 from Figma
  },
  title: {
    width: "100%",
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16, // gap-4 from Figma
    width: "100%",
  },
  stepCount: {
    // No additional styles needed, Typography handles everything
  },
  pressed: {
    opacity: 0.7,
  },
});

export default GuideListItem;