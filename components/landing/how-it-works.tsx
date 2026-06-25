"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "Choose Edition",
    description: "Pick from Wakanda Black, Batman Grey, or Captain Teal",
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="20" cy="20" r="14" />
        <circle cx="20" cy="20" r="8" />
        <circle cx="20" cy="20" r="3" fill="white" />
        <path d="M20 2v4M20 34v4M2 20h4M34 20h4" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Add Your Text",
    description: "Enter up to 12 characters for custom engraving",
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 32L32 8" />
        <path d="M28 8h4v4" />
        <path d="M8 32l4-4" />
        <circle cx="14" cy="14" r="3" />
        <circle cx="26" cy="26" r="3" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "We Craft It",
    description: "3D printed with precision to your exact specifications",
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="8" y="8" width="24" height="24" rx="4" />
        <path d="M8 16h24" />
        <path d="M16 8v8" />
        <path d="M24 8v8" />
        <circle cx="20" cy="26" r="4" />
        <path d="M20 22v4l2 2" />
      </svg>
    ),
  },
  {
    number: "04",
    title: "Delivered",
    description: "Arrives in 5-7 days, ready to use or gift",
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="6" y="14" width="28" height="20" rx="3" />
        <path d="M6 22h28" />
        <path d="M20 14V8" />
        <path d="M14 8h12" />
        <path d="M20 30v4M16 32h8" />
      </svg>
    ),
  },
];

export default function V4HowItWorks() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const scale = useTransform(smoothProgress, [0, 0.5, 1], [0.8, 1.2, 0.8]);
  const opacity = useTransform(smoothProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  const rotate = useTransform(smoothProgress, [0, 1], [0, 360]);

  return (
    <section
      ref={containerRef}
      className="relative py-16 md:py-24 lg:py-32 bg-[var(--color-surface-dark)] overflow-hidden"
    >
      <div className="absolute inset-0 starfield opacity-30" />

      <motion.div
        style={{ scale, opacity }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] border border-[var(--color-lime)]/20 rounded-full"
      />
      <motion.div
        style={{ scale: useTransform(smoothProgress, [0, 0.5, 1], [0.9, 1.1, 0.9]), opacity }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] border border-[var(--color-pink)]/15 rounded-full"
      />
      <motion.div
        style={{ scale: useTransform(smoothProgress, [0, 0.5, 1], [1, 0.95, 1]), opacity }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-[var(--color-violet)]/20 rounded-full"
      />

      <motion.div
        style={{ rotate }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px]"
      >
        <svg viewBox="0 0 400 400" className="w-full h-full opacity-20">
          <circle cx="200" cy="200" r="180" fill="none" stroke="var(--color-lime)" strokeWidth="0.5" strokeDasharray="10 5" />
          <circle cx="200" cy="200" r="140" fill="none" stroke="var(--color-pink)" strokeWidth="0.5" strokeDasharray="8 4" />
        </svg>
      </motion.div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 md:mb-16 lg:mb-24"
        >
          <span className="inline-flex items-center gap-3 eyebrow text-[var(--color-lime)]">
            <motion.span
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              ↓
            </motion.span>
            Simple Process
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mt-6 tracking-tight">
            How It <span className="chip-lime">Works</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 md:gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 60, scale: 0.8 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: index * 0.12 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="relative text-center group"
            >
              {index < steps.length - 1 && (
                <motion.div
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.12 + 0.3 }}
                  className="hidden xl:block absolute top-16 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-[var(--color-lime)] via-[var(--color-pink)] to-transparent"
                />
              )}

              <motion.div
                whileHover={{ scale: 1.15, rotate: 5 }}
                transition={{ duration: 0.4, type: "spring", stiffness: 300 }}
                className="relative inline-flex items-center justify-center w-24 h-24 sm:w-28 sm:h-28 mb-8"
              >
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute inset-0 bg-gradient-to-br from-[var(--color-lime)]/20 to-[var(--color-pink)]/20 rounded-full"
                />
                <motion.div
                  animate={{ scale: [1, 1.08, 1] }}
                  transition={{ duration: 2.5, repeat: Infinity, delay: index * 0.2 }}
                  className="absolute inset-4 bg-gradient-to-br from-[var(--color-lime)]/30 to-[var(--color-pink)]/20 rounded-full"
                />
                <div className="relative w-20 h-20 bg-gradient-to-br from-[var(--color-surface-night)] to-[var(--color-surface-dark)] rounded-full flex items-center justify-center shadow-2xl group-hover:shadow-[var(--color-lime)]/20 transition-shadow">
                  {step.icon}
                </div>

                <motion.span
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.12 + 0.2, type: "spring", stiffness: 400 }}
                  className="absolute -top-2 -right-2 w-10 h-10 bg-gradient-to-br from-[var(--color-pink)] to-[var(--color-pink-light)] text-white text-sm font-bold rounded-full flex items-center justify-center shadow-lg"
                >
                  {step.number}
                </motion.span>
              </motion.div>

              <motion.h3
                whileHover={{ scale: 1.05 }}
                className="text-xl sm:text-2xl font-bold text-white mb-3 group-hover:text-[var(--color-lime)] transition-colors"
              >
                {step.title}
              </motion.h3>
              <p className="text-white/50 text-sm group-hover:text-white transition-colors">
                {step.description}
              </p>

              <motion.div
                className="mt-6 mx-auto w-12 h-1 bg-gradient-to-r from-[var(--color-lime)] to-[var(--color-pink)] rounded-full"
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.5 }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}