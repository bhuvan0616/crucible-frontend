import { contactSubjects, type ContactSubject } from "./siteContact";

export interface ContactFormValues {
  name: string;
  email: string;
  phone: string;
  subject: ContactSubject | "";
  message: string;
}

export type ContactFormField = keyof ContactFormValues;

export type ContactFormErrors = Partial<Record<ContactFormField, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const VALID_SUBJECTS = new Set(contactSubjects.map((s) => s.value));

export function validateContactForm(
  values: ContactFormValues
): ContactFormErrors {
  const errors: ContactFormErrors = {};

  const name = values.name.trim();
  if (!name) {
    errors.name = "Name is required";
  } else if (name.length > 120) {
    errors.name = "Name is too long";
  }

  const email = values.email.trim();
  if (!email) {
    errors.email = "Email is required";
  } else if (!EMAIL_RE.test(email)) {
    errors.email = "Enter a valid email address";
  }

  const phone = values.phone.trim();
  if (phone && (phone.length < 10 || phone.length > 15)) {
    errors.phone = "Enter a valid phone number";
  }

  if (!values.subject || !VALID_SUBJECTS.has(values.subject as ContactSubject)) {
    errors.subject = "Please select a subject";
  }

  const message = values.message.trim();
  if (!message) {
    errors.message = "Message is required";
  } else if (message.length < 10) {
    errors.message = "Message must be at least 10 characters";
  } else if (message.length > 5000) {
    errors.message = "Message is too long";
  }

  return errors;
}

export function hasContactFormErrors(errors: ContactFormErrors): boolean {
  return Object.keys(errors).length > 0;
}

export function toContactPayload(values: ContactFormValues) {
  return {
    name: values.name.trim(),
    email: values.email.trim(),
    phone: values.phone.trim() || undefined,
    subject: values.subject as ContactSubject,
    message: values.message.trim(),
  };
}

export type ContactPayload = ReturnType<typeof toContactPayload>;
