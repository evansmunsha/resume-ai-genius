import prisma from "@/lib/prisma";
import stripe from "@/lib/stripe";
import { auth } from "@clerk/nextjs/server";
import { formatDate } from "date-fns";
import { Metadata } from "next";
import Stripe from "stripe";
import GetSubscriptionButton from "./GetSubscriptionButton";
import ManageSubscriptionButton from "./ManageSubscriptionButton";

export const metadata: Metadata = {
  title: "Billing",
};

export default async function Page() {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  const subscription = await prisma.userSubscription.findUnique({
    where: { userId },
  });

  const now = new Date();

  // Debug logs
  console.log("Subscription data:", JSON.stringify(subscription, null, 2));
  console.log("Current time:", now);

  // Check if subscription is actually active
  const isSubscriptionActive = subscription?.stripeSubscriptionId && 
    subscription.stripeCurrentPeriodEnd > now &&
    subscription.subscriptionStatus !== "free" &&
    !subscription.stripeCancelAtPeriodEnd;

  // Check for active trials
  const hasActiveProTrial = subscription?.proTrialEnd && 
    new Date(subscription.proTrialEnd) > now && 
    !subscription.proTrialExpired;

  const hasActiveEnterpriseTrial = subscription?.enterpriseTrialEnd && 
    new Date(subscription.enterpriseTrialEnd) > now && 
    !subscription.enterpriseTrialExpired;

  // Debug logs
  console.log("Status checks:", {
    isSubscriptionActive,
    hasActiveProTrial,
    hasActiveEnterpriseTrial,
    proTrialExpired: subscription?.proTrialExpired,
    enterpriseTrialExpired: subscription?.enterpriseTrialExpired,
    stripeSubscriptionId: subscription?.stripeSubscriptionId,
    currentPeriodEnd: subscription?.stripeCurrentPeriodEnd,
  });

  // Only fetch price info for active subscriptions
  const priceInfo = isSubscriptionActive && subscription?.stripePriceId
    ? await stripe.prices.retrieve(subscription.stripePriceId, {
        expand: ["product"],
      })
    : null;

  // Determine current plan name
  let planName = "FREE";
  if (isSubscriptionActive && priceInfo?.product) {
    planName = (priceInfo.product as Stripe.Product).name;
  } else if (hasActiveProTrial) {
    planName = "Premium (Trial)";
  } else if (hasActiveEnterpriseTrial) {
    planName = "Premium Plus (Trial)";
  }

  // Debug log
  console.log("Final plan name:", planName);

  return (
    <main className="mx-auto w-full max-w-7xl space-y-6 px-3 py-6">
      <h1 className="text-3xl font-bold">Billing</h1>
      <p>
        Your current plan:{" "}
        <span className="font-bold">
          {planName}
        </span>
      </p>
      {isSubscriptionActive ? (
        <>
          {subscription?.stripeCancelAtPeriodEnd && (
            <p className="text-destructive">
              Your subscription will be canceled on{" "}
              {formatDate(subscription.stripeCurrentPeriodEnd, "MMMM dd, yyyy")}
            </p>
          )}
          <ManageSubscriptionButton />
        </>
      ) : (
        <GetSubscriptionButton />
      )}
    </main>
  );
}
