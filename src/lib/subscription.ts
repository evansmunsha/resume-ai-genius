import { env } from "@/env";
import { cache } from "react";
import prisma from "./prisma";

export type SubscriptionLevel = "FREE" | "PRO" | "ENTERPRISE";

export const getUserSubscriptionLevel = cache(
  async (userId: string): Promise<SubscriptionLevel> => {
    const subscription = await prisma?.userSubscription.findUnique({
      where: { userId },
    });

    if (!subscription) {
      return "FREE";
    }

    const now = new Date();

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
