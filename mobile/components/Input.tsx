/**
 * Input is the shared text field with label, helper/error text, and stateful
 * styling tied to the active theme. Use for all text entry surfaces.
 */
import React, { useState, useEffect } from "react";
import { View, StyleSheet, TextInput, TextInputProps } from "react-native";
import Typography from "./Typography";
import Colors from "@/constants/Colors";
import { useColorScheme } from "./useColorScheme";

interface InputProps extends Omit<TextInputProps, "style" | "value" | "onChangeText"> {
  label: string;
  value?: string | null;
  placeholder: string;
  disabled?: boolean;
  onChangeText?: (text: string) => void;
  error?: string;
  helperText?: string;
  style?: any;
}

const Input: React.FC<InputProps> = ({
  label,
  value,
  placeholder,
  disabled = false,
  onChangeText,
  error,
  helperText,
  style,
  ...props
}) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const [inputValue, setInputValue] = useState(value || "");
  const [isFocused, setIsFocused] = useState(false);

  // Update inputValue when value prop changes
  useEffect(() => {
    setInputValue(value || "");
  }, [value]);

  // Determine the input state based on disabled and value
  const hasValue = value !== null && value !== "";
  const isDisabledWithValue = disabled && hasValue;
  const isDisabledEmpty = disabled && !hasValue;

  const handleChangeText = (text: string) => {
    setInputValue(text);
    onChangeText?.(text);
  };

  const getContainerStyle = () => {
    const baseStyle = {
      borderWidth: 1,
      borderRadius: 8,
      paddingHorizontal: 16,
      paddingVertical: 8,
      backgroundColor: colors.background,
      borderColor: colors.border,
    };

    if (error) {
      return {
        ...baseStyle,
        borderColor: colors.error,

      };
    }

    if (disabled) {
      return {
        ...baseStyle,
        backgroundColor: colors.inputBackgroundDisabled, // BG/Input/Disabled
        borderColor: isDisabledEmpty ? colors.border : colors.border, // Border/Input vs Border/Input/Filled
      };
    }

    if (isFocused) {
      return {
        ...baseStyle,
        borderColor: colors.primaryDark, // Primary-Dark for active state
        borderWidth: 1,
      };
    }

    return {
      ...baseStyle,
      borderColor: hasValue ? colors.borderInputFilled : colors.border, // Border/Input/Filled vs Border/Input
    };
  };

  const getLabelColor = () => {
    if (error) return colors.error;
    if (isFocused) return colors.primaryDark;
    return colors.secondaryText;
  };

  return (
    <View style={[getContainerStyle(), style]}>
      <Typography
        variant="label"
        weight="light"
        color={getLabelColor()}
        style={styles.label}
      >
        {label}
      </Typography>

      {disabled ? (
        <Typography
          variant="body"
          color={hasValue ? colors.text : colors.lightText}
          style={styles.value}
        >
          {hasValue ? value : placeholder}
        </Typography>
      ) : (
        <TextInput
          {...props}
          value={inputValue}
          onChangeText={handleChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.lightText}
          editable={!disabled}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          style={[
            styles.textInput,
            { color: colors.text }
          ]}
        />
      )}

      {(error || helperText) && (
        <Typography
          variant="label"
          weight="light"
          color={error ? colors.error : colors.secondaryText}
          style={styles.helperText}
        >
          {error || helperText}
        </Typography>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    width: "100%",
  },
  value: {
    width: "100%",
  },
  textInput: {
    fontSize: 14,
    fontFamily: "Lexend_400Regular",
    lineHeight: 21, // 1.5 line height
    width: "100%",
    padding: 0, // Remove default padding
    margin: 0, // Remove default margin
    minHeight: 21, // Ensure consistent height
  },
  helperText: {
    marginTop: 4,
    width: "100%",
  },
});

export default Input;