import type { Metadata } from "next";
import Script from "next/script";
import { ContactPageContent } from "@/components/contact/ContactPageContent";
import { siteContact } from "@/lib/contact/siteContact";
import { siteLegal } from "@/lib/legal/siteLegal";

export const metadata: Metadata = {
  title: "Contact Us",
  description: `Contact ${siteLegal.brandName} (${siteLegal.entityName}) in Thanjavur. Call ${siteContact.phone.display} or email ${siteLegal.email} for orders, custom prints, and support.`,
  alternates: {
    canonical: "/contact",
  },
};

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: siteLegal.brandName,
  legalName: siteLegal.entityName,
  email: siteLegal.email,
  telephone: siteContact.phone.href.replace("tel:", ""),
  address: {
    "@type": "PostalAddress",
    streetAddress: siteContact.address.line1,
    addressLocality: siteContact.address.city,
    postalCode: siteContact.address.postalCode,
    addressCountry: siteContact.address.country,
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "18:00",
    },
  ],
};

export default function ContactPage() {
  return (
    <>
      <Script
        id="contact-local-business-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessJsonLd),
        }}
      />
      <ContactPageContent />
    </>
  );
}
