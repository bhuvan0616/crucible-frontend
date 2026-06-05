"use client";

import { motion } from "framer-motion";
import { PrivacyContent } from "@/components/legal/PrivacyContent";
import { pageMainClassName } from "@/components/layout/pageShell";
import { siteLegal } from "@/lib/legal/siteLegal";

export function PrivacyPageContent() {
  return (
    <main className={pageMainClassName}>
      <div className="container mx-auto px-4">
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-3xl"
        >
          <header className="mb-8 border-b border-[var(--color-hairline-violet)] pb-8">
            <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
              Privacy Policy
            </h1>
            <p className="mt-2 text-sm text-[var(--color-on-dark-muted)]">
              {siteLegal.brandName} · part of {siteLegal.entityName}
            </p>
            <p className="mt-1 text-xs text-[var(--color-on-dark-faint)]">
              Last updated: {siteLegal.lastUpdated}
            </p>
          </header>

          <div className="rounded-xl border border-[var(--color-hairline-violet)] bg-[var(--color-ink-deep)] p-6 md:p-8">
            <PrivacyContent />
          </div>
        </motion.article>
      </div>
    </main>
  );
}
