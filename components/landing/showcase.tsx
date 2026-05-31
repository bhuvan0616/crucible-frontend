"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import Link from "next/link";

const products = [
  {
    id: "var_black",
    name: "Wakanda Black",
    description: "Bold, sleek, unapologetically dark",
    price: 449,
    image: "/images/batman.png",
    tag: "Best Seller",
    tagBg: "bg-[var(--color-ink-deep)]",
  },
  {
    id: "var_grey",
    name: "Batman Grey",
    description: "Understated elegance for the refined",
    price: 449,
    image: "/images/black panther.png",
    tag: "Popular",
    tagBg: "bg-[var(--color-violet-mid)]",
  },
  {
    id: "var_teal",
    name: "Captain Teal",
    description: "Stand out from the crowd",
    price: 449,
    image: "/images/captain.png",
    tag: "New",
    tagBg: "bg-[var(--color-lime)]",
  },
];

export default function V4Showcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const x = useTransform(smoothProgress, [0, 1], [100, -100]);

  return (
    <section
      id="showcase"
      ref={containerRef}
      className="relative py-32 bg-[var(--color-surface-dark)] min-h-screen z-[20]"
    >
      {/* Starfield */}
      <div className="absolute inset-0 starfield opacity-50" />

      {/* Gradient Overlays */}
      <motion.div
        style={{ x }}
        className="absolute top-0 left-0 w-[200%] h-full opacity-10"
      >
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `radial-gradient(circle at 3px 3px, var(--color-lime) 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
      </motion.div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="inline-flex items-center gap-3 eyebrow text-[var(--color-lime)]"
          >
            <motion.span
              animate={{ rotate: [0, 180, 360] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="inline-block w-2 h-2 rounded-full bg-current"
            />
            Choose Your Style
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="text-5xl lg:text-7xl font-bold text-white mt-6 tracking-tight"
          >
            Three <span className="chip-lime">Editions</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-white/60 mt-6 max-w-lg mx-auto text-lg"
          >
            Each one crafted with precision. Pick yours and make it yours.
          </motion.p>
        </motion.div>

        <div className="flex gap-6 p-16 overflow-x-auto hide-scrollbar items-stretch">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 60, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.15 }}
              whileHover={{ y: -12 }}
              className="flex-shrink-0 w-[360px] group relative z-[10] h-full"
            >
              <Link href={`/product/portable-keychain-phone-stand`}>
                <div className="relative bg-[var(--color-surface-night)] rounded-[1.5rem] overflow-hidden border border-[var(--color-hairline-violet)] shadow-2xl transition-all duration-500 group-hover:border-[var(--color-lime)]/50">
                  <div className="relative aspect-square overflow-hidden">
                    <motion.img
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-surface-night)] via-transparent to-transparent opacity-70" />

                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      whileHover={{ opacity: 1, x: 0 }}
                      className="absolute inset-0 bg-[var(--color-lime)]/10 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    >
                      <span className="text-white font-bold tracking-wider uppercase">View Product</span>
                    </motion.div>

                    <motion.div
                      className={`absolute top-5 left-5 px-4 py-2 rounded-full text-xs font-bold text-white ${product.tagBg} shadow-lg`}
                      whileHover={{ scale: 1.1 }}
                    >
                      {product.tag}
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="absolute top-5 right-5 w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center"
                    >
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="var(--color-lime)">
                        <path d="M10 5l1.5 3 3.5.5-2.5 2.5.5 3.5-3-1.5-3 1.5.5-3.5L5 8.5l3.5-.5L10 5z" />
                      </svg>
                    </motion.div>
                  </div>

                  <div className="p-8">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <motion.h3
                          whileHover={{ x: 3 }}
                          className="text-2xl font-bold text-white mb-1"
                        >
                          {product.name}
                        </motion.h3>
                        <p className="text-white/50 line-clamp-1">{product.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-[var(--color-hairline-violet)]">
                      <span className="text-3xl font-bold text-white">₹{product.price}</span>
                      <motion.span
                        whileHover={{ x: 5, scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                        className="flex items-center gap-2 text-[var(--color-lime)] font-semibold cursor-pointer"
                      >
                        <span>View Details</span>
                        <motion.svg
                          animate={{ x: [0, 5, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M3 9h12M11 5l4 4-4 4" />
                        </motion.svg>
                      </motion.span>
                    </div>
                  </div>

                  <motion.div
                    className="absolute inset-0 border-2 border-transparent group-hover:border-[var(--color-lime)]/30 rounded-[1.5rem] transition-colors duration-500 pointer-events-none"
                  />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="flex justify-center items-center gap-4 text-white/40 text-sm mt-12"
        >
          <motion.div
            animate={{ x: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}