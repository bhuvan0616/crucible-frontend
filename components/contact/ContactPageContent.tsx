"use client";

import { motion } from "framer-motion";
import { ContactForm } from "@/components/contact/ContactForm";
import { ContactInfo } from "@/components/contact/ContactInfo";
import { pageMainClassName } from "@/components/layout/pageShell";
import { siteLegal } from "@/lib/legal/siteLegal";

export function ContactPageContent() {
  return (
    <main className={pageMainClassName}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-5xl"
        >
          <header className="mb-10 text-center md:mb-12">
            <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
              Contact us
            </h1>
            <p className="mx-auto mt-2 text-sm text-[var(--color-on-dark-muted)]">
              {siteLegal.brandName} · part of {siteLegal.entityName}
            </p>
            <p className="mx-auto mt-3 max-w-2xl text-[var(--color-on-dark-muted)]">
              Questions about an order, a custom print, or anything else?
              Reach out — we&apos;re happy to help.
            </p>
          </header>

          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08 }}
            aria-labelledby="contact-form-heading"
            className="mx-auto max-w-xl rounded-xl border border-[var(--color-hairline-violet)] bg-[var(--color-ink-deep)] p-6 md:p-8"
          >
            <h2
              id="contact-form-heading"
              className="mb-6 text-center text-lg font-semibold text-white md:text-left"
            >
              Send a message
            </h2>
            <ContactForm />
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.14 }}
            aria-labelledby="contact-details-heading"
            className="mt-14 border-t border-[var(--color-hairline-violet)] pt-12 md:mt-16 md:pt-14"
          >
            <h2
              id="contact-details-heading"
              className="mb-8 text-center text-sm font-semibold uppercase tracking-wider text-[var(--color-on-dark-muted)]"
            >
              Contact details
            </h2>
            <ContactInfo layout="grid" />
          </motion.section>
        </motion.div>
      </div>
    </main>
  );
}
