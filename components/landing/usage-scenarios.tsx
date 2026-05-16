"use client";

import { motion } from "framer-motion";

const scenarios = [
  {
    title: "Desk Work",
    description: "Keep your phone at eye level during long work sessions. Perfect for video calls.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#14b8a6]">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8M12 17v4" />
      </svg>
    ),
  },
  {
    title: "Travel",
    description: "Compact enough to take anywhere. Use on plane trays or hotel desks.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#14b8a6]">
        <path d="M2 12L7 2h10l5 10M17 8l4 4-4 4-4-4" />
        <path d="M7 22v-4h10v4" />
      </svg>
    ),
  },
  {
    title: "Gifts",
    description: "A thoughtful and unique gift for tech enthusiasts and gadget lovers.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#14b8a6]">
        <path d="M20 12v10H4V12M2 7h20v5H2zM12 22V7M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z" />
      </svg>
    ),
  },
  {
    title: "Everyday Carry",
    description: "Attach it to your keychain. Always have a phone stand ready when you need one.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#14b8a6]">
        <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
  },
];

export function UsageScenarios() {
  return (
    <section className="relative py-40 bg-[#0f172a]">
      {/* Top divider */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#14b8a6]/20 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
          className="text-center mb-20"
        >
          <p className="text-[11px] uppercase tracking-[0.25em] text-[#14b8a6] mb-4">Versatile Use</p>
          <h2 className="text-4xl lg:text-5xl font-semibold tracking-tight text-white mb-5">
            Perfect For Every Situation
          </h2>
        </motion.div>

        {/* Scenarios grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {scenarios.map((scenario, index) => (
            <motion.div
              key={scenario.title}
              initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.8,
                delay: index * 0.1,
                ease: [0.32, 0.72, 0, 1]
              }}
              className="group relative p-8 rounded-[2rem] bg-white/[0.02] border border-white/[0.05] hover:border-[#14b8a6]/40 transition-all duration-500"
              whileHover={{ y: -6 }}
            >
              {/* Icon with hover animation */}
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
                className="mb-6"
              >
                {scenario.icon}
              </motion.div>

              {/* Content */}
              <h3 className="text-lg font-medium text-white mb-2 tracking-tight">
                {scenario.title}
              </h3>
              <p className="text-[#94a3b8] text-sm leading-relaxed">
                {scenario.description}
              </p>

              {/* Hover accent line */}
              <motion.div
                className="absolute bottom-0 left-8 right-8 h-px bg-gradient-to-r from-[#14b8a6]/0 via-[#14b8a6]/50 to-[#14b8a6]/0"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}