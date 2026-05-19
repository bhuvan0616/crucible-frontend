import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import "./globals.css";

const rubik = Rubik({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-rubik",
});

export const metadata: Metadata = {
  title: "Crucible Creations | Premium 3D Printed Products",
  description: "Portable Keychain Phone Stand - Foldable, Compact, Customizable. Crafted with precision 3D printing.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-full flex flex-col antialiased" style={{ fontFamily: "'Rubik', sans-serif" }}>
        {children}
      </body>
    </html>
  );
}