import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";
import { router } from "expo-router";
import RevenueCatUI from "react-native-purchases-ui";
import { PurchasesPackage } from "react-native-purchases";
import type { PurchasesStoreTransaction } from "@revenuecat/purchases-typescript-internal";

import Button from "@/components/Button";
import Colors from "@/constants/Colors";
import { useRevenue } from "@/utils/RevenueProvider";

export default function PaywallScreen() {
  const colorScheme = useColorScheme();
  const {
    initializing,
    loading,
    offerings,
    refreshOfferings,
    restorePurchases,
    purchaseTokens,
    creditTokensForProduct,
  } = useRevenue();

  const [selectedPackage, setSelectedPackage] =
    useState<PurchasesPackage | null>(null);
  const [useFallbackPaywall, setUseFallbackPaywall] = useState(false);

  useEffect(() => {
    if (!initializing && !offerings) {
      refreshOfferings().catch(() => setUseFallbackPaywall(true));
    }
  }, [initializing, offerings, refreshOfferings]);

  useEffect(() => {
    if (!selectedPackage && offerings?.current?.availablePackages.length) {
      setSelectedPackage(offerings.current.availablePackages[0]);
    }
  }, [offerings, selectedPackage]);

  const handleDismiss = useCallback(() => {
    router.back();
  }, []);

  const handleRevenueCatPurchase = useCallback(
    async ({
      storeTransaction,
    }: {
      storeTransaction: PurchasesStoreTransaction;
    }) => {
      const productId = storeTransaction?.productIdentifier;
      if (productId) {
        await creditTokensForProduct(productId);
      }
      handleDismiss();
    },
    [creditTokensForProduct, handleDismiss]
  );

  const handleRevenueCatRestore = useCallback(async (_event?: unknown) => {
    await refreshOfferings();
  }, [refreshOfferings]);

  const handleRevenueCatError = useCallback((_event?: unknown) => {
    setUseFallbackPaywall(true);
  }, []);

  const handlePurchase = async () => {
    if (!selectedPackage) {
      console.log("No package selected");
      return;
    }

    const result = await purchaseTokens(selectedPackage);
    if (result) {
      router.back();
    }
  };

  const styles = StyleSheet.create({
    fullScreen: {
      flex: 1,
    },
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

  if (!useFallbackPaywall) {
    return (
      <View style={styles.fullScreen}>
        <RevenueCatUI.Paywall
          style={styles.fullScreen}
          options={{ offering: offerings?.current ?? undefined }}
          onDismiss={handleDismiss}
          onPurchaseCompleted={handleRevenueCatPurchase}
          onPurchaseError={handleRevenueCatError}
          onRestoreCompleted={handleRevenueCatRestore}
          onRestoreError={handleRevenueCatError}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text>Get More Tokens</Text>
        <Text>Purchase tokens to continue generating amazing content</Text>

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
