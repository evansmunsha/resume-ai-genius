"use server";

import { env } from "@/env";
import stripe from "@/lib/stripe";
import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function createCheckoutSession(priceId: string): Promise<string> {
  // Get the current authenticated user
  const user = await currentUser();

  if (!user) {
    throw new Error("Unauthorized: No user is authenticated.");
  }

  // Retrieve the Stripe Customer ID from user metadata
  const stripeCustomerId = user.privateMetadata.stripeCustomerId as string | undefined;

  if (!priceId) {
    throw new Error("Missing price ID.");
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

  try {
    // Check if the user has an existing subscription or has had one in the past
    const existingSubscription = await prisma.userSubscription.findUnique({
      where: { userId: user.id },
    });

    let trialEnd: number | undefined;
    if (existingSubscription) {
      // If user has an existing subscription, check if they're eligible for a trial
      if (isPro && !existingSubscription.proTrialExpired) {
        trialEnd = Math.floor(Date.now() / 1000) + 3 * 24 * 60 * 60; // 3 days from now
      } else if (isEnterprise && !existingSubscription.enterpriseTrialExpired) {
        trialEnd = Math.floor(Date.now() / 1000) + 3 * 24 * 60 * 60; // 3 days from now
      }
    } else {
      // If no existing subscription, check if the user's email has been used before
      const emailUsed = await prisma.userSubscription.findFirst({
        where: { 
          OR: user.emailAddresses.map(email => ({ userEmail: email.emailAddress }))
        }
      });

      if (emailUsed) {
        // If the email has been used before, don't offer a trial
        console.log("Email previously used, no trial offered");
        trialEnd = undefined;
      } else {
        trialEnd = Math.floor(Date.now() / 1000) + 3 * 24 * 60 * 60; // 3 days from now for new users
      }
    }

    // Create a new Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      line_items: [{ price: priceId, quantity: 1 }],
      mode: "subscription",
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
    });

    if (!session.url) {
      throw new Error("Failed to create checkout session: Missing session URL.");
    }

    return session.url;
  } catch (error) {
    console.error("Error creating Stripe Checkout session:", error);
    throw new Error("An error occurred while creating the checkout session. Please try again.");
  }
}






































/* "use server";

import { env } from "@/env"; // Import environment variables
import stripe from "@/lib/stripe"; // Import the Stripe instance
import { currentUser } from "@clerk/nextjs/server"; // Import Clerk for user authentication

// Function to create a Checkout session with a free trial
export async function createCheckoutSession(priceId: string): Promise<string> {
  // Fetch the currently authenticated user using Clerk
  const user = await currentUser();

  // If no user is authenticated, throw an error
  if (!user) {
    throw new Error("Unauthorized: No user is authenticated.");
  }

  // Retrieve the user's Stripe Customer ID from metadata (stored during user creation)
  const stripeCustomerId = user.privateMetadata.stripeCustomerId as string | undefined;

  // Validate that a price ID was provided
  if (!priceId) {
    throw new Error("Missing price ID.");
  }

  // Ensure necessary environment variables are available
  if (!env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_PLUS_MONTHLY) {
    throw new Error("Environment variable for Pro Plus price ID is missing.");
  }

  // Determine plan type based on the provided price ID
  const isPremiumPlus = priceId === env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_PLUS_MONTHLY;
  const planName = isPremiumPlus ? "premium_plus" : "premium";

  // Set the plan description based on the selected type"premium" | "premium_plus"
  const description = isPremiumPlus
    ? "Unlimited resumes & cover letters with advanced AI features. Includes all premium templates, design customization, and priority support."
    : "Create professional resumes & cover letters with AI assistance. Includes 3 documents each, AI tools, and premium templates.";

  try {
    // Create a new Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      line_items: [{ price: priceId, quantity: 1 }], // Product details
      mode: "subscription", // Specifies a recurring subscription
      success_url: `${env.NEXT_PUBLIC_BASE_URL}/billing/success`, // Redirect after successful payment
      cancel_url: `${env.NEXT_PUBLIC_BASE_URL}/billing`, // Redirect after cancellation
      customer: stripeCustomerId, // Attach customer if available
      customer_email: stripeCustomerId ? undefined : user.emailAddresses[0]?.emailAddress, // Use email if no customer ID
      metadata: {
        userId: user.id, // Store user ID for reference
        planName, // Store selected plan name
        description, // Store plan description
      },
      subscription_data: {
        metadata: { userId: user.id }, // Additional metadata for subscription
        trial_period_days: 3, // Add a 3-day free trial
      },
      custom_text: {
        terms_of_service_acceptance: {
          message: `I have read the Resume & Cover Letter AI Genius's [terms of service](${env.NEXT_PUBLIC_BASE_URL}/tos) and agree to them.`,
        },
        submit: {
          message: `Get ${planName} Access`, // Custom button text
        },
      },
      consent_collection: {
        terms_of_service: "required", // User must accept terms of service
      },
      billing_address_collection: "auto", // Automatically collect billing address
      payment_method_types: ["card"], // Limit to card payments
      phone_number_collection: { enabled: false }, // Do not collect phone numbers
    });

    // Verify that the session URL is available
    if (!session.url) {
      throw new Error("Failed to create checkout session: Missing session URL.");
    }

    // Return the session URL for redirection to Stripe Checkout
    return session.url;
  } catch (error) {
    // Log the error and throw a user-friendly message
    console.error("Error creating Stripe Checkout session:", error);
    throw new Error("An error occurred while creating the checkout session. Please try again.");
  }
} */



























/* "use server";

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
 */