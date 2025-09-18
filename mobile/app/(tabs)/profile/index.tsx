import React from "react";
import {
  ScrollView,
  StyleSheet,
  RefreshControl,

  View,
  useColorScheme,
} from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";



import Auth from "@/components/Auth";
import ProfileHeader from "@/components/ProfileHeader";
import ProfileSection from "@/components/ProfileSection";
import Input from "@/components/Input";
import ProfileEditActions from "@/components/ProfileEditActions";
import MenuButton from "@/components/MenuButton";

import { useSupabase } from "@/utils/SupabaseProvider";
import Colors from "@/constants/Colors";

export default function ProfileScreen() {
  const { profile, loading, signOut, deleteUser, updateProfile } = useSupabase();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const [isEditMode, setIsEditMode] = React.useState(false);
  const [editedProfile, setEditedProfile] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  // Initialize edited profile when entering edit mode
  React.useEffect(() => {
    if (isEditMode) {
      setEditedProfile({
        firstName: profile?.first_name || "",
        lastName: profile?.last_name || "",
        email: profile?.email || "",
      });
    }
  }, [isEditMode, profile]);

  const handlePurchasePress = () => {
    router.push("/profile/paywall");
  };

  const handleEditPress = () => {
    setIsEditMode(true);
  };

  const handleSavePress = async () => {
    const firstName = editedProfile.firstName?.trim() || null;
    const lastName = editedProfile.lastName?.trim() || null;
    const fullName = [firstName || "", lastName || ""].join(" ").trim() || null;

    await updateProfile({
      first_name: firstName,
      last_name: lastName,
      full_name: fullName,
    });

    setIsEditMode(false);
  };

  const handleCancelPress = () => {
    // Discard changes and exit edit mode
    setIsEditMode(false);
    setEditedProfile({
      firstName: "",
      lastName: "",
      email: "",
    });
  };

  const handleSeeAllPress = () => {
    // Navigate to full purchase history
    console.log("See all purchases");
  };

  const handleRefresh = async () => {
    // Refresh profile data
    console.log("Refresh profile");
  };



  if (!profile) {
    return <Auth />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView

        contentContainerStyle={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={handleRefresh} />
        }
      >
        <View style={styles.content}>
          {/* Profile Header */}
          <ProfileHeader
            avatarUrl={profile.avatar_url || ""}
            name={profile.full_name || "Add your name"}
            tokens={profile.tokens || 0}
            onPurchasePress={handlePurchasePress}
          />

          {/* Profile Information Section */}
          <ProfileSection
            title="Profile"
            actionLabel={isEditMode ? undefined : "Edit"}
            onActionPress={handleEditPress}
          >
            <Input
              label="First Name"
              placeholder="Your first name"
              value={isEditMode ? editedProfile.firstName : profile.first_name}
              disabled={!isEditMode}
              onChangeText={(text) =>
                setEditedProfile(prev => ({ ...prev, firstName: text }))
              }
            />
            <Input
              label="Last Name"
              placeholder="Your last name"
              value={isEditMode ? editedProfile.lastName : profile.last_name}
              disabled={!isEditMode}
              onChangeText={(text) =>
                setEditedProfile(prev => ({ ...prev, lastName: text }))
              }
            />
            <Input
              label="Email"
              placeholder="Your email"
              value={profile.email}
              disabled={true}
            />
            {isEditMode && (
              <ProfileEditActions
                onSavePress={handleSavePress}
                onCancelPress={handleCancelPress}
              />
            )}
          </ProfileSection>

          {/* Purchases Section */}
          {/* <ProfileSection
          title="Purchases"
          actionLabel="See All"
          onActionPress={handleSeeAllPress}
          showBorder={true}
        >
          {mockPurchases.map((purchase) => (
            <PurchaseItem
              key={purchase.id}
              date={purchase.date}
              tokens={purchase.tokens}
              price={purchase.price}
            />
          ))}
        </ProfileSection> */}

          {/* Footer with Logout */}
          <View style={[styles.footer, { borderColor: colors.borderSeperator }]}>
            <MenuButton
              title="Delete Account"
              icon="warning-outline"
              variant="destructive"
              onPress={deleteUser}
              disabled={loading}
            />
            <MenuButton
              title="Logout"
              icon="log-out-outline"
              variant="destructive"
              onPress={signOut}
              disabled={loading}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    paddingHorizontal: 16, // px-4 from Figma
    paddingTop: 32, // Custom top padding
    gap: 24, // gap-6 from Figma
    flex: 1,
  },
  footer: {

    justifyContent: "flex-end",
    paddingTop: 16,
    borderTopWidth: 1,
  },

});
