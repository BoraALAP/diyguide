import React, { useState } from "react";
import {
  TextInput,
  TextInputProps,
  View,
  StyleSheet,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Typography from "./Typography";
import { useColorScheme } from "./useColorScheme";
import Colors from "@/constants/Colors";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightIconPress?: () => void;
  variant?: "outlined" | "filled";
  size?: "small" | "medium" | "large";
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  onRightIconPress,
  variant = "outlined",
  size = "medium",
  style,
  editable = true,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const getSizeStyles = () => {
    switch (size) {
      case "small":
        return {
          input: { height: 36, fontSize: 14 },
          padding: { paddingHorizontal: 12 },
          iconSize: 18,
        };
      case "medium":
        return {
          input: { height: 44, fontSize: 16 },
          padding: { paddingHorizontal: 16 },
          iconSize: 20,
        };
      case "large":
        return {
          input: { height: 52, fontSize: 18 },
          padding: { paddingHorizontal: 20 },
          iconSize: 24,
        };
      default:
        return {
          input: { height: 44, fontSize: 16 },
          padding: { paddingHorizontal: 16 },
          iconSize: 20,
        };
    }
  };

  const getVariantStyles = () => {
    const baseStyle = {
      borderRadius: 8,
      borderWidth: variant === "outlined" ? 1 : 0,
    };

    if (error) {
      return {
        ...baseStyle,
        borderColor: colors.error,
        backgroundColor: variant === "filled" ? colors.errorBackground : "transparent",
      };
    }

    if (isFocused) {
      return {
        ...baseStyle,
        borderColor: variant === "outlined" ? colors.tint : "transparent",
        backgroundColor: variant === "filled" ? colors.inputBackgroundFocused : "transparent",
        borderWidth: variant === "outlined" ? 2 : 0,
      };
    }

    if (!editable) {
      return {
        ...baseStyle,
        borderColor: variant === "outlined" ? colors.disabled : "transparent",
        backgroundColor: colors.disabledBackground,
      };
    }

    return {
      ...baseStyle,
      borderColor: variant === "outlined" ? colors.border || colors.icon : "transparent",
      backgroundColor: variant === "filled" ? colors.inputBackground || colors.secondaryBackground : "transparent",
    };
  };

  const sizeStyles = getSizeStyles();
  const variantStyles = getVariantStyles();

  return (
    <View style={styles.container}>
      {label && (
        <Typography
          variant="body2"
          weight="medium"
          color={error ? colors.error : colors.text}
          style={styles.label}
          font="lexend"
        >
          {label}
        </Typography>
      )}

      <View style={[styles.inputContainer, variantStyles]}>
        {leftIcon && (
          <Ionicons
            name={leftIcon}
            size={sizeStyles.iconSize}
            color={error ? colors.error : colors.icon}
            style={styles.leftIcon}
          />
        )}

        <TextInput
          {...props}
          editable={editable}
          style={[
            styles.input,
            sizeStyles.input,
            sizeStyles.padding,
            leftIcon && { paddingLeft: 0 },
            rightIcon && { paddingRight: 0 },
            { color: colors.text, fontFamily: "Lexend_400Regular" },
            style,
          ]}
          placeholderTextColor={colors.placeholderText || colors.icon}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
        />

        {rightIcon && (
          <Pressable
            onPress={onRightIconPress}
            disabled={!onRightIconPress}
            style={styles.rightIconContainer}
          >
            <Ionicons
              name={rightIcon}
              size={sizeStyles.iconSize}
              color={error ? colors.error : colors.icon}
            />
          </Pressable>
        )}
      </View>

      {(error || helperText) && (
        <Typography
          variant="caption"
          weight="regular"
          color={error ? colors.error : colors.secondaryText || colors.icon}
          style={styles.helperText}
          font="lexend"
        >
          {error || helperText}
        </Typography>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  label: {
    marginBottom: 6,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
  },
  input: {
    flex: 1,
  },
  leftIcon: {
    marginLeft: 12,
    marginRight: 8,
  },
  rightIconContainer: {
    paddingHorizontal: 12,
  },
  helperText: {
    marginTop: 4,
    marginLeft: 4,
  },
});

export default Input;
