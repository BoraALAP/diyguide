import React, { useState } from "react";
import { Button } from "./Button";

import { useRevenue } from "@/utils/RevenueProvider";
import { router } from "expo-router";

interface PurchaseButtonProps {
  variant?: "primary" | "secondary";
  size?: "small" | "medium" | "large";
}

const PurchaseButton = ({
  variant = "primary",
  size = "large",
}: PurchaseButtonProps) => {
  const { loading } = useRevenue();

  return (
    <>
      <Button
        onPress={() => router.push("/profile/paywall")}
        title={loading ? "Processing..." : "Buy More Tokens"}
        variant={variant}
        size={size}
        disabled={loading}
      />
    </>
  );
};

export default PurchaseButton;
