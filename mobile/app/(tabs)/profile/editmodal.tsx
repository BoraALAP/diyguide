import React from "react";
import { StyleSheet } from "react-native";

import { Button } from "@/components/Button";
import { useSupabase } from "@/utils/SupabaseProvider";
import { router } from "expo-router";

import Input from "@/components/Input";
import { ViewT } from "@/components/Themed";

export default function EditProfileModal() {
  const { profile, loading, updateProfile } = useSupabase();
  const [fullName, setFullName] = React.useState(profile?.full_name || "");

  const handleSave = async () => {
    await updateProfile({ full_name: fullName });
    router.back();
  };

  return (
    <ViewT style={styles.container}>
      <ViewT style={styles.content}>
        <Input
          label="Full Name"
          value={fullName}
          onChangeText={setFullName}
          placeholder="Full Name"
        />

        <ViewT style={styles.buttonContainer}>
          <Button
            onPress={handleSave}
            disabled={loading}
            title={loading ? "Saving..." : "Save"}
            variant="primary"
            size="large"
          />
          <Button
            onPress={() => router.back()}
            title="Cancel"
            variant="secondary"
            size="large"
          />
        </ViewT>
      </ViewT>
    </ViewT>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  content: {
    flex: 1,
    gap: 24,
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
  buttonContainer: {
    position: "absolute",
    bottom: 24,
    width: "100%",
    gap: 16,
  },
});
