import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Navbar from "@/components/layout/navbar";
import { Providers } from "./providers";

const rubik = Rubik({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-rubik",
});

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Crucible Creations | Premium 3D Printed Products",
    template: "%s | Crucible Creations",
  },
  description: "Portable Keychain Phone Stand - Foldable, Compact, Customizable. Crafted with precision 3D printing.",
  keywords: [
    "3D printed products",
    "custom keychain",
    "phone stand",
    "portable phone stand",
    "foldable phone stand",
    "personalized gift",
    "customized accessories",
  ],
  authors: [{ name: "Crucible Creations" }],
  creator: "Crucible Creations",
  publisher: "Crucible Creations",
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
  openGraph: {
    type: "website",
    locale: "en_US",
    url: BASE_URL,
    siteName: "Crucible Creations",
    title: "Crucible Creations | Premium 3D Printed Products",
    description: "Portable Keychain Phone Stand - Foldable, Compact, Customizable. Crafted with precision 3D printing.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Crucible Creations - Premium 3D Printed Products",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Crucible Creations | Premium 3D Printed Products",
    description: "Portable Keychain Phone Stand - Foldable, Compact, Customizable. Crafted with precision 3D printing.",
    images: ["/og-image.png"],
    creator: "@cruciblecreations",
  },
  alternates: {
    canonical: BASE_URL,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-full flex flex-col antialiased" style={{ fontFamily: "'Rubik', sans-serif" }}>
        <Providers>
          <Navbar />
          {children}
        </Providers>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
          strategy="afterInteractive"
        />
        <Script id="ga4-config" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XXXXXXXXXX');
          `}
        </Script>
      </body>
    </html>
  );
}