import React from "react";
import { View, StyleSheet } from "react-native";
import Typography from "./Typography";
import GuideItem from "./GuideItem";
import Colors from "@/constants/Colors";
import { useColorScheme } from "./useColorScheme";

interface Guide {
  id: string;
  name: string;
  // category: string;
  steps: number;
  selected?: boolean;
  colorIndicator?: string;
}

interface GuideSectionProps {
  title: string;
  subtitle: string;
  guides: Guide[];
  onGuidePress?: (guide: Guide) => void;
}

const GuideSection: React.FC<GuideSectionProps> = ({
  title,
  subtitle,
  guides,
  onGuidePress,
}) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  return (
    <View style={styles.container}>
      {/* Section Header */}
      <View style={styles.header}>
        <Typography
          variant="h2"
          color={colors.text}
          style={styles.title}
        >
          {title}
        </Typography>
        <Typography
          variant="body"
          weight="regular"
          font="literata"
          color="#4b4b4b"
          style={styles.subtitle}
        >
          {subtitle}
        </Typography>
      </View>

      {/* Guides List */}
      <View
        style={[
          styles.guidesContainer,
          {
            backgroundColor: colors.cardBackground,
          },
        ]}
      >
        {guides.map((guide) => (
          <GuideItem
            key={guide.id}
            guideName={guide.name}
            // category={guide.category}
            stepAmount={`${guide.steps} step${guide.steps !== 1 ? "s" : ""}`}
            selected={guide.selected}
            colorIndicator={guide.colorIndicator}
            onPress={() => onGuidePress?.(guide)}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    gap: 16,
  },
  header: {
    paddingHorizontal: 16,
    gap: 4,
  },
  title: {
    width: "100%",
  },
  subtitle: {
    width: "100%",
  },
  guidesContainer: {
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    overflow: "hidden",
  },
});

export default GuideSection;