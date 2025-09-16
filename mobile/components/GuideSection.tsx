/**
 * GuideSection wraps a titled block of guides, handling the header and card
 * styling while wiring presses through to the parent.
 */
import React from "react";
import { View, StyleSheet } from "react-native";
import GuideItem from "./GuideItem";
import { PageTitle } from "./PageTitle";
import { Card } from "./Card";
import Typography from "./Typography";

interface Guide {
  id: string;
  name: string;
  category?: string;
  tags?: { name: string; hex?: string }[];
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



  return (
    <View style={styles.container}>
      {/* Section Header */}
      <PageTitle title={title} description={subtitle} />

      {/* Guides List */}
      <Card>
        {guides.length === 0 && (
          <Typography
            variant="h5"
          >No Guide is Found</Typography>
        )}
        {guides.map((guide) => (
          <GuideItem
            key={guide.id}
            guideName={guide.name}
            category={guide.category}
            tags={guide.tags}
            stepAmount={`${guide.steps} step${guide.steps !== 1 ? "s" : ""}`}
            selected={guide.selected}
            colorIndicator={guide.colorIndicator}
            onPress={() => onGuidePress?.(guide)}
          />
        ))}
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    gap: 16,
  }
});

export default GuideSection;
