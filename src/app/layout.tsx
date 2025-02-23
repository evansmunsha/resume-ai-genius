import { Toaster as UIToaster } from "@/components/ui/toaster";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "next-themes";
import { Inter } from "next/font/google";
import "./globals.css";
import { constructMetadata } from "@/lib/utils";
import dynamic from 'next/dynamic'
import AdSense from "@/components/AdSense";

const inter = Inter({ subsets: ["latin"] });

export const metadata = constructMetadata()

// Defer non-critical components
const Analytics = dynamic(() => import('@vercel/analytics/react').then(mod => mod.Analytics))
const SpeedInsights = dynamic(() => import('@vercel/speed-insights/next').then(mod => mod.SpeedInsights))

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <head>
          {/* @ts-ignore */}
          <AdSense pId={'3267288412255550, google.com, pub-3267288412255550, DIRECT, f08c47fec0942fa0'} />
          <meta name="google-adsense-account" content="ca-pub-3267288412255550"></meta>
        </head>
        <body className={inter.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Analytics />
            <SpeedInsights />
            <UIToaster />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
