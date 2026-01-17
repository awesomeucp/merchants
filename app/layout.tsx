import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Providers } from "@/components/providers";
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "UCP Merchant Directory | Discover AI-Ready Commerce",
  description: "Discover stores ready for AI commerce. Browse verified UCP-enabled merchants compatible with AI shopping agents.",
  keywords: ["UCP", "Universal Commerce Protocol", "AI commerce", "shopping agents", "merchants", "e-commerce"],
  authors: [{ name: "UCP Team" }],
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
  },
  openGraph: {
    title: "UCP Merchant Directory",
    description: "Discover stores ready for AI commerce. Browse verified UCP-enabled merchants compatible with AI shopping agents.",
    type: "website",
    url: "https://merchants.awesomeucp.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <Providers>
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
