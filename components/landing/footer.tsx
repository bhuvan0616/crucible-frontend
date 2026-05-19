"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const footerLinks = {
  navigate: [
    { href: "/v4", label: "Home" },
    { href: "/v4#showcase", label: "Shop" },
    { href: "/v4#features", label: "Features" },
    { href: "/v4#reviews", label: "Reviews" },
  ],
  connect: [
    { href: "#", label: "Instagram" },
    { href: "#", label: "Twitter" },
    { href: "#", label: "LinkedIn" },
  ],
  legal: [
    { href: "#", label: "Privacy" },
    { href: "#", label: "Terms" },
    { href: "/", label: "v1 Design" },
    { href: "/v2", label: "v2 Design" },
    { href: "/v3", label: "v3 Design" },
  ],
};

export default function V4Footer() {
  return (
    <footer className="relative bg-[var(--color-surface-dark)] text-white pt-16 pb-8 overflow-hidden">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="lg:col-span-1">
            <Link href="/v4" className="flex items-center gap-3 group">
              <motion.div
                whileHover={{ rotate: 180, scale: 1.1 }}
                transition={{ duration: 0.5, type: "spring", stiffness: 300 }}
                className="w-12 h-12 bg-[var(--color-lime)] rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow"
              >
                <span className="text-[var(--color-ink-deep)] font-bold text-xl">C</span>
              </motion.div>
              <motion.span
                whileHover={{ x: 3 }}
                className="font-bold text-xl text-white group-hover:text-[var(--color-lime)] transition-colors"
              >
                Crucible Creations
              </motion.span>
            </Link>
            <p className="text-white/50 mt-6 leading-relaxed max-w-sm">
              Premium 3D printed products crafted with precision. We believe in
              quality over quantity, and every product tells a story.
            </p>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="flex gap-4 mt-8"
            >
              {["IG", "TW", "LI"].map((social, i) => (
                <motion.a
                  key={social}
                  href="#"
                  whileHover={{ scale: 1.15, y: -3 }}
                  className="w-10 h-10 rounded-full bg-white/5 border border-[var(--color-hairline-violet)] flex items-center justify-center text-sm font-bold text-white/70 hover:text-white hover:bg-white/10 transition-all"
                >
                  {social}
                </motion.a>
              ))}
            </motion.div>
          </div>

          <div>
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

          <div>
            <h4 className="font-bold mb-6 text-sm uppercase tracking-wider text-white/80">
              Connect
            </h4>
            <div className="space-y-3">
              {footerLinks.connect.map((link, i) => (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 + 0.1 }}
                >
                  <a
                    href={link.href}
                    className="block text-white/50 hover:text-[var(--color-lime)] transition-colors py-1"
                  >
                    {link.label}
                  </a>
                </motion.div>
              ))}
            </div>
          </div>

          <div>
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
                  transition={{ delay: i * 0.05 + 0.2 }}
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
            <p className="text-white/50 text-sm">
              © 2026 Crucible Creations. All rights reserved.
            </p>
          </div>
          <p className="text-white/30 text-xs">
            Crafted with precision in India
          </p>
        </motion.div>
      </div>
    </footer>
  );
}