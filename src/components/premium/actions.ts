"use server";

import { env } from "@/env";
import stripe from "@/lib/stripe";
import { currentUser } from "@clerk/nextjs/server";

export async function createCheckoutSession(priceId: string) {
  const user = await currentUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const stripeCustomerId = user.privateMetadata.stripeCustomerId as string | undefined;

  const isPremiumPlus = priceId === env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_PLUS_MONTHLY;
  const planName = isPremiumPlus ? "Pro Plus" : "Pro";
  const description = isPremiumPlus 
    ? "Unlimited resumes & cover letters with advanced AI features. Includes all premium templates, design customization, and priority support."
    : "Create professional resumes & cover letters with AI assistance. Includes 3 documents each, AI tools, and premium templates.";

  const session = await stripe.checkout.sessions.create({
    line_items: [{ 
      price: priceId, 
      quantity: 1 
    }],
    mode: "subscription",
    success_url: `${env.NEXT_PUBLIC_BASE_URL}/billing/success`,
    cancel_url: `${env.NEXT_PUBLIC_BASE_URL}/billing`,
    customer: stripeCustomerId,
    customer_email: stripeCustomerId ? undefined : user.emailAddresses[0].emailAddress,
    metadata: {
      userId: user.id,
      planName,
      description
    },
    subscription_data: {
      metadata: {
        userId: user.id,
      },
    },
    custom_text: {
      terms_of_service_acceptance: {
        message: `I have read the Resume & Cover Letter AI Genius's [terms of service](${env.NEXT_PUBLIC_BASE_URL}/tos) and agree to them.`,
      },
      submit: {
        message: `Get ${planName} Access`
      }
    },
    consent_collection: {
      terms_of_service: "required",
    },
    billing_address_collection: "auto",
    payment_method_types: ["card"],
    phone_number_collection: {
      enabled: false,
    },
  });

  if (!session.url) {
    throw new Error("Failed to create checkout session");
  }

  return session.url;
}
