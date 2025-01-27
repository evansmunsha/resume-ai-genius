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
      });
    }

    const now = new Date();

    // Determine subscription status
    let status: 'FREE' | 'PRO' | 'ENTERPRISE';

    if (subscription.stripeCurrentPeriodEnd > now) {
      if (subscription.stripePriceId === process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_MONTHLY) {
        status = 'PRO';
      } else if (subscription.stripePriceId === process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_PLUS_MONTHLY) {
        status = 'ENTERPRISE';
      } else {
        status = 'FREE';
      }
    } else {
      status = 'FREE';
    }

    return NextResponse.json({
      status,
    });
    
  } catch (error) {
    if (process.env.NODE_ENV === 'production') {
      console.error('Subscription status error:', (error as Error).message);
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
