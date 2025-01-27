"use client";

import { env } from "@/env";
import { useToast } from "@/hooks/use-toast";
import usePremiumModal from "@/hooks/usePremiumModal";
import { Check } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { createCheckoutSession } from "./actions";

interface SubscriptionData {
  status: "FREE" | "PRO" | "ENTERPRISE";
}

const premiumFeatures = [
  "AI tools",
  "Up to 5 resumes",
  "Up to 5 cover letters",
  "AI generation features",
  "Access to premium templates",
];

const premiumPlusFeatures = [
  "Unlimited resumes",
  "Unlimited cover letters",
  "Custom design options",
  "Advanced AI features",
  "Priority support",
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
          <p>Get a one time deal to unlock more features for both resumes and cover letters.</p>
          <div className="flex">
            <div className="flex w-1/2 flex-col space-y-2">
              <h3 className="text-center text-lg font-bold">Premium</h3>
              <div className="text-center flex flex-col items-center">
                <h3 className="text-xl font-bold">Lifetime Deal</h3>
                <div>
                  <span className="text-gray-500 font-bold text-lg line-through">$330</span>
                  <span className="text-3xl font-bold text-green-500">$199</span>
                </div>
                <span className="text-gray-500">One-time payment. No Subscription.</span>
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
            <div className="flex w-1/2 flex-col space-y-2">
              <h3 className="bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-center text-lg font-bold text-transparent">
                Premium Plus
              </h3>
              <div className="text-center flex flex-col items-center">
                <h3 className="text-xl font-bold">Lifetime Deal</h3>
                <div>

                  <span className="text-gray-500 font-bold text-lg line-through">$450</span>
                  <span className="text-3xl font-bold text-green-500">$299</span>
                </div>
                <span className="text-gray-500">One-time payment. No Subscription.</span>
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
        </div>
      </DialogContent>
    </Dialog>
  );
}
