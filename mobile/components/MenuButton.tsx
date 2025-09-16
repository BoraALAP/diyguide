/**
 * MenuButton renders a light-weight action row with optional Ionicon support.
 * Use for settings or contextual actions in menus.
 */
import React from "react";
import { Pressable, PressableProps, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Typography from "./Typography";
import Colors from "@/constants/Colors";
import { useColorScheme } from "./useColorScheme";

interface MenuButtonProps extends Omit<PressableProps, "style"> {
  title: string;
  icon?: keyof typeof Ionicons.glyphMap;
  variant?: "default" | "destructive";
  disabled?: boolean;
  style?: any;
}

const MenuButton: React.FC<MenuButtonProps> = ({
  title,
  icon,
  variant = "default",
  disabled = false,
  style,
  ...props
}) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const getColor = () => {
    if (disabled) return colors.disabledText;
    return variant === "destructive" ? "#a00000" : colors.text;
  };

  return (
    <Pressable
      {...props}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        pressed && styles.pressed,
        style,
      ]}
    >
      {icon && (
        <Ionicons
          name={icon}
          size={16}
          color={getColor()}
          style={styles.icon}
        />
      )}
      <Typography
        variant="body"
        color={getColor()}
        style={styles.text}
      >
        {title}
      </Typography>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8, // gap-2
    paddingHorizontal: 16, // px-4
    paddingVertical: 4, // py-1
    borderRadius: 4,
    height: 42,
  },
  pressed: {
    opacity: 0.7,
  },
  icon: {
    // Icon styling handled by Ionicons
  },
  text: {
    // Typography component handles font styling
  },
});

export default MenuButton;