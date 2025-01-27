"use server";

import { env } from "@/env";
import stripe from "@/lib/stripe";
import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function createCheckoutSession(priceId: string): Promise<string | void> {
  try {
    const user = await currentUser();

    if (!user) {
      throw new Error("Unauthorized: No user is authenticated.");
    }

    const stripeCustomerId = user.privateMetadata.stripeCustomerId as string | undefined;

    // Basic validation
    if (!priceId) {
      throw new Error("Price ID is required");
    }

    // Ensure necessary environment variables are set
    if (!env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_MONTHLY || 
        !env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_PLUS_MONTHLY) {
      throw new Error("Subscription price IDs are missing.");
    }

    // Determine the plan type based on the price ID
    const isPro = priceId === env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_MONTHLY;
    const isEnterprise = priceId === env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_PLUS_MONTHLY;

    let planName = "free"; // Default plan name
    if (isPro) {
      planName = "pro";
    } else if (isEnterprise) {
      planName = "enterprise";
    }

    // Set the plan description based on the selected type
    const description = isPro || isEnterprise 
      ? "One-time payment for premium access to our Pro or Enterprise plans, which include additional features and support." 
      : "Free access with limited features.";

    // Create a new Stripe Checkout session for one-time payment
    const session = await stripe.checkout.sessions.create({
      mode: "payment", // Change to payment mode
      line_items: [{ 
        price: priceId, // Use the price ID for the one-time payment
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
      custom_text: {
        terms_of_service_acceptance: {
          message: `I have read the Resume & Cover Letter AI Genius's [terms of service](${env.NEXT_PUBLIC_BASE_URL}/tos) and agree to them.`,
        },
        submit: {
          message: `Get Premium Access`,
        },
      },
      consent_collection: {
        terms_of_service: "required",
      },
      billing_address_collection: "auto",
      payment_method_types: ["card"],
      phone_number_collection: { enabled: false },
    });

    if (!session?.url) {
      throw new Error("No checkout URL returned");
    }

    return session.url;

  } catch (error) {
    console.error('Checkout error:', error);
    throw new Error("Failed to create checkout session");
  }
}