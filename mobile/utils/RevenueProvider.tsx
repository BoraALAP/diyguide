import React, { createContext, useContext, useEffect, useState } from "react";
import { Platform } from "react-native";
import Purchases, {
  CustomerInfo,
  PurchasesOffering,
} from "react-native-purchases";
import RevenueCatUI, { PAYWALL_RESULT } from "react-native-purchases-ui";

interface RevenueContextType {
  loading: boolean;
  subscribed: boolean;
  customerInfo: CustomerInfo | undefined;
  checkPaywall: () => Promise<boolean | undefined>;
  display: () => Promise<void>;
  purchaseTokens: () => Promise<boolean>;
}

const RevenueContext = createContext<RevenueContextType | undefined>(undefined);

export const RevenueProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>();

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
        await checkSubscriptionStatus();
      } catch (error) {
        console.error("RevenueCat setup error", error);
      }
    };

    setup().catch((error) => console.error("RevenueCat setup error", error));
  }, []);

  const checkSubscriptionStatus = async () => {
    try {
      const customerInfo = await Purchases.getCustomerInfo();
      setCustomerInfo(customerInfo);
    } catch (error) {
      console.error("Error fetching customer info", error);
    }
  };

  const display = async () => {
    try {
      const offerings = await Purchases.getOfferings();
      console.log("offerings", offerings);

      if (offerings.current !== null) {
        await RevenueCatUI.presentPaywall({
          offering: offerings.current,
        });
      }
    } catch (error) {
      console.error("Error displaying paywall", error);
    }
  };

  const checkPaywall = async () => {
    setLoading(true);
    try {
      const paywallResult: PAYWALL_RESULT =
        await RevenueCatUI.presentPaywallIfNeeded({
          requiredEntitlementIdentifier: "pro",
        });

      switch (paywallResult) {
        case PAYWALL_RESULT.PURCHASED:
        case PAYWALL_RESULT.RESTORED:
        case PAYWALL_RESULT.NOT_PRESENTED:
          setSubscribed(true);
          await checkSubscriptionStatus();
          return true;
        case PAYWALL_RESULT.CANCELLED:
        case PAYWALL_RESULT.ERROR:
          setSubscribed(false);
          return false;
        default:
          setSubscribed(false);
          return false;
      }
    } catch (error) {
      console.error("Error checking paywall", error);
    } finally {
      setLoading(false);
    }
  };

  const purchaseTokens = async () => {
    setLoading(true);
    try {
      const offerings = await Purchases.getOfferings();

      if (offerings.current) {
        const tokenPackage = offerings.current.availablePackages[0];

        const { customerInfo: updatedInfo } = await Purchases.purchasePackage(
          tokenPackage
        );
        setCustomerInfo(updatedInfo);
        await checkSubscriptionStatus();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error purchasing tokens", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <RevenueContext.Provider
      value={{
        loading,
        subscribed,
        customerInfo,
        checkPaywall,
        display,
        purchaseTokens,
      }}
    >
      {children}
    </RevenueContext.Provider>
  );
};

export const useRevenue = (): RevenueContextType => {
  const context = useContext(RevenueContext);
  if (!context) {
    throw new Error("useRevenue must be used within a RevenueProvider");
  }
  return context;
};
