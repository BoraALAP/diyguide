import React from "react";
import { Pressable, PressableProps, StyleSheet } from "react-native";
import Typography from "./Typography";
import Colors from "@/constants/Colors";
import { useColorScheme } from "./useColorScheme";

interface SecondaryButtonProps extends Omit<PressableProps, "style"> {
  title?: string;
  compact?: boolean;
  disabled?: boolean;
  style?: any;
}

const SecondaryButton: React.FC<SecondaryButtonProps> = ({
  title = "Generate",
  compact = false,
  disabled = false,
  style,
  onPress,
  ...props
}) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  return (
    <Pressable
      {...props}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        compact ? styles.compact : styles.regular,
        {
          borderColor: disabled ? colors.disabledText : colors.primary,
        },
        pressed && styles.pressed,
        style,
      ]}
    >
      <Typography
        variant="body"
        weight="regular"
        color={disabled ? colors.disabledText : colors.text}
        font="lexend"
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
    justifyContent: "center",
    backgroundColor: "transparent",
    borderWidth: 1,
    borderRadius: 8,
    gap: 8,
  },
  regular: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    minHeight: 34,
  },
  compact: {
    paddingHorizontal: 6,
    paddingVertical: 4,
    minHeight: 30,
  },
  pressed: {
    opacity: 0.8,
  },
});

export default SecondaryButton;