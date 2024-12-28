"use server";

import { env } from "@/env";  // Import environment variables
import stripe from "@/lib/stripe";  // Import the Stripe instance
import { currentUser } from "@clerk/nextjs/server";  // Import Clerk for user authentication

// Function to create a Checkout session with a free trial
export async function createCheckoutSession(priceId: string) {
  // Fetch the currently authenticated user using Clerk
  const user = await currentUser();

  // If no user is authenticated, throw an error
  if (!user) {
    throw new Error("Unauthorized");
  }

  // Retrieve the user's Stripe Customer ID from the private metadata (stored when the user was first created on Stripe)
  const stripeCustomerId = user.privateMetadata.stripeCustomerId as string | undefined;

  // Determine which plan the user is selecting based on the priceId
  const isPremiumPlus = priceId === env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_PLUS_MONTHLY;
  
  // Define the plan name and description based on the selected priceId
  const planName = isPremiumPlus ? "Pro Plus" : "Pro";
  const description = isPremiumPlus 
    ? "Unlimited resumes & cover letters with advanced AI features. Includes all premium templates, design customization, and priority support."
    : "Create professional resumes & cover letters with AI assistance. Includes 3 documents each, AI tools, and premium templates.";

  // Create the Stripe Checkout session for the subscription
  const session = await stripe.checkout.sessions.create({
    // Define the line items (the product or subscription the user is purchasing)
    line_items: [{ 
      price: priceId,  // The price ID (which defines the cost and features of the plan)
      quantity: 1  // The quantity of the subscription (usually 1)
    }],
    // Set the mode to "subscription" to indicate it's a recurring payment
    mode: "subscription",
    
    // URL where the user will be redirected after successful payment
    success_url: `${env.NEXT_PUBLIC_BASE_URL}/billing/success`,
    
    // URL where the user will be redirected if they cancel the payment
    cancel_url: `${env.NEXT_PUBLIC_BASE_URL}/billing`,
    
    // Attach the Stripe customer ID to the session if the user already has a Stripe account
    customer: stripeCustomerId,
    
    // If no Stripe customer ID exists, use the user's email address for the checkout session
    customer_email: stripeCustomerId ? undefined : user.emailAddresses[0].emailAddress,
    
    // Store metadata with the session for future reference (e.g., for support or analytics)
    metadata: {
      userId: user.id,  // Store the user ID from your database
      planName,  // Store the plan name (Pro or Pro Plus)
      description  // Store the plan description for clarity
    },
    
    // Add subscription-specific settings
    subscription_data: {
      metadata: {
        userId: user.id,  // Store the user ID in the subscription metadata
      },
      // Add a free trial period of 3 days to the subscription
      trial_period_days: 3,  // Set the trial period (3 days)
    },
    
    // Custom text to display during the checkout process (e.g., terms of service)
    custom_text: {
      terms_of_service_acceptance: {
        message: `I have read the Resume & Cover Letter AI Genius's [terms of service](${env.NEXT_PUBLIC_BASE_URL}/tos) and agree to them.`,
      },
      submit: {
        message: `Get ${planName} Access`
      }
    },
    
    // Request the user to accept terms of service during the checkout process
    consent_collection: {
      terms_of_service: "required",  // User must accept terms of service to proceed
    },
    
    // Automatically collect the user's billing address during checkout
    billing_address_collection: "auto",
    
    // Specify the payment methods allowed (here, only "card" is supported)
    payment_method_types: ["card"],
    
    // Disable phone number collection during the checkout process (can be enabled if required)
    phone_number_collection: {
      enabled: false,
    },
  });

  // If the session URL is not generated properly, throw an error
  if (!session.url) {
    throw new Error("Failed to create checkout session");
  }

  // Return the session URL, which the frontend will use to redirect the user to Stripe's checkout page
  return session.url;
}
