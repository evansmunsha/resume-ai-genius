import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { currentUser } from '@clerk/nextjs/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const user = await currentUser()
    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    console.log("API Route: Fetching subscription for user:", user.id);

    const subscription = await prisma.userSubscription.findUnique({
      where: { userId: user.id },
    });
    
    console.log("API Route: Raw subscription data:", JSON.stringify(subscription, null, 2));
    
    if (!subscription) {
      console.log("No subscription found, returning free status");
      return NextResponse.json({
        status: 'FREE',
        proTrialEndsAt: null,
        enterpriseTrialEndsAt: null,
        trialExpired: false,
        trialEndingSoon: false
      });
    }
    
    const now = new Date();
    const HOURS_24 = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

    // Check if trial is ending soon
    const proTrialEndingSoon = subscription.proTrialEnd ? 
      (new Date(subscription.proTrialEnd).getTime() - now.getTime() <= HOURS_24 && 
       new Date(subscription.proTrialEnd).getTime() > now.getTime()) : 
      false;

    const isProTrialActive = subscription.proTrialEnd ? 
      (new Date(subscription.proTrialEnd) > now && !subscription.proTrialExpired) : 
      false;

    const isEnterpriseTrialActive = subscription.enterpriseTrialEnd ? 
      (new Date(subscription.enterpriseTrialEnd) > now && !subscription.enterpriseTrialExpired) : 
      false;
    
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
    
    // Check if trials just expired
    if (subscription.proTrialEnd && new Date(subscription.proTrialEnd) < now && !subscription.proTrialExpired) {
      await prisma.userSubscription.update({
      where: { userId: user.id },
        data: { proTrialExpired: true }
      });
    }

    if (subscription.enterpriseTrialEnd && new Date(subscription.enterpriseTrialEnd) < now && !subscription.enterpriseTrialExpired) {
      await prisma.userSubscription.update({
      where: { userId: user.id },
        data: { enterpriseTrialExpired: true }
      });
    }

    return NextResponse.json({
      status,
      proTrialEndsAt: isProTrialActive ? subscription.proTrialEnd?.toISOString() : null,
      enterpriseTrialEndsAt: isEnterpriseTrialActive ? subscription.enterpriseTrialEnd?.toISOString() : null,
      trialExpired: subscription.proTrialExpired || subscription.enterpriseTrialExpired,
      trialEndingSoon: proTrialEndingSoon,
    });
    
  } catch (error) {
    if (process.env.NODE_ENV === 'production') {
      console.error('Subscription status error:', (error as Error).message);
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
