"use client";

import { env } from "@/env";
import { useToast } from "@/hooks/use-toast";
import usePremiumModal from "@/hooks/usePremiumModal";
import { Check, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { createCheckoutSession } from "./actions";

interface SubscriptionData {
  status: "FREE" | "PRO" | "ENTERPRISE";
  proTrialEndsAt: string | null;
  enterpriseTrialEndsAt: string | null;
  discountEligible: boolean;
  discountUsed: boolean;
}

const premiumFeatures = [
  "AI tools",
  "Up to 3 resumes",
  "Up to 3 cover letters",
];

const premiumPlusFeatures = [
  "Infinite resumes",
  "Infinite cover letters",
  "Design customizations",
  "Advanced AI features",
];

export default function PremiumModal() {
  const { open, setOpen } = usePremiumModal();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData | null>(null);

  useEffect(() => {
    const fetchSubscriptionStatus = async () => {
      try {
        const response = await fetch('/api/subscription-status');
        if (response.ok) {
          const data = await response.json();
          setSubscriptionData(data);
        }
      } catch (error) {
        console.error("Error fetching subscription status:", error);
      }
    };

    if (open) {
      fetchSubscriptionStatus();
    }
  }, [open]);

  async function handlePremiumClick(priceId: string) {
    try {
      setLoading(true);
      
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
      // Check if error is from our API
      if (error instanceof Error) {
        toast({
          variant: "destructive",
          description: error.message,
        });
      } else {
        toast({
          variant: "destructive",
          description: "Something went wrong. Please try again.",
        });
      }
    } finally {
      setLoading(false);
    }
  }

  const getDiscountedPrice = (originalPrice: number) => {
    if (subscriptionData?.discountEligible && !subscriptionData?.discountUsed) {
      return (originalPrice * 0.8).toFixed(2); // 20% discount
    }
    return originalPrice.toFixed(2);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!loading) {
          setOpen(open);
        }
      }}
    >
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Resume & Cover Letter AI Genius Premium</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <p>Get a premium subscription to unlock more features for both resumes and cover letters.</p>
          <div className="flex">
            <div className="flex w-1/2 flex-col space-y-5">
              <h3 className="text-center text-lg font-bold">Premium</h3>
              <div className="text-center">
                <span className="text-3xl font-bold">${getDiscountedPrice(9.99)}</span>
                {subscriptionData?.discountEligible && (
                  <span className="ml-2 line-through text-gray-400">$9.99</span>
                )}
                <span className="text-gray-500">/month</span>
              </div>
              <ul className="list-inside space-y-2">
                {premiumFeatures.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <Check className="size-4 text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button
                onClick={() =>
                  handlePremiumClick(
                    env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_MONTHLY,
                  )
                }
                disabled={loading}
              >
                Get Premium
              </Button>
            </div>
            <div className="mx-6 border-l" />
            <div className="flex w-1/2 flex-col space-y-5">
              <h3 className="bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-center text-lg font-bold text-transparent">
                Premium Plus
              </h3>
              <div className="text-center">
                <span className="text-3xl font-bold">${getDiscountedPrice(19.99)}</span>
                {subscriptionData?.discountEligible && (
                  <span className="ml-2 line-through text-gray-400">$19.99</span>
                )}
                <span className="text-gray-500">/month</span>
              </div>
              <ul className="list-inside space-y-2">
                {premiumPlusFeatures.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <Check className="size-4 text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button
                variant="premium"
                onClick={() =>
                  handlePremiumClick(
                    env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_PLUS_MONTHLY,
                  )
                }
                disabled={loading}
              >
                Get Premium Plus
              </Button>
            </div>
          </div>
          {subscriptionData?.discountEligible && !subscriptionData?.discountUsed && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
              <p className="text-sm text-green-800 text-center font-medium">
                Special One-Time Offer: 20% off your first payment
              </p>
              <p className="text-xs text-green-600 text-center mt-1">
                Use code{' '}
                <span className="font-mono bg-green-100 px-2 py-0.5 rounded">
                  {subscriptionData.status === 'PRO' ? 'PROTRIAL20' : 'PLUSTRIAL20'}
                </span>
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
