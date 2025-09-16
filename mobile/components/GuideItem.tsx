/**
 * GuideItem shows a guide title, up to three tags (or category), and the step
 * count. Use in richer guide lists such as home sections.
 */
import React from "react";
import { View, Pressable, StyleSheet, PressableProps } from "react-native";
import Typography from "./Typography";
import Colors from "@/constants/Colors";
import { useColorScheme } from "./useColorScheme";

interface GuideItemProps extends Omit<PressableProps, "style"> {
  guideName?: string;
  category?: string; // legacy single category
  tags?: { name: string; hex?: string }[]; // new multi-tag chips
  stepAmount?: string;
  selected?: boolean;
  colorIndicator?: string;
  showCategoryContainer?: boolean;
  style?: any;
}

const GuideItem: React.FC<GuideItemProps> = ({
  guideName = "Name of the guide",
  category = "Category",
  tags,
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
        styles.container
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
              {Array.isArray(tags) && tags.length > 0 ? (
                <>
                  {tags.slice(0, 2).map((t, idx) => (
                    <View key={`${t.name}-${idx}`} style={[styles.chip]}>
                      <View
                        style={[
                          styles.colorIndicator,
                          { backgroundColor: t.hex ? `#${String(t.hex).replace(/^#/, "")}` : colorIndicator },
                        ]}
                      />
                      <Typography
                        variant="captionSm"
                        color={colors.secondaryText}
                        style={styles.category}
                        numberOfLines={1}
                      >
                        {t.name}
                      </Typography>
                    </View>
                  ))}
                  {tags.length > 2 && (
                    <Typography
                      variant="captionSm"
                      color={colors.secondaryText}
                      style={styles.moreChip}
                      numberOfLines={1}
                    >
                      +{tags.length - 2} more
                    </Typography>
                  )}
                </>
              ) : (
                <View style={styles.chip}>
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

    paddingVertical: 4,
    gap: 2,
  },
  guideName: {
    width: "100%",
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    width: "100%",
    gap: 16,
  },
  categoryContainer: {
    flexDirection: "row",
    flexShrink: 1,
    flexGrow: 0,
    gap: 8,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    flexShrink: 1,
    gap: 6
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
  moreChip: {
    flexShrink: 0,
  },
  stepAmount: {
    textAlign: "right",
    flexShrink: 0,
    paddingBottom: 1,
  },
  pressed: {
    opacity: 0.7,
  },
});

export default GuideItem;
