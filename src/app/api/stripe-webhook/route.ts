import { env } from "@/env";
import prisma from "@/lib/prisma";
import stripe from "@/lib/stripe";
import { clerkClient } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";
import Stripe from "stripe";



export async function POST(req: NextRequest) {
  try {
    const payload = await req.text();
    const signature = req.headers.get("stripe-signature");

    if (!signature) {
      return new Response("Signature is missing", { status: 400 });
    }

    // Verify the webhook signature
    const event = stripe.webhooks.constructEvent(
      payload,
      signature,
      env.STRIPE_WEBHOOK_SECRET,
    );

    console.log(`Received event: ${event.type}`, JSON.stringify(event.data.object, null, 2));

    // Handle different event types
    switch (event.type) {
      case "checkout.session.completed":
        await handleSessionCompleted(event.data.object as Stripe.Checkout.Session);
        break;
      case "customer.subscription.created":
      case "customer.subscription.updated":
        await handleSubscriptionCreatedOrUpdated(event.data.object as Stripe.Subscription);
        break;
      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
        break;
    }

    return new Response("Event received", { status: 200 });
  } catch (error) {
    console.error('Error in Stripe webhook handler:', error);
    return new Response("Internal server error", { status: 500 });
  }
}

async function handleSessionCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId;

  if (!userId) {
    throw new Error("User ID is missing in session metadata");
  }

  await (
    await clerkClient()
  ).users.updateUserMetadata(userId, {
    privateMetadata: {
      stripeCustomerId: session.customer as string,
    },
  });

  // Fetch the actual subscription details
  const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
  const subscriptionStatus = determineSubscriptionStatus(subscription);

  console.log(`Handling completed session for user ${userId}. Status: ${subscriptionStatus}`);

  // Fetch user's email from Clerk
const clerk = await clerkClient(); // This returns an instance of ClerkClient
const user = await clerk.users.getUser(userId);
const userEmail = user.emailAddresses[0]?.emailAddress;


  // Update or create the user's subscription record
  await prisma.userSubscription.upsert({
    where: { userId },
    create: {
      userId,
      userEmail,
      stripeCustomerId: session.customer as string,
      stripeSubscriptionId: session.subscription as string,
      stripePriceId: subscription.items.data[0].price.id,
      stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
      stripeCancelAtPeriodEnd: subscription.cancel_at_period_end,
      subscriptionStatus,
      // Add discount tracking
      stripeDiscountApplied: subscription.discount?.coupon.id === env.STRIPE_POST_TRIAL_PRO_COUPON_ID || 
                            subscription.discount?.coupon.id === env.STRIPE_POST_TRIAL_ENTERPRISE_COUPON_ID,
      discountUsedAt: subscription.discount ? new Date() : null,
    },
    update: {
      userEmail,
      stripeCustomerId: session.customer as string,
      stripeSubscriptionId: session.subscription as string,
      stripePriceId: subscription.items.data[0].price.id,
      stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
      stripeCancelAtPeriodEnd: subscription.cancel_at_period_end,
      subscriptionStatus,
      // Add discount tracking
      stripeDiscountApplied: subscription.discount?.coupon.id === env.STRIPE_POST_TRIAL_PRO_COUPON_ID || 
                            subscription.discount?.coupon.id === env.STRIPE_POST_TRIAL_ENTERPRISE_COUPON_ID,
      discountUsedAt: subscription.discount ? new Date() : null,
    },
  });

  console.log(`Session completed for user ${userId} with customer ID ${session.customer}`);
}

async function handleSubscriptionCreatedOrUpdated(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.userId;

  if (!userId) {
    throw new Error("User ID is missing in subscription metadata");
  }

  const subscriptionStatus = determineSubscriptionStatus(subscription);
  const now = new Date();

  console.log(`Handling subscription update for user ${userId}. New status: ${subscriptionStatus}`);

  const isPro = subscription.items.data[0].price.id === env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_MONTHLY;
  const isEnterprise = subscription.items.data[0].price.id === env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_PLUS_MONTHLY;

  // Update or create the user's subscription record
  await prisma.userSubscription.upsert({
    where: { userId },
    create: {
      userId,
      stripeSubscriptionId: subscription.id,
      stripeCustomerId: subscription.customer as string,
      stripePriceId: subscription.items.data[0].price.id,
      stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
      stripeCancelAtPeriodEnd: subscription.cancel_at_period_end,
      subscriptionStatus,
      subscriptionEndDate: new Date(subscription.current_period_end * 1000),
      // Set trial information based on the subscription type
      proTrialStart: isPro && subscription.trial_start
        ? new Date(subscription.trial_start * 1000)
        : null,
      proTrialEnd: isPro && subscription.trial_end
        ? new Date(subscription.trial_end * 1000)
        : null,
      proTrialExpired: isPro && subscription.trial_end 
        ? now > new Date(subscription.trial_end * 1000) 
        : false,
      enterpriseTrialStart: isEnterprise && subscription.trial_start
        ? new Date(subscription.trial_start * 1000)
        : null,
      enterpriseTrialEnd: isEnterprise && subscription.trial_end
        ? new Date(subscription.trial_end * 1000)
        : null,
      enterpriseTrialExpired: isEnterprise && subscription.trial_end
        ? now > new Date(subscription.trial_end * 1000)
        : false,
      stripeDiscountApplied: subscription.discount?.coupon.id === process.env.STRIPE_POST_TRIAL_PRO_COUPON_ID || 
                            subscription.discount?.coupon.id === process.env.STRIPE_POST_TRIAL_ENTERPRISE_COUPON_ID,
    },
    update: {
      stripeSubscriptionId: subscription.id,
      stripePriceId: subscription.items.data[0].price.id,
      stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
      stripeCancelAtPeriodEnd: subscription.cancel_at_period_end,
      subscriptionStatus,
      subscriptionEndDate: new Date(subscription.current_period_end * 1000),
      // Update trial information based on the subscription type
      proTrialStart: isPro && subscription.trial_start
        ? new Date(subscription.trial_start * 1000)
        : undefined,
      proTrialEnd: isPro && subscription.trial_end
        ? new Date(subscription.trial_end * 1000)
        : undefined,
      proTrialExpired: isPro && subscription.trial_end 
        ? now > new Date(subscription.trial_end * 1000) 
        : undefined,
      enterpriseTrialStart: isEnterprise && subscription.trial_start
        ? new Date(subscription.trial_start * 1000)
        : undefined,
      enterpriseTrialEnd: isEnterprise && subscription.trial_end
        ? new Date(subscription.trial_end * 1000)
        : undefined,
      enterpriseTrialExpired: isEnterprise && subscription.trial_end
        ? now > new Date(subscription.trial_end * 1000)
        : undefined,
      stripeDiscountApplied: subscription.discount?.coupon.id === process.env.STRIPE_POST_TRIAL_PRO_COUPON_ID || 
                            subscription.discount?.coupon.id === process.env.STRIPE_POST_TRIAL_ENTERPRISE_COUPON_ID,
    },
  });

  console.log(`Subscription updated for user ${userId}. Status: ${subscriptionStatus}`);
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.userId;

  if (!userId) {
    throw new Error("User ID is missing in subscription metadata");
  }

  console.log(`Handling subscription deletion for user ${userId}`);

  // Update the user's subscription record to reflect the cancellation
  await prisma.userSubscription.update({
    where: { userId },
    data: {
      subscriptionStatus: "free",
      subscriptionEndDate: null,
      proTrialExpired: true,
      enterpriseTrialExpired: true,
    },
  });

  console.log(`Subscription deleted for user ${userId}`);
}

// Helper function to determine the subscription status
function determineSubscriptionStatus(subscription: Stripe.Subscription): 'free' | 'pro' | 'enterprise' {
  if (subscription.status === 'trialing' || subscription.status === 'active') {
    const priceId = subscription.items.data[0].price.id;
    if (priceId === env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_PLUS_MONTHLY) {
      return 'enterprise';
    } else if (priceId === env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_MONTHLY) {
      return 'pro';
    }
  }

  return 'free';
}


















/* import { env } from "@/env";
import prisma from "@/lib/prisma";
import stripe from "@/lib/stripe";
import { clerkClient } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  try {
    const payload = await req.text();
    const signature = req.headers.get("stripe-signature");

    if (!signature) {
      return new Response("Signature is missing", { status: 400 });
    }

    const event = stripe.webhooks.constructEvent(
      payload,
      signature,
      env.STRIPE_WEBHOOK_SECRET,
    );

    console.log(`Received event: ${event.type}`, event.data.object);

    switch (event.type) {
      case "checkout.session.completed":
        await handleSessionCompleted(event.data.object);
        break;
      case "customer.subscription.created":
      case "customer.subscription.updated":
        await handleSubscriptionCreatedOrUpdated(event.data.object.id);
        break;
      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(event.data.object);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
        break;
    }

    return new Response("Event received", { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response("Internal server error", { status: 500 });
  }
}

async function handleSessionCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId;

  if (!userId) {
    throw new Error("User ID is missing in session metadata");
  }

  await (
    await clerkClient()
  ).users.updateUserMetadata(userId, {
    privateMetadata: {
      stripeCustomerId: session.customer as string,
    },
  });
}

async function handleSubscriptionCreatedOrUpdated(subscriptionId: string) {
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  await prisma.userSubscription.upsert({
    where: { userId: subscription.metadata.userId },
    create: {
      userId: subscription.metadata.userId,
      stripeSubscriptionId: subscription.id,
      stripeCustomerId: subscription.customer as string,
      stripePriceId: subscription.items.data[0].price.id,
      stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
      stripeCancelAtPeriodEnd: subscription.cancel_at_period_end,
      trialStart: subscription.trial_start
        ? new Date(subscription.trial_start * 1000)
        : null,
      trialEnd: subscription.trial_end
        ? new Date(subscription.trial_end * 1000)
        : null,
    },
    update: {
      stripePriceId: subscription.items.data[0].price.id,
      stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
      stripeCancelAtPeriodEnd: subscription.cancel_at_period_end,
      trialStart: subscription.trial_start
        ? new Date(subscription.trial_start * 1000)
        : null,
      trialEnd: subscription.trial_end
        ? new Date(subscription.trial_end * 1000)
        : null,
    },
  });

  console.log('Subscription Trial Start:', subscription.trial_start);
console.log('Subscription Trial End:', subscription.trial_end);
console.log('Subscription Status:', subscription.status);

}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  await prisma.userSubscription.deleteMany({
    where: {
      stripeCustomerId: subscription.customer as string,
    },
  });
}

 */