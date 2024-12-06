import React from "react";
import { StyleSheet, Image } from "react-native";
import { router } from "expo-router";

import Auth from "@/components/Auth";
import { useAuth } from "@/utils/AuthProvider";
import { Button } from "@/components/Button";
import { View, PageTitle, SecondaryText } from "@/components/Themed";
import PurchaseButton from "@/components/PurchaseButton";

const ProfileScreen = () => {
  const { profile, loading, signOut } = useAuth();

  return (
    <View style={styles.container}>
      {!profile ? (
        <Auth />
      ) : (
        <View style={styles.profileContainer}>
          <View style={styles.avatarContainer}>
            <Image
              source={
                profile?.avatar_url
                  ? { uri: profile.avatar_url }
                  : {
                      uri: `https://avatar.vercel.sh/${
                        profile?.full_name ? profile?.full_name : "rauchg"
                      }`,
                    }
              }
              style={styles.avatar}
            />
            <View style={styles.userInfo}>
              <PageTitle>{profile?.full_name || "Add your name"}</PageTitle>
              <SecondaryText>Available Tokens: {profile.tokens}</SecondaryText>
            </View>
          </View>
          <PurchaseButton />

          <View style={styles.buttonContainer}>
            <Button
              onPress={() => router.push("/profile/editmodal")}
              title="Edit Profile"
              variant="secondary"
              size="large"
            />
            <Button
              onPress={signOut}
              disabled={loading}
              title={loading ? "Signing out..." : "Sign Out"}
              variant="secondary"
              size="large"
            />
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    height: "100%",
  },
  profileContainer: {
    gap: 24,
    flex: 1,
    paddingTop: 100,
  },
  avatarContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  userInfo: {
    flex: 1,
    gap: 4,
  },
  buttonContainer: {
    gap: 12,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
});

export default ProfileScreen;
