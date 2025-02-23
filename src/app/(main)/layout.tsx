'use server';

import PremiumModal from "@/components/premium/PremiumModal";
import { getUserSubscriptionLevel } from "@/lib/subscription";
import { auth } from "@clerk/nextjs/server";
import Navbar from "./Navbar";
import SubscriptionLevelProvider from "./SubscriptionLevelProvider";
import AdSense from "@/components/AdSense";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  const userSubscriptionLevel = await getUserSubscriptionLevel(userId);

  return (
    <SubscriptionLevelProvider userSubscriptionLevel={userSubscriptionLevel}>
      <div className="flex min-h-screen flex-col">
        <head>
          {/* @ts-ignore */}
          <AdSense pId={'3267288412255550, google.com, pub-3267288412255550, DIRECT, f08c47fec0942fa0'} />
          <meta name="google-adsense-account" content="ca-pub-3267288412255550"></meta>
        </head>
        <Navbar />
        {children}
        <PremiumModal />      
            
      </div>
    </SubscriptionLevelProvider>
  );
}
