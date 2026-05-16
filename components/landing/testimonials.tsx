"use client";

import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Priya Sharma",
    role: "Software Engineer",
    location: "Bangalore",
    quote: "This phone stand is genius. I use it daily for video calls and it's so convenient to have on my keychain. The print quality is impressive.",
    product: "Captain Teal Edition",
  },
  {
    name: "Rahul Mehta",
    role: "Digital Nomad",
    location: "Goa",
    quote: "Perfect for my travel setup. It's so compact and the custom engraving makes it uniquely mine. Worth every rupee.",
    product: "Wakanda Black Edition",
  },
  {
    name: "Ananya Krishnan",
    role: "Content Creator",
    location: "Mumbai",
    quote: "The best impulse buy. My audience always asks about my phone stand and I love showing it off. The teal color is stunning.",
    product: "Captain Teal Edition",
  },
];

export function Testimonials() {
  return (
    <section className="relative py-40 bg-[#0a0f1a]">
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
          <p className="text-[11px] uppercase tracking-[0.25em] text-[#14b8a6] mb-4">Real Reviews</p>
          <h2 className="text-4xl lg:text-5xl font-semibold tracking-tight text-white mb-5">
            What People Say
          </h2>
        </motion.div>

        {/* Testimonial cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 50, filter: "blur(12px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.9,
                delay: index * 0.12,
                ease: [0.32, 0.72, 0, 1]
              }}
              whileHover={{ y: -6, borderColor: "rgba(20, 184, 166, 0.4)" }}
              className="relative p-8 rounded-[2rem] bg-white/[0.02] border border-white/[0.05] transition-all duration-500"
            >
              {/* Quote mark */}
              <div className="text-[#14b8a6]/20 text-6xl font-serif leading-none mb-4">"</div>

              {/* Quote text */}
              <p className="text-[#e2e8f0] text-sm leading-relaxed mb-8">
                {testimonial.quote}
              </p>

              {/* Divider */}
              <div className="h-px bg-white/[0.06] mb-6" />

              {/* Author info */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium text-sm">{testimonial.name}</p>
                  <p className="text-[#64748b] text-xs">{testimonial.role}, {testimonial.location}</p>
                </div>
                {/* Star rating with animation */}
                <motion.div
                  className="flex gap-0.5"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: index * 0.12 + 0.3, duration: 0.5 }}
                >
                  {[...Array(5)].map((_, i) => (
                    <motion.svg
                      key={i}
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05, type: "spring", stiffness: 300 }}
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="#f97316"
                    >
                      <path d="M6 0L7.347 4.145H11.708L8.181 6.705L9.528 10.854L6 8.29L2.472 10.854L3.819 6.705L0.292 4.145H4.653L6 0Z" />
                    </motion.svg>
                  ))}
                </motion.div>
              </div>

              {/* Product tag */}
              <div className="mt-6">
                <span className="text-[10px] uppercase tracking-[0.15em] text-[#14b8a6]">
                  {testimonial.product}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}