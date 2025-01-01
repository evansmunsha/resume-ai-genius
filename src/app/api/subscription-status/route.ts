import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { currentUser } from '@clerk/nextjs/server';

export async function GET() {
  try {
    const user = await currentUser()
    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    console.log(`Fetching subscription for user: ${user}`);

    const subscription = await prisma.userSubscription.findUnique({
      where: { userId: user.id },
    });
    
    console.log("Raw subscription data:", JSON.stringify(subscription, null, 2));
    
    if (!subscription) {
      console.log("No subscription found, returning free status");
      return NextResponse.json({
        status: 'FREE',
        proTrialEndsAt: null,
        enterpriseTrialEndsAt: null,
      });
    }
    
    const now = new Date();
    const isProTrialActive = subscription.proTrialEnd && new Date(subscription.proTrialEnd) > now && !subscription.proTrialExpired;
    const isEnterpriseTrialActive = subscription.enterpriseTrialEnd && new Date(subscription.enterpriseTrialEnd) > now && !subscription.enterpriseTrialExpired;
    
    let status: 'FREE' | 'PRO' | 'ENTERPRISE';

    if (subscription.stripeCurrentPeriodEnd > now) {
      if (subscription.stripePriceId === process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_MONTHLY) {
        status = 'PRO';
      } else if (subscription.stripePriceId === process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_PLUS_MONTHLY) {
        status = 'ENTERPRISE';
      } else {
        status = 'FREE';
      }
    } else if (isEnterpriseTrialActive) {
      status = 'ENTERPRISE';
    } else if (isProTrialActive) {
      status = 'PRO';
    } else {
      status = 'FREE';
    }
    
    console.log(`Determined status: ${status}`);
    console.log(`Pro trial end date: ${subscription.proTrialEnd}`);
    console.log(`Enterprise trial end date: ${subscription.enterpriseTrialEnd}`);
    
    return NextResponse.json({
      status: status,
      proTrialEndsAt: isProTrialActive ? subscription.proTrialEnd?.toISOString() : null,
      enterpriseTrialEndsAt: isEnterpriseTrialActive ? subscription.enterpriseTrialEnd?.toISOString() : null,
    });
    
  } catch (error) {
    console.error('Error fetching subscription status:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}














/* import { env } from "@/env";
import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const user = await currentUser();
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const subscription = await prisma.userSubscription.findUnique({
      where: { userId: user.id },
    });

    const now = new Date();

    let status: SubscriptionStatus = "free";
    let trialEndsAt: string | null = null;

    if (
      subscription?.proTrialEnd &&
      new Date(subscription.proTrialEnd) > now &&
      !subscription.proTrialExpired
    ) {
      status = "trial"; // PRO trial
      trialEndsAt = subscription.proTrialEnd.toISOString();
    } else if (
      subscription?.enterpriseTrialEnd &&
      new Date(subscription.enterpriseTrialEnd) > now &&
      !subscription.enterpriseTrialExpired
    ) {
      status = "trial"; // ENTERPRISE trial
      trialEndsAt = subscription.enterpriseTrialEnd.toISOString();
    } else if (subscription.stripeCurrentPeriodEnd > now) {
      if (subscription?.stripePriceId === env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_MONTHLY) {
        status = "premium";
      } else if (subscription?.stripePriceId === env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_PLUS_MONTHLY) {
        status = "premium_plus";
      }
    }

    return NextResponse.json({
      status,
      trialEndsAt,
    });
  } catch (error) {
    console.error("Error fetching subscription status:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
} */





/* // /app/api/subscription-status/route.ts
import { NextResponse } from 'next/server'
import { currentUser } from "@clerk/nextjs/server"
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const user = await currentUser()
    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const subscription = await prisma.userSubscription.findUnique({
      where: { userId: user.id },
    });
    
    if (!subscription) {
      return NextResponse.json({
        status: 'free',
        trialEndsAt: null,
      });
    }
    
    // Determine if the trial is still active
    const isTrialActive = subscription.trialEnd && new Date(subscription.trialEnd) > new Date();
    
    return NextResponse.json({
      status: isTrialActive ? 'trial' : (subscription.subscriptionStatus as 'free' | 'premium' | 'premium_plus'),
      trialEndsAt: subscription.trialEnd?.toISOString() || null,
    });
    
    
    
  } catch (error) {
    console.error('Error fetching subscription status:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}  */

