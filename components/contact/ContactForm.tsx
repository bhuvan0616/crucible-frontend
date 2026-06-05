"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { contactSubjects } from "@/lib/contact/siteContact";
import {
  hasContactFormErrors,
  toContactPayload,
  validateContactForm,
  type ContactFormErrors,
  type ContactFormValues,
} from "@/lib/contact/validateContactForm";

const initialValues: ContactFormValues = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
};

export function ContactForm() {
  const [values, setValues] = useState<ContactFormValues>(initialValues);
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = <K extends keyof ContactFormValues>(
    field: K,
    value: ContactFormValues[K]
  ) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
    setSubmitError(null);
    setSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    const nextErrors = validateContactForm(values);
    if (hasContactFormErrors(nextErrors)) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(toContactPayload(values)),
      });

      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
        message?: string;
      };

      if (!res.ok) {
        setSubmitError(
          data.error ||
            data.message ||
            "Something went wrong. Please try again or email us directly."
        );
        return;
      }

      setSuccess(true);
      setValues(initialValues);
    } catch {
      setSubmitError(
        "Unable to send your message. Check your connection or email us directly."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div
        className="rounded-xl border border-[var(--color-lime)]/30 bg-[var(--color-lime)]/10 p-6 text-center"
        role="status"
      >
        <p className="text-lg font-semibold text-white">Message sent</p>
        <p className="mt-2 text-sm text-[var(--color-on-dark-muted)]">
          Thanks for reaching out. We&apos;ll reply within one business day.
        </p>
        <Button
          type="button"
          variant="outline"
          className="mt-6"
          onClick={() => setSuccess(false)}
        >
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          id="contact-name"
          label="Name"
          error={errors.name}
          className="sm:col-span-1"
        >
          <Input
            id="contact-name"
            type="text"
            autoComplete="name"
            value={values.name}
            onChange={(e) => updateField("name", e.target.value)}
            placeholder="Your name"
            aria-invalid={!!errors.name}
            disabled={isSubmitting}
          />
        </Field>

        <Field
          id="contact-email"
          label="Email"
          error={errors.email}
          className="sm:col-span-1"
        >
          <Input
            id="contact-email"
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={(e) => updateField("email", e.target.value)}
            placeholder="you@example.com"
            aria-invalid={!!errors.email}
            disabled={isSubmitting}
          />
        </Field>
      </div>

      <Field id="contact-phone" label="Phone (optional)" error={errors.phone}>
        <Input
          id="contact-phone"
          type="tel"
          autoComplete="tel"
          value={values.phone}
          onChange={(e) => updateField("phone", e.target.value)}
          placeholder="10-digit mobile number"
          aria-invalid={!!errors.phone}
          disabled={isSubmitting}
        />
      </Field>

      <Field id="contact-subject" label="Subject" error={errors.subject}>
        <Select
          id="contact-subject"
          value={values.subject}
          onValueChange={(value) =>
            updateField("subject", value as ContactFormValues["subject"])
          }
          options={contactSubjects.map((s) => ({
            value: s.value,
            label: s.label,
          }))}
          placeholder="Select a subject"
          disabled={isSubmitting}
        />
      </Field>

      <Field id="contact-message" label="Message" error={errors.message}>
        <Textarea
          id="contact-message"
          value={values.message}
          onChange={(e) => updateField("message", e.target.value)}
          placeholder="How can we help?"
          rows={5}
          aria-invalid={!!errors.message}
          disabled={isSubmitting}
        />
      </Field>

      {submitError && (
        <p className="text-sm text-red-400" role="alert">
          {submitError}
        </p>
      )}

      <Button type="submit" className="w-full sm:w-auto" disabled={isSubmitting}>
        {isSubmitting ? "Sending…" : "Send message"}
      </Button>
    </form>
  );
}

function Field({
  id,
  label,
  error,
  className,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <Label htmlFor={id} className="mb-2 block text-white">
        {label}
      </Label>
      {children}
      {error && (
        <p className="mt-1 text-xs text-red-400" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
