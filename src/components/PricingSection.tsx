"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, Loader2 } from 'lucide-react';
import { env } from "@/env";
import { useToast } from "@/hooks/use-toast";
import { createCheckoutSession } from "./premium/actions";

type SubscriptionStatus = "FREE" | "PRO" | "ENTERPRISE";

interface SubscriptionData {
  status: SubscriptionStatus;
  proTrialEndsAt: string | null;
  enterpriseTrialEndsAt: string | null;
}

export function PricingSection() {
  const { user, isLoaded: isUserLoaded } = useUser();
  const { toast } = useToast();
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchSubscriptionStatus = async () => {
      if (!user) {
        console.log("No user, setting free status");
        setSubscriptionData({ status: 'FREE', proTrialEndsAt: null, enterpriseTrialEndsAt: null });
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await fetch('/api/subscription-status');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch subscription status: ${response.status}`);
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

  const handlePremiumClick = async (priceId: string) => {
    setLoadingStates((prev) => ({ ...prev, [priceId]: true }));

    try {
      const redirectUrl = await createCheckoutSession(priceId);
      window.location.href = redirectUrl;
    } catch (error) {
      console.error("Error creating checkout session:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to start checkout process. Please try again.",
      });
    } finally {
      setLoadingStates((prev) => ({ ...prev, [priceId]: false }));
    }
  };

  const getButtonText = (planType: string): string => {
    if (!subscriptionData) return "Loading...";
    
    console.log(`Getting button text for plan: ${planType}, current status: ${subscriptionData.status}`);
    
    switch (subscriptionData.status) {
      case "ENTERPRISE":
        return planType === "Premium Plus" ? "Current Plan" : "Downgrade";
      case "PRO":
        if (planType === "Premium") return "Current Plan";
        if (planType === "Premium Plus") return "Upgrade";
        return "Downgrade";
      case "FREE":
        if (planType === "Free") return "Current Plan";
        if (subscriptionData.proTrialEndsAt && planType === "Premium") return "Trial Active";
        if (subscriptionData.enterpriseTrialEndsAt && planType === "Premium Plus") return "Trial Active";
        return "Start Trial";
      default:
        return "Upgrade";
    }
  };

  const renderPricingCard = (
    title: string,
    price: string,
    features: string[],
    isPopular: boolean = false,
    priceId: string
  ) => {
    const buttonText = getButtonText(title);
    console.log(`Rendering card for ${title}, button text: ${buttonText}`);
    
    const isDisabled = buttonText === "Current Plan" || 
      (subscriptionData?.status === "PRO" && title === "Free") ||
      (subscriptionData?.status === "ENTERPRISE" && (title === "Free" || title === "Premium"));
    
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
            <span className="text-4xl font-bold">${price}</span>
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
            variant={isPopular ? "secondary" : "outline"}
            onClick={() => handlePremiumClick(priceId)}
            className="w-full"
            disabled={isDisabled || loadingStates[priceId]}
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
    <section className="py-20">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Simple Pricing</h2>
          <p className="text-gray-600">Choose the plan that works best for you</p>
        </div>
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
      </div>
    </section>
  );
}


















/* import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, Loader2 } from "lucide-react";
import { env } from "@/env";
import { useToast } from "@/hooks/use-toast";
import { createCheckoutSession } from "./premium/actions";

type SubscriptionStatus = "free" | "trial" | "premium" | "premium_plus";

interface SubscriptionData {
  status: SubscriptionStatus;
  trialEndsAt: string | null;
}

export function PricingSection() {
  const { user } = useUser();
  const { toast } = useToast();
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData | null>(null);
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchSubscriptionStatus = async () => {
      if (!user) return;
  
      try {
        const response = await fetch(`/api/subscription-status`);
        if (!response.ok) {
          throw new Error(`Failed to fetch subscription status: ${response.status}`);
        }
  
        const data: SubscriptionData = await response.json();
        setSubscriptionData(data);
      } catch (error) {
        console.error("Error fetching subscription status:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch subscription status. Please try again later.",
        });
      }
    };
  
    fetchSubscriptionStatus();
    // Only include `user` and `toast` in the dependency array
  }, [user, toast]);
  

  const handlePremiumClick = async (priceId: string) => {
    setLoadingStates((prev) => ({ ...prev, [priceId]: true }));

    try {
      const redirectUrl = await createCheckoutSession(priceId);
      window.location.href = redirectUrl;
    } catch (error) {
      console.error("Error creating checkout session:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to start checkout process. Please try again.",
      });
    } finally {
      setLoadingStates((prev) => ({ ...prev, [priceId]: false }));
    }
  };

  const renderTrialCountdown = () => {
    if (!subscriptionData?.trialEndsAt) return null;

    const trialEndsAt = new Date(subscriptionData.trialEndsAt);
    const now = new Date();
    const timeLeft = trialEndsAt.getTime() - now.getTime();
    const daysLeft = Math.ceil(timeLeft / (1000 * 60 * 60 * 24));

    return (
      <p className="text-center text-sm text-gray-500 mt-4">
        Your trial ends in {daysLeft} day{daysLeft !== 1 ? "s" : ""}
      </p>
    );
  };

  const renderPricingCard = (
    title: string,
    price: string,
    features: string[],
    buttonText: string,
    buttonAction: () => void,
    isPopular: boolean = false,
    priceId: string
  ) => (
    <Card className={isPopular ? "border-green-500 shadow-lg relative" : ""}>
      {isPopular && (
        <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-500">
          Most Popular
        </Badge>
      )}
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <div className="mt-4">
          <span className="text-4xl font-bold">${price}</span>
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
          variant={isPopular ? "secondary" : "outline"}
          onClick={buttonAction}
          className="w-full"
          disabled={loadingStates[priceId] || subscriptionData?.status === title.toLowerCase()}
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

  if (!subscriptionData) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <section className="py-20">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Simple Pricing</h2>
          <p className="text-gray-600">Choose the plan that works best for you</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {renderPricingCard(
            "Free",
            "0",
            ["1 Resume", "1 Cover Letter"],
            subscriptionData.status === "free" ? "Current Plan" : "free",
            () => {}, // Add downgrade logic if needed
            false,
            "free"
          )}
          {renderPricingCard(
            "Premium",
            "9.99",
            ["3 Resumes", "3 Cover Letters", "AI Generation"],
            subscriptionData.status === "premium"
              ? "Current Plan"
              : subscriptionData.status === "trial"
              ? "Trial Active"
              : "Upgrade",
            () => handlePremiumClick(env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_MONTHLY),
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
            subscriptionData.status === "premium_plus" ? "Current Plan" : "Upgrade",
            () => handlePremiumClick(env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_PLUS_MONTHLY),
            false,
            env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_PLUS_MONTHLY
          )}
        </div>
        {subscriptionData.status === "trial" && renderTrialCountdown()}
      </div>
    </section>
  );
} */








/* import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Check } from 'lucide-react'
import { env } from '@/env'
import { Loader2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { createCheckoutSession } from './premium/actions'

type SubscriptionStatus = 'free' | 'trial' | 'premium' | 'premium_plus'

interface SubscriptionData {
  status: SubscriptionStatus;
  trialEndsAt: string | null;
}

export function PricingSection() {
  const { user } = useUser()
  const { toast } = useToast()
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchSubscriptionStatus = async () => {
      if (!user) return

      try {
        const response = await fetch('/api/stripe-webhook')
        if (!response.ok) {
          throw new Error('Failed to fetch subscription status')
        }
        const data: SubscriptionData = await response.json()
        setSubscriptionData(data)
      } catch (error) {
        console.error('Error fetching subscription status:', error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch subscription status. Please try again later.",
        })
      }
    }

    fetchSubscriptionStatus()
  }, [user, toast])

  const handlePremiumClick = async (priceId: string) => {
    try {
      setLoading(true)
      const redirectUrl = await createCheckoutSession(priceId)
      window.location.href = redirectUrl
    } catch (error) {
      console.error('Error creating checkout session:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to start checkout process. Please try again.",
      })
    } finally {
      setLoading(false)
    }
  }

  const renderPricingCard = (
    title: string,
    price: string,
    features: string[],
    buttonText: string,
    buttonAction: () => void,
    isPopular: boolean = false
  ) => (
    <Card className={isPopular ? "border-green-500 shadow-lg relative" : ""}>
      {isPopular && (
        <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-500">
          Most Popular
        </Badge>
      )}
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <div className="mt-4">
          <span className="text-4xl font-bold">${price}</span>
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
          variant={isPopular ? "secondary" : "outline"}
          onClick={buttonAction}
          className="w-full"
          disabled={loading || (subscriptionData?.status === title.toLowerCase() as SubscriptionStatus)}
        >
          {loading ? (
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
  )

  const renderTrialCountdown = () => {
    if (!subscriptionData?.trialEndsAt) return null

    const trialEndsAt = new Date(subscriptionData.trialEndsAt)
    const now = new Date()
    const timeLeft = trialEndsAt.getTime() - now.getTime()
    const daysLeft = Math.ceil(timeLeft / (1000 * 60 * 60 * 24))

    return (
      <p className="text-center text-sm text-gray-500 mt-4">
        Your trial ends in {daysLeft} day{daysLeft !== 1 ? 's' : ''}
      </p>
    )
  }

  if (!subscriptionData) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <section className="py-20">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Simple Pricing</h2>
          <p className="text-gray-600">Choose the plan that works best for you</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {renderPricingCard(
            "Free",
            "0",
            ["1 Resume", "1 Cover Letter"],
            subscriptionData.status === 'free' ? "Current Plan" : "Downgrade",
            () => {/* Handle downgrade logic *}
          )}
          {renderPricingCard(
            "Premium",
            "9.99",
            ["3 Resumes", "3 Cover Letters", "AI Generation"],
            subscriptionData.status === 'premium' 
              ? "Current Plan" 
              : subscriptionData.status === 'trial' 
                ? 'Trial Active'
                : "Upgrade",
            () => handlePremiumClick(env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_MONTHLY),
            true
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
            subscriptionData.status === 'premium_plus' ? "Current Plan" : "Upgrade",
            () => handlePremiumClick(env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_PLUS_MONTHLY)
          )}
        </div>
        {subscriptionData.status === 'trial' && renderTrialCountdown()}
      </div>
    </section>
  )
} */

