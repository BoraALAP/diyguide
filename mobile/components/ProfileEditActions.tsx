/**
 * ProfileEditActions pairs Save and Cancel buttons aligned to the right for
 * profile editing flows.
 */
import React from "react";
import { View, StyleSheet } from "react-native";
import Button from "./Button";

interface ProfileEditActionsProps {
  onSavePress: () => void;
  onCancelPress: () => void;
  style?: any;
}

const ProfileEditActions: React.FC<ProfileEditActionsProps> = ({
  onSavePress,
  onCancelPress,
  style,
}) => {

  return (
    <View style={[styles.container, style]}>
      <Button title="Save" onPress={onSavePress} variant="primary" size="medium" />
      <Button title="Cancel" onPress={onCancelPress} variant="secondary" size="medium" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "flex-end", // Align to the right like in Figma
    gap: 8, // gap between Save and Cancel buttons
    paddingHorizontal: 16, // Match the input padding
    marginTop: 12, // Space above the buttons
  },
});

export default ProfileEditActions;
