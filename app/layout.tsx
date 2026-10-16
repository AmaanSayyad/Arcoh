import type { Metadata, Viewport } from "next";
import { Manrope, Roboto_Mono, Unbounded } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import { Providers } from "./providers";
import { PostHogProvider } from "@/lib/posthog/PostHogProvider";

const inter = Manrope({
  variable: "--font-inter",
  subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto",
  subsets: ["latin"],
});

const display = Unbounded({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["700"],
});

const configuredSite = process.env.NEXT_PUBLIC_APP_URL?.trim().replace(/\/$/, '') || '';
const siteUrl = configuredSite && !/tapt/i.test(configuredSite) && !/localhost|127\.0\.0\.1/.test(configuredSite) ? configuredSite : 'https://arcoh.fun';

export const viewport: Viewport = {
  themeColor: '#070010',
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  appleWebApp: { capable: true, title: 'Arcoh', statusBarStyle: 'black-translucent' },
  title: "Arcoh — Short charts on Arc. USDC in, USDC out.",
  description:
    "Short charts for crypto, stocks, metals, and FX on Arc mainnet. Rounds run from 5 seconds to 1 minute and settle from a USDC house balance.",
  keywords: [
    "Arcoh",
    "binary options",
    "Arc",
    "USDC",
    "Circle",
    "crypto trading",
    "Web3",
    "prediction",
  ],
  icons: {
    icon: [
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon.png", sizes: "256x256", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: "/favicon-32.png",
  },
  openGraph: {
    type: 'website',
    siteName: 'Arcoh',
    url: siteUrl,
    title: "Arcoh — Short charts on Arc",
    description:
      "Short charts for crypto, stocks, metals, and FX. Rounds run from 5 seconds to 1 minute and settle from the house balance.",
  },
  twitter: {
    card: 'summary_large_image',
    site: '@Arcoh',
    title: "Arcoh — Short charts on Arc",
    description: "Short charts for crypto, stocks, metals, and FX. Rounds run from 5 seconds to 1 minute.",
  },
};

import { Header } from "@/components/Header";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: "try{delete document.documentElement.dataset.theme;localStorage.removeItem('tapt.theme');localStorage.removeItem('achoh.theme');localStorage.removeItem('arcoh.theme')}catch(e){}",
          }}
        />
      </head>
      <body
        suppressHydrationWarning
        className={`${inter.variable} ${robotoMono.variable} ${display.variable} antialiased h-dvh overflow-hidden flex flex-col`}
      >
        <PostHogProvider>
          <Providers>
            <Header />
            {/* Body is h-screen overflow-hidden: this must scroll or every page taller than the viewport is clipped. */}
            <main className="flex-1 relative flex flex-col min-h-0 min-w-0 overflow-y-auto overflow-x-hidden">
              {children}
            </main>
          </Providers>
        </PostHogProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
