/**
 * GuideStep renders an individual step with image, title, description, and
 * optional materials/tools sections. Features step numbering and card layout.
 */
import React from "react";
import { View, StyleSheet, Image, ImageProps } from "react-native";
import Typography from "./Typography";
import Colors from "@/constants/Colors";
import { useColorScheme } from "./useColorScheme";

interface GuideStepProps {
  stepNumber: number;
  title: string;
  description: string;
  imageUrl?: string | undefined | null;
  materials?: string[];
  tools?: string[];
  style?: any;
}

const GuideStep: React.FC<GuideStepProps> = ({
  stepNumber,
  title,
  description,
  imageUrl,
  materials = [],
  tools = [],
  style,
}) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const renderResourceSection = (title: string, items: string[]) => {
    if (items.length === 0) return null;

    return (
      <View style={[styles.resourceSection, { backgroundColor: colors.pageBackground }]}>
        <Typography
          variant="h5"
          weight="semiBold"
          color={colors.text}
        >
          {title}
        </Typography>
        <View style={styles.resourceList}>
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

  return (
    <View>
      <View style={[styles.container, { backgroundColor: colors.cardBackground }, style]}>
        {/* Step Image */}
        {imageUrl && (
          <Image
            source={{ uri: imageUrl }}
            style={styles.stepImage}
            resizeMode="cover"
          />
        )}

        {/* Content */}
        <View style={styles.content}>
          {/* Step Info */}
          <View style={styles.stepInfo}>
            <Typography
              variant="h3"
              weight="bold"
              color={colors.text}

            >
              {title}
            </Typography>
            <Typography
              variant="body"
              color={colors.secondaryText}

            >
              {description}
            </Typography>
          </View>

          {/* Materials Section */}
          {materials.length > 0 && renderResourceSection("Materials", materials)}

          {/* Tools Section */}
          {tools.length > 0 && renderResourceSection("Tools", tools)}
        </View>


      </View>
      {/* Step Number Circle */}
      <View style={[styles.stepNumber, { backgroundColor: colors.stepCircle }]}>
        <Typography
          variant="body"
          weight="bold"
          color={colors.invertText}
          style={styles.stepNumberText}
        >
          {stepNumber}
        </Typography>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: "hidden",
    position: "relative",
  },
  stepImage: {
    width: "100%",
    height: 258,
  },
  content: {
    paddingTop: 24,
    padding: 16,
    gap: 8,
  },
  stepInfo: {
    gap: 4,
  },

  resourceSection: {
    padding: 12,
    borderRadius: 8,
    gap: 4,
  },
  resourceList: {
    gap: 2,
  },

  stepNumber: {
    position: "absolute",
    top: -12,
    left: -12,
    width: 32,
    height: 32,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  stepNumberText: {
    fontSize: 14,
    lineHeight: 22,
  },
});

export default GuideStep;