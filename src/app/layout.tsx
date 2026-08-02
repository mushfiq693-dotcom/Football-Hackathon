import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/providers/auth-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import { GlobalPhaseProvider } from "@/providers/global-phase-provider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Football Auction",
    template: "%s | Football Auction",
  },
  description:
    "Real-time football player auction platform. Bid on players, manage teams, and run live auctions.",
  keywords: ["football", "auction", "player", "bidding", "team", "tournament"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} dark`} suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider defaultTheme="dark">
          <GlobalPhaseProvider>
            <AuthProvider>{children}</AuthProvider>
          </GlobalPhaseProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
