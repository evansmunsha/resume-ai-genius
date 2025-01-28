"use client";

import { useState, Suspense } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check } from 'lucide-react';
import { env } from "@/env";
import { useToast } from "@/hooks/use-toast";
import { createCheckoutSession } from "./premium/actions";
import { ErrorBoundary } from "./ErrorBoundary";
import Link from 'next/link';
import '../../src/app/globals.css';

export function PricingSection() {
  return (
    <ErrorBoundary>
      <PricingSectionContent />
    </ErrorBoundary>
  );
}

export function PricingSectionContent() {
  const { toast } = useToast();
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});

  

  const handleOneTimePaymentClick = async (priceId: string) => {
    setLoadingStates((prev) => ({ ...prev, [priceId]: true }));

    try {
      const redirectUrl = await createCheckoutSession(priceId);
      if (redirectUrl) {
        window.location.href = redirectUrl;
      }
    } catch (error) {
      toast({
        variant: "destructive",
        description: error instanceof Error ? error.message : "Something went wrong. Please try again.",
      });
    } finally {
      setLoadingStates((prev) => ({ ...prev, [priceId]: false }));
    }
  };

  const renderPricingCard = (
    title: string,
    price: string,
    originalPrice: string,
    features: JSX.Element[],
    isPopular: boolean = false,
    priceId: string
  ) => {
    const cardClasses = `transition-transform duration-300 ease-in-out transform hover:scale-105`; 

    return (
      <Card className={isPopular ? `${cardClasses} h-fit border-green-500 shadow-lg relative pricing-card` : cardClasses}>
        {isPopular && (
          <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-500">
            Most Popular
          </Badge>
        )}
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <div className="mt-4 text-center">
          {priceId === "free" ? (
              ''
            ) : (
            <h3 className="text-xl font-bold">Lifetime Deal</h3>
          )}
            <div className="text-4xl font-bold">
            {priceId === "free" ? (
              ''
            ) : (
              <span className="text-gray-500 text-lg line-through">${originalPrice}</span>
          )}
              <span className="text-green-500 ml-2">${price}</span>
            </div>
            {parseFloat(originalPrice) !== parseFloat(price) && (
              <span className="text-green-500 ml-2"> ({Math.round(((parseFloat(originalPrice) - parseFloat(price)) / parseFloat(originalPrice)) * 100)}% off)</span>
            )}
            {priceId === "free" ? (
              ''
            ) : (
              <p className="text-sm text-gray-600">One-time payment. No Subscription.</p>
          )}
          </div>
        </CardHeader>
        <CardContent>
          <ul className='mt-4 flex flex-col justify-start gap-2 items-start'>
            {features.map((feature, index) => (
              <li className='flex items-center' key={index}>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </CardContent>
        <CardFooter>
          {priceId === "free" ? (
            <Link href="/resumes" className="w-full">
              <Button className="w-full">Get Started</Button>
            </Link>
          ) : (
            <Button
              onClick={() => handleOneTimePaymentClick(priceId)}
              className={`w-full ${loadingStates[priceId] ? 'loading' : ''}`}
              disabled={loadingStates[priceId]}
            >
              {loadingStates[priceId] ? 'Processing...' : 'Purchase Now'}
            </Button>
          )}
        </CardFooter>
      </Card>
    );
  };

  return (
    <Suspense fallback={<div className="animate-pulse">Loading...</div>}>
      <section className="py-20 bg-gray-100">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Simple Pricing</h2>
            <p className="text-gray-600">Choose the plan that works best for you</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {renderPricingCard("Free", "0", "0", [
              <span key='1' className='flex items-center'><Check className='w-4 h-4 text-green-500 mr-2 sm:text-sm' />1 Resume</span>,
              <span key='2' className='flex items-center'><Check className='w-4 h-4 text-green-500 mr-2 sm:text-sm' />1 Cover Letter</span>
            ], false, "free")}
            {renderPricingCard("Premium", "199", "330", [
              <div key='premium' className='text-start '>
                <ul className='flex flex-col gap-4 sm:text-sm'>
                  <li key='1' className='flex items-start'><Check className='w-5 h-5 text-green-500 mr-2' />5 Resumes</li>
                  <li key='2' className='flex items-start'><Check className='w-5 h-5 text-green-500 mr-2' />5 Cover Letters</li>
                  <li key='3' className='flex items-start'><Check className='w-5 h-5 text-green-500' />AI generation features</li>
                  <li key='4' className='flex items-start'><Check className='w-5 h-5 text-green-500 mr-2' />Access to premium templates</li>
                </ul>
              </div>
            ], true, env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_MONTHLY)}
            {renderPricingCard("Premium Plus", "299", "450", [
              <div key='premium-plus' className='text-start'>
                <ul className=' flex flex-col gap-4 sm:text-sm'>
                  <li key='1' className='flex items-start'><Check className='w-5 h-5 text-green-500 mr-2' />Unlimited resumes</li>
                  <li key='2' className='flex items-start'><Check className='w-5 h-5 text-green-500 mr-2' />Unlimited cover letters</li>
                  <li key='3' className='flex items-start'><Check className='w-5 h-5 text-green-500 mr-2' />Custom design options</li>
                  <li key='4' className='flex items-start'><Check className='w-5 h-5 text-green-500 mr-2' />Priority support</li>
                </ul>
              </div>
            ], false, env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_PLUS_MONTHLY)}
          </div>
        </div>
      </section>
    </Suspense>
  );
}