import { siteContact } from "@/lib/contact/siteContact";

export const siteLegal = {
  entityName: "COKUPA FOODS (OPC) PRIVATE LIMITED",
  brandName: "Crucible Creations",
  gstin: "33AAMCC0702C1ZE",
  website: "https://cruciblecreations.studio",
  websiteDisplay: "cruciblecreations.studio",
  email: "contact@cruciblecreations.studio",
  emailHref: "mailto:contact@cruciblecreations.studio",
  phone: siteContact.phone,
  address: siteContact.address,
  lastUpdated: "2 June 2026",
  shipping: {
    regions: "India only",
    freeShippingMinimumInr: 1000,
  },
  returns: {
    defectReportDays: 7,
  },
  governingLaw: "Tamil Nadu, India",
  privacy: {
    grievanceEmail: "contact@cruciblecreations.studio",
    medusaHosting:
      "self-hosted Medusa commerce backend on a VPS in Oracle Cloud (Mumbai region, India)",
    paymentProcessor: "Cashfree",
    emailProvider: "Resend",
    analytics: "Google Analytics 4 (GA4)",
    authProvider: "Google (sign-in via Medusa OAuth only)",
    retention:
      "while your account remains active, and as needed for legal, tax, or dispute purposes thereafter",
    crossBorderNotice:
      "Some service providers may process data outside India (for example in the United States or European Union).",
  },
} as const;
