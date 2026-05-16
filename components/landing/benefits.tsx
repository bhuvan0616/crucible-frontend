"use client";

import { motion } from "framer-motion";

const benefits = [
  {
    number: "01",
    title: "Precision Crafted",
    description: "High-quality PLA/PETG materials ensure durability with a premium printed finish.",
  },
  {
    number: "02",
    title: "Keychain Ready",
    description: "Compact design attaches to any keyring. Always have your stand within reach.",
  },
  {
    number: "03",
    title: "Personal Touch",
    description: "Add up to 12 custom characters. Your name or message, uniquely yours.",
  },
  {
    number: "04",
    title: "Ideal Gift",
    description: "Surprise a tech enthusiast with something both practical and personal.",
  },
];

export function Benefits() {
  return (
    <section className="relative py-40 bg-[#0a0f1a]">
      {/* Top gradient divider */}
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
          <p className="text-[11px] uppercase tracking-[0.25em] text-[#14b8a6] mb-4">Crafted for You</p>
          <h2 className="text-4xl lg:text-5xl font-semibold tracking-tight text-white mb-5">
            Why It Stands Out
          </h2>
        </motion.div>

        {/* Benefits grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.number}
              initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.8,
                delay: index * 0.12,
                ease: [0.32, 0.72, 0, 1]
              }}
              className="group relative p-8 lg:p-10 rounded-[2rem] bg-white/[0.02] border border-white/[0.05] hover:border-[#14b8a6]/40 transition-all duration-500"
              whileHover={{ y: -4 }}
            >
              {/* Number accent */}
              <div className="flex items-start gap-6">
                <span className="text-[11px] uppercase tracking-[0.2em] text-[#14b8a6]/60 font-medium">
                  {benefit.number}
                </span>
                <div className="flex-1">
                  <h3 className="text-xl font-medium text-white mb-3 tracking-tight">
                    {benefit.title}
                  </h3>
                  <p className="text-[#94a3b8] text-sm leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </div>

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