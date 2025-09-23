import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Alert, Platform } from "react-native";
import Purchases, {
  CustomerInfo,
  PurchasesOfferings,
  PurchasesPackage,
} from "react-native-purchases";
import { useSupabase } from "./SupabaseProvider";

interface RevenueContextType {
  initializing: boolean;
  loading: boolean;
  customerInfo: CustomerInfo | undefined;
  offerings: PurchasesOfferings | null;
  refreshOfferings: () => Promise<void>;
  restorePurchases: () => Promise<boolean>;
  purchaseTokens: (pack: PurchasesPackage) => Promise<boolean>;
}

const RevenueContext = createContext<RevenueContextType | undefined>(undefined);

export const RevenueProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { session, updateProfile } = useSupabase();
  const [initializing, setInitializing] = useState(true);
  const [loading, setLoading] = useState(false);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>();
  const [offerings, setOfferings] = useState<PurchasesOfferings | null>(null);
  const [isConfigured, setIsConfigured] = useState(false);

  const tokenRewards = useMemo(
    () => ({
      ten_token: 10,
      ios_ten_tokens: 10,
      android_ten_tokens: 10,
      hundred_token: 100,
      ios_hundred_tokens: 100,
      android_hundred_tokens: 100,
    }),
    []
  );

  const loadOfferings = useCallback(async () => {
    try {
      const offeringsResult = await Purchases.getOfferings();
      setOfferings(offeringsResult);
    } catch (error) {
      console.error("Error loading offerings", error);
    }
  }, []);

  useEffect(() => {
    const setup = async () => {
      const apiKey =
        Platform.OS === "android"
          ? (process.env.EXPO_PUBLIC_REVENUE_CAT_ANDROID as string)
          : (process.env.EXPO_PUBLIC_REVENUE_CAT_IOS as string);

      try {
        setInitializing(true);
        if (!apiKey) {
          console.warn("RevenueCat API key is not configured for this platform");
          return;
        }
        await Purchases.configure({
          apiKey: apiKey,
        });
        setIsConfigured(true);

        Purchases.setLogLevel(Purchases.LOG_LEVEL.DEBUG);
        const listener = Purchases.addCustomerInfoUpdateListener((customerInfo) => {
          setCustomerInfo(customerInfo);
        });

        const info = await Purchases.getCustomerInfo();
        setCustomerInfo(info);
        await loadOfferings();

        return () => {
          Purchases.removeCustomerInfoUpdateListener(listener);
        };
      } catch (error) {
        console.error("RevenueCat setup error", error);
      }
    };

    let cleanup: (() => void) | undefined;
    setup()
      .then((result) => {
        cleanup = result || undefined;
      })
      .catch((error) => console.error("RevenueCat setup error", error))
      .finally(() => setInitializing(false));

    return () => {
      cleanup?.();
    };
  }, [loadOfferings]);

  const userId = session?.user?.id;

  useEffect(() => {
    if (!isConfigured) return;

    const syncUser = async () => {
      try {
        if (userId) {
          const { customerInfo: info } = await Purchases.logIn(userId);
          setCustomerInfo(info);
        } else {
          await Purchases.logOut();
          setCustomerInfo(undefined);
        }
      } catch (error) {
        console.error("RevenueCat auth sync error", error);
      }
    };

    syncUser();
  }, [isConfigured, userId]);

  const purchaseTokens = async (pack: PurchasesPackage) => {
    setLoading(true);
    try {
      const { customerInfo: updatedCustomerInfo } =
        await Purchases.purchasePackage(pack);

      setCustomerInfo(updatedCustomerInfo);

      const reward = tokenRewards[pack.product.identifier];
      if (reward) {
        await updateProfile({ tokens: reward });
      }
      await loadOfferings();
      return true;
    } catch (error) {
      console.error("Error purchasing tokens", error);
      Alert.alert(
        "You didn't complete the purchase",
        "Please give it another try"
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  const restorePurchases = async () => {
    setLoading(true);
    try {
      const restoredCustomerInfo = await Purchases.restorePurchases();
      setCustomerInfo(restoredCustomerInfo);
      await loadOfferings();
      return true;
    } catch (error) {
      console.error("Error restoring purchases", error);
      Alert.alert(
        "We couldn't restore purchases",
        "Double-check that you're signed in with the same account and try again."
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <RevenueContext.Provider
      value={{
        initializing,
        loading,
        customerInfo,
        offerings,
        refreshOfferings: loadOfferings,
        restorePurchases,
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
