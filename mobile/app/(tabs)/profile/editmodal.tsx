import React from "react";
import { StyleSheet, TextInput, View, Platform } from "react-native";
import { Text } from "@/components/Themed";
import Button from "@/components/Button";
import { useAuth } from "@/utils/AuthProvider";
import { router } from "expo-router";

import Input from "@/components/Input";

export default function EditProfileModal() {
  const { profile, loading, updateProfile } = useAuth();
  const [fullName, setFullName] = React.useState(profile?.full_name || "");

  const handleSave = async () => {
    await updateProfile({ full_name: fullName });
    router.back();
  };

  return (
    <View style={styles.container}>
      <Input
        label="Full Name"
        value={fullName}
        onChangeText={setFullName}
        placeholder="Full Name"
      />

      <View style={styles.modalButtons}>
        <Button
          onPress={() => router.back()}
          title="Cancel"
          variant="secondary"
        />
        <Button
          onPress={handleSave}
          disabled={loading}
          title={loading ? "Saving..." : "Save"}
          variant="primary"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  bottomSheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingTop: 12,
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },

  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
});
