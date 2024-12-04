import React, { PropsWithChildren, useEffect, useState } from "react";
import { Platform } from "react-native";
import Purchases, { PurchasesOffering } from "react-native-purchases";

const RevenueProvider = ({ children }: PropsWithChildren) => {
  useEffect(() => {
    const setup = async () => {
      const apiKey =
        Platform.OS === "android"
          ? (process.env.EXPO_PUBLIC_REVENUE_CAT_ANDROID as string)
          : (process.env.EXPO_PUBLIC_REVENUE_CAT_IOS as string);

      try {
        await Purchases.configure({
          apiKey: apiKey,
        });
        Purchases.setLogLevel(Purchases.LOG_LEVEL.DEBUG);
        const offerings = await Purchases.getOfferings();

        // setCurrentOffering(offerings.current);
      } catch (error) {
        console.error("RevenueCat setup error", error);
      }
    };

    setup().catch((error) => console.error("RevenueCat setup error", error));
  }, []);

  return <>{children}</>;
};

export default RevenueProvider;
