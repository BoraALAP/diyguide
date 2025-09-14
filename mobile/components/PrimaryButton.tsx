import React from "react";
import { Pressable, PressableProps, StyleSheet, ActivityIndicator } from "react-native";
import Typography from "./Typography";
import Colors from "@/constants/Colors";
import { useColorScheme } from "./useColorScheme";

interface PrimaryButtonProps extends Omit<PressableProps, "style"> {
  title?: string;
  loading?: boolean;
  disabled?: boolean;
  style?: any;
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  title = "Generate",
  loading = false,
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
      disabled={disabled || loading}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: disabled ? colors.disabledBackground : colors.primary,
        },
        pressed && styles.pressed,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={colors.invertText} />
      ) : (
        <Typography
          variant="body"
          weight="regular"
          color={disabled ? colors.disabledText : colors.invertText}
          font="lexend"
        >
          {title}
        </Typography>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
    minHeight: 34,
    gap: 8,
  },
  pressed: {
    opacity: 0.8,
  },
});

export default PrimaryButton;