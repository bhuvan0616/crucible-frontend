"use client";

import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "Pick Your Edition",
    description: "Choose from Wakanda Black, Batman Grey, or Captain Teal. Each printed to order.",
  },
  {
    number: "02",
    title: "Make It Yours",
    description: "Add up to 12 custom characters. Your name or message, permanently engraved.",
  },
  {
    number: "03",
    title: "Delivered Ready",
    description: "Carefully packaged and shipped. Your stand arrives on your doorstep.",
  },
];

export function HowItWorks() {
  return (
    <section className="relative py-40 bg-[#0f172a]">
      {/* Background texture */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f1a] via-[#0f172a] to-[#0a0f1a]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
          className="text-center mb-20"
        >
          <p className="text-[11px] uppercase tracking-[0.25em] text-[#14b8a6] mb-4">Simple Process</p>
          <h2 className="text-4xl lg:text-5xl font-semibold tracking-tight text-white mb-5">
            How It Works
          </h2>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connection line */}
          <div className="hidden lg:block absolute top-16 left-[16.67%] right-[16.67%] h-px bg-gradient-to-r from-[#14b8a6]/0 via-[#14b8a6]/20 to-[#14b8a6]/0" />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 50, filter: "blur(12px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{
                  duration: 1,
                  delay: index * 0.15,
                  ease: [0.32, 0.72, 0, 1]
                }}
                className="relative text-center lg:text-center group"
                whileHover={{ y: -6 }}
              >
                {/* Step indicator */}
                <div className="relative inline-flex mb-8">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
                    className="w-20 h-20 rounded-full bg-[#0a0f1a] border border-white/10 flex items-center justify-center group-hover:border-[#14b8a6]/30 transition-colors duration-500"
                  >
                    <span className="text-2xl font-light text-white">{step.number}</span>
                  </motion.div>
                  {/* Accent ring */}
                  <motion.div
                    className="absolute inset-0 rounded-full border border-[#14b8a6]/20 scale-110"
                    animate={{ scale: [1.1, 1.15, 1.1] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  />
                </div>

                <h3 className="text-xl font-medium text-white mb-3 tracking-tight">
                  {step.title}
                </h3>
                <p className="text-[#94a3b8] text-sm leading-relaxed max-w-xs mx-auto">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}