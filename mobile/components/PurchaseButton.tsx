import React from "react";
import Button from "./Button";
import { Alert } from "react-native";
import { useRevenue } from "@/utils/RevenueProvider";
interface PurchaseButtonProps {
  variant?: "primary" | "secondary";
  size?: "small" | "medium" | "large";
}

const PurchaseButton = ({
  variant = "primary",
  size = "large",
}: PurchaseButtonProps) => {
  const { loading, purchaseTokens, display } = useRevenue();

  const handlePurchase = async () => {
    try {
      await display();
      const success = await purchaseTokens();
      if (success) {
        Alert.alert("Success", "Tokens purchased successfully!");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to purchase tokens. Please try again.");
    }
  };

  return (
    <Button
      onPress={handlePurchase}
      title={loading ? "Processing..." : "Buy More Tokens"}
      variant={variant}
      size={size}
      disabled={loading}
    />
  );
};

export default PurchaseButton;
