import type React from "react";
import type { Metadata } from "next";
import { Inter, DM_Sans } from "next/font/google";
import "./globals.scss";
import { ThemeProvider } from "@/components/theme-provider";
import LoadingScreen from "@/components/loading-screen";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm",
  display: "swap",
});

const SITE_URL = "https://mylebalidoy.vercel.app";
const SITE_DESCRIPTION =
  "Portfolio of Myle Balidoy, a UI/UX Designer and Digital Designer from Laguna, Philippines. Explore case studies, Figma design systems, web and mobile app designs, certifications, and resume. Available for UI/UX design work.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Myle Balidoy | UI/UX Designer Portfolio",
    template: "%s | Myle Balidoy",
  },
  description: SITE_DESCRIPTION,
  applicationName: "Myle Balidoy Portfolio",
  keywords: [
    "Myle Balidoy",
    "UI/UX Designer",
    "UI UX Designer Philippines",
    "UI/UX Designer portfolio",
    "UX Designer portfolio",
    "Digital Designer",
    "Figma designer",
    "Product designer",
    "Web designer",
    "Mobile app design",
    "Design systems",
    "Wireframing",
    "Prototyping",
    "User research",
    "Freelance UI/UX designer",
    "Laguna",
    "Philippines",
  ],
  authors: [{ name: "Myle Balidoy", url: SITE_URL }],
  creator: "Myle Balidoy",
  publisher: "Myle Balidoy",
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Myle Balidoy | UI/UX Designer Portfolio",
    title: "Myle Balidoy | UI/UX Designer Portfolio",
    description: SITE_DESCRIPTION,
    locale: "en_US",
    images: [
      {
        url: "/assets/mylepersona.png",
        alt: "Myle Balidoy, UI/UX Designer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Myle Balidoy | UI/UX Designer Portfolio",
    description: SITE_DESCRIPTION,
    images: ["/assets/mylepersona.png"],
  },
  icons: {
    icon: "/assets/mylepersona.png",
    apple: "/assets/mylepersona.png",
  },
  category: "design",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <body
        className={`${dmSans.variable} ${inter.variable} font-sans`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <LoadingScreen>{children}</LoadingScreen>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
