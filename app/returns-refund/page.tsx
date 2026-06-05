import type { Metadata } from "next";
import { ReturnsRefundPageContent } from "@/components/legal/ReturnsRefundPageContent";
import { siteLegal } from "@/lib/legal/siteLegal";

export const metadata: Metadata = {
  title: "Returns & Refund Policy",
  description: `Returns and refund policy for ${siteLegal.brandName}. Custom 3D-printed orders, no returns for change of mind, replacements for manufacturing defects.`,
  alternates: {
    canonical: "/returns-refund",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ReturnsRefundPage() {
  return <ReturnsRefundPageContent />;
}
