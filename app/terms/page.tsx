import type { Metadata } from "next";
import { TermsPageContent } from "@/components/legal/TermsPageContent";
import { siteLegal } from "@/lib/legal/siteLegal";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: `Terms and Conditions for shopping at ${siteLegal.brandName} (${siteLegal.websiteDisplay}), part of ${siteLegal.entityName}. Custom 3D-printed products, India shipping, GST-inclusive pricing.`,
  alternates: {
    canonical: "/terms",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function TermsPage() {
  return <TermsPageContent />;
}
