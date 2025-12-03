import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import Header from "@/components/header";
import { Footer } from "@/components/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://rith.dev";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Rithfolio",
    template: "%s | Rithfolio",
  },
  description: "Harith's personal portfolio and blog",
  openGraph: {
    title: "Rithfolio",
    description: "Harith's personal portfolio and blog",
    url: baseUrl,
    siteName: "Rithfolio",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rithfolio",
    description: "Harith's personal portfolio and blog",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body className="text-sm sm:text-base">
        <ThemeProvider attribute="class" enableSystem defaultTheme="system">
          <Header />
          <main className="bg-background text-foreground mx-auto min-h-screen max-w-4xl px-4 pt-[56px] transition-colors duration-300 sm:pt-[64px] md:pt-[72px]">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
