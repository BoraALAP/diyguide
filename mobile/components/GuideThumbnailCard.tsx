import React from "react";
import {
  Image,
  Pressable,
  PressableProps,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";

import Colors from "@/constants/Colors";
import Typography from "@/components/Typography";
import { useColorScheme } from "@/components/useColorScheme";

interface TagInfo {
  name: string;
  hex?: string;
}

export type GuideThumbnailVariant = "featured" | "grid";

interface GuideThumbnailCardProps extends Omit<PressableProps, "style"> {
  title: string;
  steps?: number;
  category?: string;
  tags?: TagInfo[];
  thumbnailUrl?: string;
  colorIndicator?: string;
  variant?: GuideThumbnailVariant;
  style?: StyleProp<ViewStyle>;
}

const normalizeHex = (value?: string | null) => {
  if (!value) return undefined;
  const trimmed = String(value).trim();
  if (!trimmed) return undefined;
  if (trimmed.startsWith("#")) return trimmed;
  if (/^(rgb|hsl|var)/i.test(trimmed)) return trimmed;
  return `#${trimmed}`;
};

const GuideThumbnailCard: React.FC<GuideThumbnailCardProps> = ({
  title,
  steps = 0,
  category,
  tags,
  thumbnailUrl,
  colorIndicator,
  variant = "grid",
  style,
  ...pressableProps
}) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const primaryTag = Array.isArray(tags) && tags.length > 0 ? tags[0] : undefined;
  const accentColor =
    normalizeHex(primaryTag?.hex) ?? normalizeHex(colorIndicator) ?? colors.tint;
  const displayCategory = primaryTag?.name ?? category ?? "DIY";
  const stepLabel = `${steps} step${steps === 1 ? "" : "s"}`;

  const baseStyles = [
    styles.card,
    variant === "featured" ? styles.featuredCard : styles.gridCard,
    {
      backgroundColor: colors.cardBackground,
      borderColor: colors.border,
    },
  ];

  const combinedStyles = Array.isArray(style)
    ? [...baseStyles, ...style]
    : style
    ? [...baseStyles, style]
    : baseStyles;

  const imageWrapperStyles = [
    styles.imageWrapper,
    variant === "featured" ? styles.featuredImageWrapper : styles.gridImageWrapper,
    { backgroundColor: colors.sectionBackground },
  ];

  return (
    <Pressable
      accessibilityRole="button"
      {...pressableProps}
      style={({ pressed }) => [
        ...combinedStyles,
        pressed ? styles.pressed : null,
      ]}
    >
      <View style={imageWrapperStyles}>
        {thumbnailUrl ? (
          <Image
            source={{ uri: thumbnailUrl }}
            resizeMode="cover"
            style={styles.image}
          />
        ) : (
          <View style={styles.placeholder}>
            <View style={[styles.placeholderBadge, { backgroundColor: accentColor }]} />
          </View>
        )}
      </View>

      <View style={styles.content}>
        <Typography
          variant="h6"
          weight="semiBold"
          color={colors.text}
          numberOfLines={2}
          style={styles.title}
        >
          {title}
        </Typography>

        <View style={styles.metaRow}>
          <View
            style={[
              styles.categoryChip,
              { backgroundColor: colors.searchBarBackground },
            ]}
          >
            <View
              style={[
                styles.categoryDot,
                accentColor ? { backgroundColor: accentColor } : null,
              ]}
            />
            <Typography
              variant="caption"
              color={colors.secondaryText}
              numberOfLines={1}
            >
              {displayCategory}
            </Typography>
          </View>

          <Typography variant="caption" color={colors.secondaryText}>
            {stepLabel}
          </Typography>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 16,
    gap: 12,
    overflow: "hidden",
  },
  featuredCard: {
    width: 240,
  },
  gridCard: {
    width: "100%",
  },
  imageWrapper: {
    borderRadius: 16,
    overflow: "hidden",
  },
  featuredImageWrapper: {
    aspectRatio: 4 / 5,
  },
  gridImageWrapper: {
    aspectRatio: 4 / 3,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  placeholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    opacity: 0.35,
  },
  content: {
    gap: 10,
  },
  title: {
    minHeight: 44,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  categoryChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 12,
    gap: 6,
    maxWidth: "70%",
  },
  categoryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  pressed: {
    opacity: 0.85,
  },
});

export default GuideThumbnailCard;
