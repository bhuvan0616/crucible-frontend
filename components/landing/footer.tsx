"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Logo } from "@/components/brand/Logo";

const footerLinks = {
  navigate: [
    { href: "/", label: "Home" },
    { href: "/shop", label: "Shop" },
    { href: "/contact", label: "Contact" },
  ],
  legal: [
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms & Conditions" },
  ],
};

export default function V4Footer() {
  return (
    <footer className="relative bg-[var(--color-surface-dark)] text-white mt-[-10px] pt-12 sm:pt-16 pb-8 overflow-hidden">
      {/* Lime Squiggly Divider */}
      <div className="absolute top-0 left-0 right-0 h-3 squiggly-divider" />

      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-[var(--color-violet)]/5 rounded-full blur-[100px]"
      />
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute -bottom-40 -left-40 w-[400px] h-[400px] bg-[var(--color-lime)]/5 rounded-full blur-[80px]"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-16 mb-16">
          <div className="md:col-span-2 lg:col-span-6">
            <Logo
              variant="long"
              linked
              imageClassName="h-11 max-w-[240px]"
              className="transition-opacity hover:opacity-90"
            />
            <p className="text-white/50 mt-6 leading-relaxed max-w-md">
              Carefully crafted 3D prints with premium materials — made to match
              what you expect, for you or someone you love.
            </p>
          </div>

          <div className="lg:col-span-3">
            <h4 className="font-bold mb-6 text-sm uppercase tracking-wider text-white/80">
              Navigate
            </h4>
            <div className="space-y-3">
              {footerLinks.navigate.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    href={link.href}
                    className="block text-white/50 hover:text-[var(--color-lime)] transition-colors py-1"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-3">
            <h4 className="font-bold mb-6 text-sm uppercase tracking-wider text-white/80">
              Legal
            </h4>
            <div className="space-y-3">
              {footerLinks.legal.map((link, i) => (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 + 0.1 }}
                >
                  <Link
                    href={link.href}
                    className="block text-white/50 hover:text-[var(--color-lime)] transition-colors py-1"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="pt-8 border-t border-[var(--color-hairline-violet)] flex flex-col md:flex-row items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="w-2 h-2 rounded-full bg-[var(--color-lime)]"
            />
            <p className="text-white/50 text-xs sm:text-sm text-center md:text-left max-w-xs sm:max-w-none">
              © 2026 Crucible Creations · Part of COKUPA FOODS (OPC) PRIVATE LIMITED. All rights reserved.
            </p>
          </div>
          <p className="text-white/30 text-xs shrink-0">
            Crafted with precision in India
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
