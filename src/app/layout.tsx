import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { BackToTopButton } from "@/components/ui/BackToTopButton";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import {
  getHeaderData,
  getFooterData,
  getHomePageData,
  getGlobalSettings,
} from "@/lib/strapi";

const jakartaSans = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://kidsfoundation.edu.in"),
  title: "Kids' Foundation | Imphal, Manipur",
  description:
    "Kids' Foundation School, Imphal - A premier senior secondary co-educational CBSE institution.",
  authors: [{ name: "Kids' Foundation" }],
  openGraph: {
    title: "Kids' Foundation | Imphal, Manipur",
    description:
      "Kids' Foundation School, Imphal - A premier senior secondary co-educational CBSE institution.",
    url: "https://kidsfoundation.edu.in",
    siteName: "Kids' Foundation",
    locale: "en_US",
    type: "website",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
    ],
    apple: "/apple-icon.png",
    shortcut: "/favicon.ico",
  },
};

export const revalidate = 60;

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [headerData, footerData, homeData, globalData] = await Promise.all([
    getHeaderData(),
    getFooterData(),
    getHomePageData(),
    getGlobalSettings(),
  ]);

  return (
    <html lang="en" className={`${jakartaSans.variable} scroll-smooth`} suppressHydrationWarning>
      <body className="min-h-screen flex flex-col antialiased text-[#17345F]" suppressHydrationWarning>
        <Header headerData={headerData} globalData={globalData} />
        <div className="flex-1 flex flex-col">
          {children}
        </div>
        <Footer
          footerData={footerData}
          globalData={globalData}
          admissionsData={homeData?.admissionsCta}
        />
        <BackToTopButton />
      </body>
    </html>
  );
}
