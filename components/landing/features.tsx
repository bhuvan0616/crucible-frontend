"use client";

import { motion } from "framer-motion";

const features = [
  {
    number: "01",
    title: "Crafted for You",
    description: "Personalize with up to 12 characters. Your name, your message — permanently engraved.",
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 4v28M8 8l10 10 10-10" />
        <circle cx="18" cy="28" r="6" />
        <path d="M12 28h12" />
      </svg>
    ),
    color: "from-[var(--color-lime)] to-[var(--color-lime-dark)]",
  },
  {
    number: "02",
    title: "Always With You",
    description: "Attaches to any keychain. 73mm × 35mm × 12mm of pure practicality.",
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="18" cy="18" r="12" />
        <circle cx="18" cy="18" r="6" />
        <circle cx="18" cy="18" r="2" fill="currentColor" />
        <path d="M18 2v4M18 30v4M2 18h4M30 18h4" />
      </svg>
    ),
    color: "from-[var(--color-pink)] to-[var(--color-pink-light)]",
  },
  {
    number: "03",
    title: "Premium Materials",
    description: "High-quality PLA/PETG ensures durability with a finish that feels premium.",
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 24l12-16 12 16-12 8-12-8z" />
        <path d="M10 22l8 5 8-5" />
        <circle cx="18" cy="10" r="3" fill="currentColor" />
        <path d="M18 4v3" />
      </svg>
    ),
    color: "from-[var(--color-violet)] to-[var(--color-violet-deep)]",
  },
  {
    number: "04",
    title: "Perfect Gift",
    description: "Arrives in premium packaging. Ready to surprise anyone on your list.",
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="6" y="14" width="24" height="18" rx="3" />
        <path d="M6 20h24" />
        <path d="M18 14V8" />
        <path d="M12 8h12" />
        <path d="M18 28v4M14 30h8" />
      </svg>
    ),
    color: "from-[var(--color-violet-mid)] to-[var(--color-violet)]",
  },
];

export default function V4Features() {
  return (
    <section className="relative py-32 bg-[var(--color-cream)] z-[900]">
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-[var(--color-lime)]/10 to-transparent rounded-full blur-[120px]"
      />
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-[var(--color-pink)]/10 to-transparent rounded-full blur-[100px]"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-24"
        >
          <span className="inline-flex items-center gap-3 eyebrow text-[var(--color-violet)]">
            <motion.span
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 0l2 5h5l-4 3.5 1.5 5L8 11l-4.5 2.5 1.5-5L1 5h5l2-5z" />
              </svg>
            </motion.span>
            Why Choose Us
          </span>
          <h2 className="text-5xl lg:text-7xl font-bold text-[var(--color-text-dark)] mt-6 tracking-tight">
            Built <span className="chip-lime">Different</span>
          </h2>
          <p className="text-[var(--color-text-medium)] mt-6 max-w-xl mx-auto text-lg">
            Not just another phone stand. A daily companion that says something about you.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.number}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: index * 0.1 }}
              whileHover={{ y: -12, scale: 1.02 }}
              className="group relative bg-white rounded-[1.5rem] p-8 border border-[var(--color-hairline-cloud)] shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden"
            >
              <motion.div
                className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-[var(--color-violet)]/5 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              />

              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                whileInView={{ scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 + 0.3, type: "spring", stiffness: 200 }}
                className="absolute -top-3 -left-3 w-14 h-14 rounded-2xl bg-[var(--color-surface-night)] flex items-center justify-center shadow-lg"
              >
                <span className="text-white text-sm font-bold">{feature.number}</span>
              </motion.div>

              <div className="relative z-10">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 shadow-lg`}
                >
                  <div className="text-white">{feature.icon}</div>
                </motion.div>

                <h3 className="text-xl font-bold text-[var(--color-text-dark)] mb-3 group-hover:text-[var(--color-violet)] transition-colors">
                  {feature.title}
                </h3>
                <p className="text-[var(--color-text-medium)] text-sm leading-relaxed">
                  {feature.description}
                </p>

                <motion.div
                  className="mt-6 h-1 bg-gradient-to-r from-[var(--color-lime)] to-[var(--color-pink)] rounded-full"
                  initial={{ scaleX: 0, originX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.5 }}
                />
              </div>

              <motion.div
                className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--color-lime)] to-transparent"
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