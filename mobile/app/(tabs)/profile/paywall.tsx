import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";

import { useRevenue } from "@/utils/RevenueProvider";
import Button from "@/components/Button";
import { PurchasesPackage } from "react-native-purchases";
import { router } from "expo-router";
import Colors from "@/constants/Colors";

export default function PaywallScreen() {
  const colorScheme = useColorScheme();
  const {
    initializing,
    loading,
    offerings,
    refreshOfferings,
    restorePurchases,
    purchaseTokens,
  } = useRevenue();
  const [selectedPackage, setSelectedPackage] =
    useState<PurchasesPackage | null>(null);

  useEffect(() => {
    if (!initializing && !offerings) {
      refreshOfferings();
    }
  }, [initializing, offerings, refreshOfferings]);

  useEffect(() => {
    if (!selectedPackage && offerings?.current?.availablePackages.length) {
      setSelectedPackage(offerings.current.availablePackages[0]);
    }
  }, [offerings, selectedPackage]);

  const handlePurchase = async () => {
    if (selectedPackage) {
      const result = await purchaseTokens(selectedPackage);
      if (result) {
        router.back();
      }
    } else {
      console.log("No package selected");
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 24,
    },
    content: {
      flex: 1,
      gap: 24,
      paddingBottom: 140,
    },
    packageContainer: {
      padding: 16,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: "#ccc",
      gap: 8,
    },
    selectedPackage: {
      borderColor: Colors[colorScheme ?? "light"].selectedPackageBorder,
      backgroundColor: Colors[colorScheme ?? "light"].selectedPackage,
    },
    buttonContainer: {
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 24,
      width: "100%",
      gap: 12,
    },
  });

  const availablePackages = useMemo(
    () => offerings?.current?.availablePackages ?? [],
    [offerings]
  );

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text>Get More Tokens</Text>
        <Text>
          Purchase tokens to continue generating amazing content
        </Text>

        {initializing ? (
          <ActivityIndicator size="large" />
        ) : availablePackages.length ? (
          availablePackages.map((pkg) => (
            <Pressable
              key={pkg.identifier}
              accessibilityRole="button"
              onPress={() => setSelectedPackage(pkg)}
              style={[
                styles.packageContainer,
                selectedPackage?.identifier === pkg.identifier &&
                  styles.selectedPackage,
              ]}
            >
              <Text>{pkg.product.title}</Text>
              <Text>{pkg.product.description}</Text>
              <Text>{pkg.product.priceString}</Text>
            </Pressable>
          ))
        ) : (
          <View>
            <Text>No packages available right now. Try again in a moment.</Text>
          </View>
        )}
        <View style={styles.buttonContainer}>
          <Button
            onPress={handlePurchase}
            title={loading ? "Processing..." : "Purchase Selected Package"}
            variant="primary"
            size="large"
            disabled={loading || initializing || !selectedPackage}
            loading={loading}
          />
          <Button
            onPress={restorePurchases}
            title="Restore Purchases"
            variant="secondary"
            size="large"
            disabled={loading || initializing}
          />
        </View>
      </View>
    </View>
  );
}
