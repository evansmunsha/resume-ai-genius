"use client";

import { useState, useEffect, Suspense } from "react";
import { useUser } from "@clerk/nextjs";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, Loader2 } from 'lucide-react';
import { env } from "@/env";
import { useToast } from "@/hooks/use-toast";
import { createCheckoutSession } from "./premium/actions";
import { DiscountBanner } from "./DiscountBanner";
import { ErrorBoundary } from "./ErrorBoundary";
import { logger } from "@/lib/logger";

type SubscriptionStatus = "FREE" | "PRO" | "ENTERPRISE";

interface SubscriptionData {
  status: SubscriptionStatus;
  proTrialEndsAt: string | null;
  enterpriseTrialEndsAt: string | null;
  trialExpired: boolean;
  trialEndingSoon: boolean;
  discountEligible: boolean;
  discountUsed: boolean;
}

export function PricingSection() {
  return (
    <ErrorBoundary>
      <PricingSectionContent />
    </ErrorBoundary>
  );
}

export function PricingSectionContent() {
  const { user, isLoaded: isUserLoaded } = useUser();
  const { toast } = useToast();
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});
  const [timeLeft, setTimeLeft] = useState<string>("");

  useEffect(() => {
    const fetchSubscriptionStatus = async () => {
      if (!user) {
        setSubscriptionData({ 
          status: 'FREE', 
          proTrialEndsAt: null, 
          enterpriseTrialEndsAt: null, 
          trialExpired: false, 
          trialEndingSoon: false, 
          discountEligible: false, 
          discountUsed: false 
        });
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await fetch('/api/subscription-status', {
          method: 'GET',
          cache: 'no-store',
          headers: {
            'Accept': 'application/json',
          },
        });
        
        if (!response.ok) {
          console.error("Response not OK:", response.status, response.statusText);
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Fetched subscription data:", JSON.stringify(data, null, 2));
        setSubscriptionData(data);
      } catch (error) {
        console.error("Error fetching subscription status:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch subscription status. Please try again later.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (isUserLoaded) {
      fetchSubscriptionStatus();
    }
  }, [user, isUserLoaded, toast]);

  useEffect(() => {
    if (!subscriptionData?.proTrialEndsAt) return;

    const updateCountdown = () => {
      if (!subscriptionData.proTrialEndsAt) return;
      const end = new Date(subscriptionData.proTrialEndsAt).getTime();
      const now = new Date().getTime();
      const diff = end - now;

      if (diff <= 0) {
        setTimeLeft("");
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      setTimeLeft(`${hours}h ${minutes}m`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [subscriptionData?.proTrialEndsAt]);

  const handlePremiumClick = async (priceId: string) => {
    setLoadingStates((prev) => ({ ...prev, [priceId]: true }));

    try {
      if (
        (subscriptionData?.proTrialEndsAt && priceId === env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_MONTHLY) ||
        (subscriptionData?.enterpriseTrialEndsAt && priceId === env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_PLUS_MONTHLY)
      ) {
        toast({
          title: "Trial Already Active",
          description: "You already have an active trial for this plan.",
          variant: "destructive",
        });
        return;
      }

      const redirectUrl = await createCheckoutSession(priceId);
      if (redirectUrl) {
        window.location.href = redirectUrl;
      }
    } catch (error) {
      // Only show error toast for real errors, not redirects
      if (!(error instanceof Error) || error.message !== "NEXT_REDIRECT") {
        toast({
          variant: "destructive",
          description: error instanceof Error ? error.message : "Something went wrong. Please try again.",
        });
      }
    } finally {
      setLoadingStates((prev) => ({ ...prev, [priceId]: false }));
    }
  };

  const getButtonText = (planType: string): string => {
    if (!subscriptionData) return "Loading...";
    
    console.log(`Getting button text for plan: ${planType}, current status: ${subscriptionData.status}`);
    
    switch (subscriptionData.status) {
      case "ENTERPRISE":
        if (subscriptionData.enterpriseTrialEndsAt && planType === "Premium Plus") return "Trial Active";
        return planType === "Premium Plus" ? "Current Plan" : "Downgrade";
      case "PRO":
        if (subscriptionData.proTrialEndsAt && planType === "Premium") return "Trial Active";
        if (planType === "Premium") return "Current Plan";
        if (planType === "Premium Plus") return "Upgrade";
        return "Downgrade";
      case "FREE":
        if (planType === "Free") return "Current Plan";
        if (subscriptionData.trialExpired) {
          return "Subscribe";
        }
        if (subscriptionData.proTrialEndsAt && planType === "Premium") return "Trial Active";
        if (subscriptionData.enterpriseTrialEndsAt && planType === "Premium Plus") return "Trial Active";
        return "Start Trial";
      default:
        return "Upgrade";
    }
  };

  const getDiscountedPrice = (originalPrice: string) => {
    if (subscriptionData?.discountEligible) {
      const price = parseFloat(originalPrice);
      return (price * 0.8).toFixed(2); // 20% discount
    }
    return originalPrice;
  };

  const isDisabled = (buttonText: string, title: string) => 
    buttonText === "Current Plan" || 
    buttonText === "Trial Active" ||
    (subscriptionData?.status === "PRO" && title === "Free") ||
    (subscriptionData?.status === "ENTERPRISE" && (title === "Free" || title === "Premium"));

  const renderPricingCard = (
    title: string,
    price: string,
    features: string[],
    isPopular: boolean = false,
    priceId: string
  ) => {
    const buttonText = getButtonText(title);
    const displayPrice = subscriptionData?.discountEligible 
      ? getDiscountedPrice(price) 
      : price;
    
    return (
      <Card className={isPopular ? "border-green-500 shadow-lg relative" : ""}>
        {isPopular && (
          <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-500">
            Most Popular
          </Badge>
        )}
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <div className="mt-4">
            <span className="text-4xl font-bold">${displayPrice}</span>
            {subscriptionData?.discountEligible && (
              <span className="ml-2 line-through text-gray-400">
                ${price}
              </span>
            )}
            <span className="text-gray-500">/month</span>
          </div>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {features.map((feature, i) => (
              <li key={i} className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500" />
                {feature}
              </li>
            ))}
          </ul>
        </CardContent>
        <CardFooter>
          <Button
            variant={isPopular ? "premium" : "outline"}
            onClick={() => handlePremiumClick(priceId)}
            className="w-full"
            disabled={isDisabled(buttonText, title) || loadingStates[priceId]}
          >
            {loadingStates[priceId] ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : (
              buttonText
            )}
          </Button>
        </CardFooter>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <Suspense fallback={
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-4" />
        <div className="h-64 bg-gray-100 rounded" />
      </div>
    }>
    <section className="py-20">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Simple Pricing</h2>
          <p className="text-gray-600">Choose the plan that works best for you</p>
        </div>
          {subscriptionData?.trialEndingSoon && timeLeft && (
            <div className="text-center mb-8 p-4 bg-orange-50 border border-orange-200 rounded-md">
              <p className="text-sm text-orange-800 font-semibold">
                ⏰ Your trial ends in {timeLeft}! Subscribe now to keep your premium features.
              </p>
            </div>
          )}
        <div className="grid md:grid-cols-3 gap-8">
          {renderPricingCard(
            "Free",
            "0",
            ["1 Resume", "1 Cover Letter"],
            false,
            "free"
          )}
          {renderPricingCard(
            "Premium",
            "9.99",
            ["3 Resumes", "3 Cover Letters", "AI Generation"],
            true,
            env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_MONTHLY
          )}
          {renderPricingCard(
            "Premium Plus",
            "19.99",
            [
              "Infinite resumes",
              "Infinite cover letters",
              "Design customizations",
              "Advanced AI features",
            ],
            false,
            env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_PLUS_MONTHLY
          )}
        </div>
        {subscriptionData?.proTrialEndsAt && (
          <p className="text-center text-sm text-gray-500 mt-4">
            Your Premium trial ends in {Math.ceil((new Date(subscriptionData.proTrialEndsAt).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days
          </p>
        )}
        {subscriptionData?.enterpriseTrialEndsAt && (
          <p className="text-center text-sm text-gray-500 mt-4">
            Your Premium Plus trial ends in {Math.ceil((new Date(subscriptionData.enterpriseTrialEndsAt).getTime() - new Date().getTime()) / (1000 * 60 * 60 *24))} days
          </p>
        )}
          {subscriptionData?.trialExpired && (
            <div className="text-center mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-sm text-yellow-800">
                Your trial has expired. Subscribe now to continue enjoying premium features!
              </p>
        </div>
          )}
          {subscriptionData?.discountEligible && !subscriptionData?.discountUsed && (
            <div className="text-center mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
              <p className="text-sm text-green-800 font-semibold">
                Special One-Time Offer: Get 20% off your first payment!
              </p>
              <p className="text-xs text-green-600 mt-1">
                Use code{' '}
                <span className="font-mono bg-green-100 px-2 py-0.5 rounded">
                  {subscriptionData.status === 'PRO' ? 'PROTRIAL20' : 'PLUSTRIAL20'}
                </span>
                {' '}at checkout
              </p>
              <p className="text-xs text-green-600 mt-1">
                Limited time offer - Subscribe within 7 days of trial expiry
              </p>
        </div>
          )}
          {subscriptionData?.discountUsed && (
            <div className="text-center mt-4 p-4 bg-gray-50 border border-gray-200 rounded-md">
              <p className="text-sm text-gray-600">
                You've already used your post-trial discount.
              </p>
            </div>
          )}
          {subscriptionData?.discountEligible && (
            <DiscountBanner 
              isEligible={true}
              originalPrice={9.99}
              discountPercentage={20}
            />
          )}
      </div>
    </section>
    </Suspense>
  );
}

