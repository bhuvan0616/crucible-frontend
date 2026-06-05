import type { Metadata } from "next";
import { PrivacyPageContent } from "@/components/legal/PrivacyPageContent";
import { siteLegal } from "@/lib/legal/siteLegal";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `Privacy Policy for ${siteLegal.brandName} (${siteLegal.websiteDisplay}). How ${siteLegal.entityName} collects, uses, and protects your personal data.`,
  alternates: {
    canonical: "/privacy",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacyPage() {
  return <PrivacyPageContent />;
}
