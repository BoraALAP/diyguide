import React, { useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TextInputProps,
} from "react-native";
import Typography from "./Typography";
import Colors from "@/constants/Colors";
import { useColorScheme } from "./useColorScheme";

interface FormInputProps extends Omit<TextInputProps, "style"> {
  label?: string;
  status?: "default" | "filled" | "active" | "disabled";
  style?: any;
}

const FormInput: React.FC<FormInputProps> = ({
  label = "Label",
  placeholder = "Placeholder",
  value,
  onChangeText,
  status = "default",
  editable = true,
  style,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState(value || "");
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const handleTextChange = (text: string) => {
    setInputValue(text);
    onChangeText?.(text);
  };

  const getContainerStyle = () => {
    const isDisabled = !editable || status === "disabled";
    const isFilled = status === "filled" || inputValue.length > 0;
    const isActive = status === "active" || isFocused;

    return {
      backgroundColor: isDisabled
        ? colors.inputBackgroundDisabled
        : colors.inputBackground,
      borderWidth: isFilled ? 0 : 1,
      borderColor: isDisabled
        ? colors.border
        : colors.border,
    };
  };

  const getLabelColor = () => {
    const isDisabled = !editable || status === "disabled";
    const isActive = status === "active" || isFocused;

    if (isDisabled) return colors.secondaryText;
    if (isActive) return colors.primaryDark;
    return colors.secondaryText;
  };

  const getInputColor = () => {
    const isDisabled = !editable || status === "disabled";
    const isFilled = status === "filled" || inputValue.length > 0;

    if (isDisabled) return colors.lightText;
    if (isFilled) return colors.text;
    return colors.lightText;
  };

  return (
    <View style={[styles.container, getContainerStyle(), style]}>
      <Typography
        variant="label"
        color={getLabelColor()}
        style={styles.label}
      >
        {label}
      </Typography>

      <TextInput
        {...props}
        value={inputValue}
        onChangeText={handleTextChange}
        placeholder={placeholder}
        placeholderTextColor={colors.lightText}
        editable={editable && status !== "disabled"}
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
          {
            color: getInputColor(),
            fontFamily: "Lexend_400Regular",
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    minHeight: 51,
    justifyContent: "center",
  },
  label: {
    width: "100%",
    marginBottom: 2,
  },
  textInput: {
    fontSize: 14,
    lineHeight: 21,
    minHeight: 22,
    padding: 0,
    margin: 0,
    width: "100%",
  },
});

export default FormInput;