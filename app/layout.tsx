import type React from "react";
import type { Metadata } from "next";
import { Inter, DM_Sans } from "next/font/google";
import "./globals.scss";
import { ThemeProvider } from "@/components/theme-provider";
import LoadingScreen from "@/components/loading-screen";

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

export const metadata: Metadata = {
  title: "Myle Balidoy",
  description:
    "UI/UX Designer crafting inclusive digital experiences by putting users first.",
  icons: {
    icon: "/assets/mylepersona.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${dmSans.variable} ${inter.variable} font-sans`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <LoadingScreen />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
