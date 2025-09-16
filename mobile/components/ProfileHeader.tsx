/**
 * ProfileHeader presents the user's avatar, name, token balance, and a
 * purchase CTA. Use at the top of identity-focused screens.
 */
import React from "react";
import { View, StyleSheet, Image, Pressable } from "react-native";
import Typography from "./Typography";
import Colors from "@/constants/Colors";
import { useColorScheme } from "./useColorScheme";

interface ProfileHeaderProps {
  avatarUrl?: string;
  name?: string;
  tokens?: number;
  onPurchasePress?: () => void;
  style?: any;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  avatarUrl,
  name = "User Name",
  tokens = 0,
  onPurchasePress,
  style,
}) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const defaultAvatarUrl = `https://avatar.vercel.sh/${name}`;

  return (
    <View style={[styles.container, style]}>
      <Image
        source={{ uri: avatarUrl || defaultAvatarUrl }}
        style={styles.avatar}
      />
      <View style={styles.userInfo}>
        <Typography
          variant="h2"
          weight="semiBold"
          font="literata"
          color={colors.text}
          style={styles.name}
        >
          {name}
        </Typography>
        <Typography
          variant="body"
          color={colors.secondaryText}
          style={styles.tokens}
        >
          Tokens: {tokens}
        </Typography>
      </View>
      <Pressable
        onPress={onPurchasePress}
        style={({ pressed }) => [
          styles.purchaseButton,
          pressed && styles.purchaseButtonPressed,
        ]}
      >
        <Typography
          variant="body"
          color={colors.invertText}
          style={styles.purchaseText}
        >
          Purchase
        </Typography>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    paddingHorizontal: 16,
    paddingVertical: 0,
    width: "100%",
  },
  avatar: {
    width: 64, // size-16 = 64px
    height: 64,
    borderRadius: 16,
    backgroundColor: "#ffffff",
  },
  userInfo: {
    flex: 1,
    justifyContent: "center",
  },
  name: {
    // Typography component handles font styling
  },
  tokens: {
    // Typography component handles font styling
  },
  purchaseButton: {
    backgroundColor: "#007399", // Primary color
    paddingHorizontal: 8, // px-2
    paddingVertical: 6, // py-1.5
    borderRadius: 8,
    gap: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  purchaseButtonPressed: {
    opacity: 0.8,
  },
  purchaseText: {
    fontSize: 14,
    fontWeight: "400",
    letterSpacing: -0.43,
  },
});

export default ProfileHeader;