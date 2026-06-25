"use client";

import { motion } from "framer-motion";

const testimonials = [
  {
    quote: "This phone stand is genuinely the best impulse purchase I've made. The quality blew my mind for the price.",
    name: "Priya S.",
    role: "Software Engineer, Bangalore",
    product: "Captain Teal",
    avatar: "PS",
  },
  {
    quote: "I bought three as gifts. Everyone loved the engraving and the compact design. Highly recommend!",
    name: "Rahul M.",
    role: "Digital Nomad, Goa",
    product: "Wakanda Black",
    avatar: "RM",
  },
  {
    quote: "My audience on Instagram kept asking about my phone stand. Now I have a link to share with them!",
    name: "Ananya K.",
    role: "Content Creator, Mumbai",
    product: "Captain Teal",
    avatar: "AK",
  },
];

function StarRating({ delay = 0 }: { delay?: number }) {
  return (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <motion.svg
          key={i}
          initial={{ scale: 0, rotate: -180 }}
          whileInView={{ scale: 1, rotate: 0 }}
          viewport={{ once: true }}
          transition={{ delay: delay + i * 0.1, type: "spring", stiffness: 300, damping: 15 }}
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="#c2ef4e"
          className="drop-shadow-lg"
        >
          <path d="M10 1l2.47 5.19L18 6.82l-4 3.88 1 5.55L10 13.5l-5 2.75 1-5.55-4-3.88 5.53-.63L10 1z" />
        </motion.svg>
      ))}
    </div>
  );
}

function Avatar({ initials, delay }: { initials: string; delay: number }) {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay, type: "spring", stiffness: 300 }}
      className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--color-violet)] to-[var(--color-violet-deep)] flex items-center justify-center shadow-lg"
    >
      <span className="text-white font-bold text-sm">{initials}</span>
    </motion.div>
  );
}

export default function V4Testimonials() {
  return (
    <section id="reviews" className="relative py-16 md:py-24 lg:py-32 bg-[var(--color-cream)] overflow-hidden">
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-[var(--color-pink)]/10 rounded-full blur-[120px]"
      />
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 12, repeat: Infinity }}
        className="absolute -bottom-40 -right-40 w-[400px] h-[400px] bg-[var(--color-lime)]/10 rounded-full blur-[100px]"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 md:mb-16 lg:mb-20"
        >
          <span className="inline-flex items-center gap-3 eyebrow text-[var(--color-violet)]">
            <motion.span
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              ★
            </motion.span>
            Reviews
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-[var(--color-text-dark)] mt-6 tracking-tight">
            Real People, <span className="chip-lime">Real Love</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
          {testimonials.map((t, index) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 60, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.15 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="group relative bg-white rounded-[1.5rem] p-6 sm:p-8 border border-[var(--color-hairline-cloud)] shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden"
            >
              <motion.div
                className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[var(--color-lime)]/10 to-[var(--color-pink)]/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              />

              <div className="relative z-10">
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 + 0.2 }}
                  className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl text-[var(--color-violet)]/20 font-serif leading-none mb-4"
                >
                  "
                </motion.div>

                <StarRating delay={index * 0.15 + 0.3} />

                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 + 0.4 }}
                  className="text-[var(--color-text-dark)] text-base sm:text-lg leading-relaxed mt-6 mb-6 sm:mb-8"
                >
                  {t.quote}
                </motion.p>

                <motion.div
                  className="h-px bg-gradient-to-r from-[var(--color-hairline-cloud)] via-[var(--color-lime)]/50 to-transparent mb-6"
                />

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar initials={t.avatar} delay={index * 0.15 + 0.5} />
                    <div>
                      <p className="font-bold text-[var(--color-text-dark)]">{t.name}</p>
                      <p className="text-[var(--color-text-light)] text-sm">{t.role}</p>
                    </div>
                  </div>
                  <motion.span
                    whileHover={{ scale: 1.05 }}
                    className="self-start px-4 py-2 bg-gradient-to-r from-[var(--color-violet)]/10 to-[var(--color-lime)]/10 text-[var(--color-violet)] text-xs rounded-full font-semibold border border-[var(--color-violet)]/20 sm:self-auto"
                  >
                    {t.product}
                  </motion.span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16 text-center"
        >
          <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4 sm:gap-6 md:gap-8 text-[var(--color-text-light)] text-sm">
            <div className="flex items-center gap-2">
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-[var(--color-lime)]"
              >
                ★
              </motion.span>
              <span>4.9/5 Average Rating</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-[var(--color-hairline-cloud)]" />
            <span>500+ Happy Customers</span>
            <div className="hidden sm:block w-px h-4 bg-[var(--color-hairline-cloud)]" />
            <span>100% Satisfaction</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}