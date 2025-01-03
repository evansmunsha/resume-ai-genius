"use server";

import { env } from "@/env";
import stripe from "@/lib/stripe";
import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { logger } from "@/lib/logger";

export async function createCheckoutSession(priceId: string): Promise<string | void> {
  try {
    const user = await currentUser();
    
    if (!user) {
      redirect('/sign-in?redirect_url=/');
    }

    const stripeCustomerId = user.privateMetadata.stripeCustomerId as string | undefined;

    // Basic validation
    if (!priceId) {
      throw new Error("Price ID is required");
    }

    // Ensure necessary environment variables are set
    if (!env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_MONTHLY || !env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_PLUS_MONTHLY) {
      throw new Error("Environment variables for price IDs are missing.");
    }

    // Determine the plan type based on the price ID
    const isPro = priceId === env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_MONTHLY;
    const isEnterprise = priceId === env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_PLUS_MONTHLY;
    const planName = isEnterprise ? "enterprise" : isPro ? "pro" : "free";

    // Set the plan description based on the selected type
    const description = isEnterprise
      ? "Unlimited resumes & cover letters with advanced AI features. Includes all premium templates, design customization, and priority support."
      : "Create professional resumes & cover letters with AI assistance. Includes 3 documents each, AI tools, and premium templates.";

    // Trial duration is set to 3 days
    const TRIAL_DURATION = 3 * 24 * 60 * 60; // 3 days in seconds

    // Check if the user has an existing subscription or has had one in the past
    const existingSubscription = await prisma.userSubscription.findUnique({
      where: { userId: user.id },
    });

    // Prevent creating checkout for active trials
    if (existingSubscription) {
      if (
        (isPro && existingSubscription.proTrialEnd && new Date(existingSubscription.proTrialEnd) > new Date()) ||
        (isEnterprise && existingSubscription.enterpriseTrialEnd && new Date(existingSubscription.enterpriseTrialEnd) > new Date())
      ) {
        throw new Error("You already have an active trial for this plan");
      }
    }

    let trialEnd: number | undefined;
    if (existingSubscription) {
      // Separate trials for Pro and Enterprise tiers
      if (isPro && !existingSubscription.proTrialExpired) {
        trialEnd = Math.floor(Date.now() / 1000) + TRIAL_DURATION;
      } else if (isEnterprise && !existingSubscription.enterpriseTrialExpired) {
        trialEnd = Math.floor(Date.now() / 1000) + TRIAL_DURATION;
      }
    } else {
      // Check if any subscription exists with ANY of user's email addresses
      const emailUsed = await prisma.userSubscription.findFirst({
        where: { 
          OR: user.emailAddresses.map(email => ({ userEmail: email.emailAddress }))
        }
      });

      if (emailUsed) {
        // If email was ever used before, no trial is offered
        console.log("Email previously used, no trial offered");
        trialEnd = undefined;
      } else {
        trialEnd = Math.floor(Date.now() / 1000) + TRIAL_DURATION; // 3 days from now for new users
      }
    }

    // Apply discount if eligible
    let discountCode;
    if (existingSubscription?.proTrialExpired && existingSubscription.proTrialEnd) {
      const trialEndDate = new Date(existingSubscription.proTrialEnd);
      const now = new Date();
      const daysSinceExpiry = (now.getTime() - trialEndDate.getTime()) / (1000 * 60 * 60 * 24);
      
      if (daysSinceExpiry <= 7 && !existingSubscription.discountUsedAt) {
        discountCode = isPro 
          ? env.STRIPE_POST_TRIAL_PRO_COUPON_ID 
          : env.STRIPE_POST_TRIAL_ENTERPRISE_COUPON_ID;
      }
    }

    if (discountCode) {
      logger.discountApplied(user.id, discountCode, 20);
    }

    // Create a new Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ 
        price: priceId,
        quantity: 1 
      }],
      success_url: `${env.NEXT_PUBLIC_BASE_URL}/billing/success`,
      cancel_url: `${env.NEXT_PUBLIC_BASE_URL}/billing`,
      customer: stripeCustomerId,
      customer_email: stripeCustomerId ? undefined : user.emailAddresses[0]?.emailAddress,
      metadata: {
        userId: user.id,
        planName,
        description,
      },
      subscription_data: {
        metadata: { userId: user.id },
        trial_end: trialEnd,
      },
      custom_text: {
        terms_of_service_acceptance: {
          message: `I have read the Resume & Cover Letter AI Genius's [terms of service](${env.NEXT_PUBLIC_BASE_URL}/tos) and agree to them.`,
        },
        submit: {
          message: `Get ${planName.charAt(0).toUpperCase() + planName.slice(1)} Access`,
        },
      },
      consent_collection: {
        terms_of_service: "required",
      },
      billing_address_collection: "auto",
      payment_method_types: ["card"],
      phone_number_collection: { enabled: false },
      allow_promotion_codes: true,
      discounts: discountCode ? [{ 
        promotion_code: discountCode
      }] : undefined,
    }).catch(error => {
      logger.error(error, 'Stripe API error', user.id);
      throw error;
    });

    if (!session?.url) {
      throw new Error("Failed to create checkout URL");
    }

    return session.url;

  } catch (error) {
    console.error("Stripe error:", error);
    logger.error(error instanceof Error ? error : new Error('Unknown error'), 'Checkout failed');
    throw new Error("Failed to create checkout session");
  }
}
