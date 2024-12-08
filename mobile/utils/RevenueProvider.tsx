import React, { createContext, useContext, useEffect, useState } from "react";
import { Platform } from "react-native";
import Purchases, {
  CustomerInfo,
  PurchasesPackage,
} from "react-native-purchases";
import { useSupabase } from "./SupabaseProvider";

interface RevenueContextType {
  loading: boolean;
  // subscribed: boolean;
  customerInfo: CustomerInfo | undefined;
  // checkPaywall: () => Promise<boolean | undefined>;
  // display: () => Promise<void>;
  purchaseTokens: (pack: PurchasesPackage) => Promise<boolean>;
}

const RevenueContext = createContext<RevenueContextType | undefined>(undefined);

export const RevenueProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { updateProfile } = useSupabase();
  const [loading, setLoading] = useState(false);
  // const [subscribed, setSubscribed] = useState(false);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>();
  const [offerings, setOfferings] = useState<PurchasesPackage[] | null>(null);

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
        Purchases.addCustomerInfoUpdateListener((customerInfo) => {
          setCustomerInfo(customerInfo);
        });
        // await checkSubscriptionStatus();
        await loadOfferings();
      } catch (error) {
        console.error("RevenueCat setup error", error);
      }
    };

    setup().catch((error) => console.error("RevenueCat setup error", error));
  }, []);

  const loadOfferings = async () => {
    const offerings = await Purchases.getOfferings();
    const currentOfferings = offerings.current;
    if (currentOfferings) {
      setOfferings(currentOfferings.availablePackages);
    }
  };

  // const checkSubscriptionStatus = async () => {
  //   try {
  //     const customerInfo = await Purchases.getCustomerInfo();
  //     setCustomerInfo(customerInfo);
  //   } catch (error) {
  //     console.error("Error fetching customer info", error);
  //   }
  // };

  const purchaseTokens = async (pack: PurchasesPackage) => {
    setLoading(true);
    try {
      await Purchases.purchasePackage(pack);

      if (
        pack.product.identifier === "ten_token" ||
        pack.product.identifier === "ios_ten_token" ||
        pack.product.identifier === "android_ten_token"
      ) {
        updateProfile({ tokens: 10 });
      } else if (
        pack.product.identifier === "hundred_token" ||
        pack.product.identifier === "ios_hundred_token" ||
        pack.product.identifier === "android_hundred_token"
      ) {
        updateProfile({ tokens: 100 });
      }
      return true;
    } catch (error) {
      console.error("Error purchasing tokens", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // const display = async () => {
  //   console.log("display");
  //   try {
  //     const offerings = await Purchases.getOfferings();
  //     console.log("offerings", offerings);

  //     if (offerings.current !== null) {
  //       const paywallResult: PAYWALL_RESULT = await RevenueCatUI.presentPaywall(
  //         {
  //           offering: offerings.current,
  //           displayCloseButton: true,
  //         }
  //       );
  //       if (paywallResult === PAYWALL_RESULT.PURCHASED) {
  //         console.log(customerInfo);
  //       }
  //     }
  //   } catch (error) {
  //     console.error("Error displaying paywall", error);
  //   }
  // };

  // const checkPaywall = async () => {
  //   console.log("checkPaywall");
  //   setLoading(true);
  //   try {
  //     const paywallResult: PAYWALL_RESULT =
  //       await RevenueCatUI.presentPaywallIfNeeded({
  //         requiredEntitlementIdentifier: "pro",
  //       });

  //     switch (paywallResult) {
  //       case PAYWALL_RESULT.PURCHASED:
  //       case PAYWALL_RESULT.RESTORED:
  //       case PAYWALL_RESULT.NOT_PRESENTED:
  //         setSubscribed(true);
  //         await checkSubscriptionStatus();
  //         return true;
  //       case PAYWALL_RESULT.CANCELLED:
  //       case PAYWALL_RESULT.ERROR:
  //         setSubscribed(false);
  //         return false;
  //       default:
  //         setSubscribed(false);
  //         return false;
  //     }
  //   } catch (error) {
  //     console.error("Error checking paywall", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <RevenueContext.Provider
      value={{
        loading,
        // subscribed,
        customerInfo,
        // checkPaywall,
        // display,
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
