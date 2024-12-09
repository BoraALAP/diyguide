import React, { useEffect, useState } from "react";
import { StyleSheet, useColorScheme } from "react-native";
import { TextT, ViewT, PageTitle, SecondaryText } from "@/components/Themed";
import { useRevenue } from "@/utils/RevenueProvider";
import { Button } from "@/components/Button";
import Purchases, {
  PurchasesOfferings,
  PurchasesPackage,
} from "react-native-purchases";
import { router } from "expo-router";
import Colors from "@/constants/Colors";

export default function PaywallScreen() {
  const colorScheme = useColorScheme();
  const [offerings, setOfferings] = useState<PurchasesOfferings | null>(null);
  const { loading, purchaseTokens } = useRevenue();
  const [selectedPackage, setSelectedPackage] =
    useState<PurchasesPackage | null>(null);

  useEffect(() => {
    const getOfferings = async () => {
      try {
        const offerings = await Purchases.getOfferings();
        setOfferings(offerings);
      } catch (error) {
        console.error("Error fetching offerings:", error);
      }
    };

    getOfferings();
  }, []);

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
      bottom: 24,
      width: "100%",
    },
  });

  console.log(offerings);

  return (
    <ViewT style={styles.container}>
      <ViewT style={styles.content}>
        <PageTitle>Get More Tokens</PageTitle>
        <SecondaryText>
          Purchase tokens to continue generating amazing content
        </SecondaryText>

        {offerings?.current?.availablePackages.map((pkg, index) => (
          <ViewT
            key={index}
            style={[
              styles.packageContainer,
              selectedPackage === pkg && styles.selectedPackage,
            ]}
            onTouchEnd={() => setSelectedPackage(pkg)}
          >
            <TextT bold>{pkg.product.title}</TextT>
            <TextT>{pkg.product.description}</TextT>
            <TextT>{pkg.product.priceString}</TextT>
          </ViewT>
        ))}
        <ViewT style={styles.buttonContainer}>
          <Button
            onPress={handlePurchase}
            title={loading ? "Processing..." : "Purchase Selected Package"}
            variant="primary"
            size="large"
            disabled={loading || !selectedPackage}
          />
        </ViewT>
      </ViewT>
    </ViewT>
  );
}
