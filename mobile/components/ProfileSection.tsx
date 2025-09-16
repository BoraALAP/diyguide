/**
 * ProfileSection provides a titled container with optional header action and
 * border, keeping profile subsections consistent.
 */
import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import Typography from "./Typography";
import Colors from "@/constants/Colors";
import { useColorScheme } from "./useColorScheme";

interface ProfileSectionProps {
  title: string;
  actionLabel?: string;
  onActionPress?: () => void;
  children: React.ReactNode;
  showBorder?: boolean;
  style?: any;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({
  title,
  actionLabel,
  onActionPress,
  children,
  showBorder = false,
  style,
}) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  return (
    <View style={[styles.container, showBorder && styles.containerWithBorder, style]}>
      <View style={styles.header}>
        <Typography
          variant="h3"
          weight="bold"
          color={colors.text}
          style={styles.title}
        >
          {title}
        </Typography>
        {actionLabel && (
          <Pressable
            onPress={onActionPress}
            style={({ pressed }) => [
              styles.actionButton,
              pressed && styles.actionButtonPressed,
            ]}
          >
            <Typography
              variant="body"
              weight="medium"
              color={colors.primary}
              style={styles.actionText}
            >
              {actionLabel}
            </Typography>
          </Pressable>
        )}
      </View>
      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    gap: 8, // gap-2
  },
  containerWithBorder: {
    paddingTop: 24, // pt-6
    borderTopWidth: 1,
    borderTopColor: "#d9d9d9", // Border/Seperator
    borderStyle: "solid",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16, // px-4
    gap: 8, // gap-2
  },
  title: {
    flex: 1,
  },
  actionButton: {
    // No background styling needed
  },
  actionButtonPressed: {
    opacity: 0.7,
  },
  actionText: {
    textAlign: "right",
  },
  content: {
    gap: 8, // gap-2 for profile inputs, gap-1 for purchase items
  },
});

export default ProfileSection;