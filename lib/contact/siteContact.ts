export const siteContact = {
  businessName: "Crucible Creations",
  address: {
    line1: "10/191, 10th Cross East, Gananm nagar",
    city: "Thanjavur",
    postalCode: "613501",
    country: "India",
    get full() {
      return `${this.line1}, ${this.city}-${this.postalCode}`;
    },
  },
  phone: {
    raw: "8344080302",
    display: "+91 83440 80302",
    href: "tel:+918344080302",
  },
  email: {
    address: "contact@cruciblecreations.studio",
    href: "mailto:contact@cruciblecreations.studio",
  },
  hours: {
    label: "Mon–Fri, 9:00 AM – 6:00 PM IST",
    timezone: "Asia/Kolkata",
  },
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=10%2F191%2C+10th+Cross+East%2C+Gananm+nagar%2C+Thanjavur+613501",
} as const;

export const contactSubjects = [
  { value: "general", label: "General inquiry" },
  { value: "order", label: "Order support" },
  { value: "custom_product", label: "Custom product" },
  { value: "other", label: "Other" },
] as const;

export type ContactSubject = (typeof contactSubjects)[number]["value"];
