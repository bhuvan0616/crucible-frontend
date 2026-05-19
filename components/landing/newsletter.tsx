"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function V4Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email");
      return;
    }
    setError("");
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setSubmitted(true);
    }, 1000);
  };

  return (
    <section className="relative py-32 bg-[var(--color-surface-night)] overflow-hidden">
      <div className="absolute inset-0 starfield opacity-20" />

      <motion.div
        animate={{ scale: [1, 1.2, 1], x: [0, 30, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-[var(--color-lime)]/15 rounded-full blur-[120px]"
      />
      <motion.div
        animate={{ scale: [1, 1.1, 1], x: [0, -20, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-[var(--color-pink)]/10 rounded-full blur-[80px]"
      />

      <motion.div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full">
          <defs>
            <pattern id="newsletter-grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="var(--color-lime)" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#newsletter-grid)" />
        </svg>
      </motion.div>

      <div className="relative z-10 max-w-2xl mx-auto px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.span
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--color-lime)]/20 mb-6"
          >
            <motion.svg
              animate={{ y: [-3, 3, -3] }}
              transition={{ duration: 2, repeat: Infinity }}
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              stroke="var(--color-lime)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="4" y="6" width="24" height="20" rx="3" />
              <path d="M4 10l12 8 12-8" />
            </motion.svg>
          </motion.span>

          <span className="eyebrow text-[var(--color-lime)]">Stay Updated</span>
          <h2 className="text-5xl lg:text-7xl font-bold text-white mt-6 tracking-tight">
            Be First to <span className="chip-lime">Know</span>
          </h2>
          <p className="text-white/60 mt-6 max-w-md mx-auto text-lg">
            New colors, special offers, and early access. No spam, ever.
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.form
              key="form"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              onSubmit={handleSubmit}
              className="mt-12"
            >
              <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                <div className="flex-1 relative">
                  <motion.input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    whileFocus={{ scale: 1.02 }}
                    className="w-full px-8 py-5 bg-[var(--color-surface-dark)]/80 backdrop-blur-md border border-[var(--color-hairline-violet)] rounded-full text-white placeholder:text-white/40 focus:outline-none focus:border-[var(--color-lime)] focus:bg-[var(--color-surface-dark)] transition-all"
                  />
                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute -bottom-8 left-8 text-[var(--color-pink)] text-sm"
                    >
                      {error}
                    </motion.p>
                  )}
                </div>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={isLoading}
                  className="group px-10 py-5 bg-[var(--color-lime)] text-[var(--color-ink-deep)] font-bold rounded-full whitespace-nowrap hover:shadow-2xl hover:shadow-[var(--color-lime)]/30 transition-all flex items-center justify-center gap-3 disabled:opacity-70"
                >
                  {isLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-[var(--color-ink-deep)]/30 border-t-[var(--color-ink-deep)] rounded-full"
                    />
                  ) : (
                    <>
                      <span className="uppercase tracking-wider">Subscribe</span>
                      <motion.svg
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M3 10h14M13 5l5 5-5 5" />
                      </motion.svg>
                    </>
                  )}
                </motion.button>
              </div>
            </motion.form>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -20 }}
              transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
              className="mt-12 p-10 bg-[var(--color-surface-dark)]/80 backdrop-blur-md border border-[var(--color-hairline-violet)] rounded-3xl"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
                className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-[var(--color-lime)] to-[var(--color-lime-dark)] rounded-full flex items-center justify-center shadow-2xl shadow-[var(--color-lime)]/30"
              >
                <motion.svg
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  width="40"
                  height="40"
                  viewBox="0 0 40 40"
                  fill="none"
                  stroke="var(--color-ink-deep)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <motion.path
                    d="M10 20l8 8 14-14"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                  />
                </motion.svg>
              </motion.div>
              <p className="text-white text-2xl font-bold">You're on the list!</p>
              <p className="text-white/60 mt-3">We'll be in touch soon.</p>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-16 flex items-center justify-center gap-12 text-white/50"
        >
          {["New Colors", "Special Offers", "Early Access"].map((item, i) => (
            <motion.div
              key={item}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 + i * 0.1 }}
              className="flex items-center gap-2"
            >
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                className="w-2 h-2 rounded-full bg-[var(--color-lime)]"
              />
              <span className="text-sm uppercase tracking-wider">{item}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}