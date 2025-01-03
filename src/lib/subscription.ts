import { env } from "@/env";
import { cache } from "react";
import prisma from "./prisma";

export type SubscriptionLevel = "FREE" | "PRO" | "ENTERPRISE";

export function calculateDiscountedPrice(originalPrice: number, discountPercentage: number = 20) {
  return (originalPrice * (100 - discountPercentage) / 100).toFixed(2);
}

export function isDiscountEligible(trialEndDate: Date | null, trialExpired: boolean): boolean {
  if (!trialEndDate || !trialExpired) return false;
  
  const now = new Date();
  const DISCOUNT_WINDOW = 7 * 24 * 60 * 60 * 1000; // 7 days
  return (now.getTime() - trialEndDate.getTime() <= DISCOUNT_WINDOW);
}

export const getUserSubscriptionLevel = cache(
  async (userId: string): Promise<SubscriptionLevel> => {
    const subscription = await prisma?.userSubscription.findUnique({
      where: { userId },
    });

    if (!subscription) {
      return "FREE";
    }

    const now = new Date();

    // Check if the PRO trial is active
    if (
      subscription.proTrialEnd &&
      subscription.proTrialEnd > now &&
      !subscription.proTrialExpired
    ) {
      return "PRO";
    }

    // Check if the ENTERPRISE trial is active
    if (
      subscription.enterpriseTrialEnd &&
      subscription.enterpriseTrialEnd > now &&
      !subscription.enterpriseTrialExpired
    ) {
      return "ENTERPRISE";
    }

    // Check if the paid subscription is still active
    if (subscription.stripeCurrentPeriodEnd > now) {
      if (
        subscription.stripePriceId === env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_MONTHLY
      ) {
        return "PRO";
      }

      if (
        subscription.stripePriceId ===
        env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_PLUS_MONTHLY
      ) {
        return "ENTERPRISE";
      }
    }

    return "FREE";
  }
);
