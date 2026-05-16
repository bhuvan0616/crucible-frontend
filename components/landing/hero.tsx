"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.6], [1, 0.95]);

  return (
    <section ref={ref} className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden bg-[#0a0f1a]">
      {/* Parallax atmospheric background */}
      <motion.div
        style={{ y }}
        className="absolute inset-0"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f1a] via-[#0f172a] to-[#0a0f1a]" />
        {/* Floating glow orbs */}
        <motion.div
          animate={{
            y: [0, -20, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#14b8a6]/8 rounded-full blur-[140px]"
        />
        <motion.div
          animate={{
            y: [0, 20, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-[#f97316]/6 rounded-full blur-[100px]"
        />
        <motion.div
          animate={{
            y: [0, -15, 0],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-1/2 right-1/3 w-48 h-48 bg-[#14b8a6]/5 rounded-full blur-[80px]"
        />
      </motion.div>

      {/* Grid texture */}
      <motion.div
        style={{ opacity: 0.015 }}
        className="absolute inset-0"
        data-nowebp="true"
      >
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
            backgroundSize: '80px 80px'
          }}
        />
      </motion.div>

      {/* Content */}
      <motion.div
        style={{ opacity, scale }}
        className="relative z-10 max-w-6xl mx-auto px-6 lg:px-8"
      >
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          {/* Left: Text content */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.32, 0.72, 0, 1] }}
            className="flex-1 text-center lg:text-left max-w-xl"
          >
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.32, 0.72, 0, 1] }}
            >
              <span className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] text-[10px] uppercase tracking-[0.25em] text-[#94a3b8]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#14b8a6] animate-pulse" />
                Premium 3D Printed Products
              </span>
            </motion.div>

            {/* Headline with staggered word reveal */}
            <h1 className="text-5xl lg:text-7xl font-semibold tracking-tight text-white leading-[1.05] mb-6 mt-8 overflow-hidden">
              <motion.span
                className="block"
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.9, delay: 0.15, ease: [0.32, 0.72, 0, 1] }}
              >
                Portable Keychain
              </motion.span>
              <motion.span
                className="block text-[#14b8a6]"
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.9, delay: 0.25, ease: [0.32, 0.72, 0, 1] }}
              >
                Phone Stand
              </motion.span>
            </h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: [0.32, 0.72, 0, 1] }}
              className="text-lg text-[#94a3b8] leading-relaxed mb-10 tracking-wide"
            >
              Foldable. Compact. Customizable.
            </motion.p>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.55, ease: [0.32, 0.72, 0, 1] }}
            >
              <Link href="/shop" className="inline-flex group">
                <Button
                  size="lg"
                  className="group relative bg-[#f97316] hover:bg-[#f97316]/90 text-white font-medium px-8 py-6 rounded-full transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.97] overflow-hidden"
                >
                  <span className="relative z-10">Shop Now</span>
                  {/* Arrow icon with magnetic effect */}
                  <span className="relative z-10 ml-3 inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/10 group-hover:bg-white/20 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2 12L12 2M12 2H5M12 2V9" />
                    </svg>
                  </span>
                  {/* Shine effect */}
                  <motion.span
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full"
                    animate={{ x: ["100%", "-100%"] }}
                    transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3, ease: "easeInOut" }}
                  />
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Right: Product image with parallax */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.4, delay: 0.2, ease: [0.32, 0.72, 0, 1] }}
            className="flex-1 relative w-full max-w-md lg:max-w-none"
          >
            {/* Double-bezel frame */}
            <div className="relative p-1.5 rounded-[2rem] bg-white/[0.02] border border-white/[0.06]">
              <div className="relative rounded-[calc(2rem-0.375rem)] overflow-hidden bg-gradient-to-br from-[#1e293b] to-[#0f172a] shadow-2xl shadow-black/50">
                {/* Product image with zoom on hover */}
                <Link href="/shop" className="block group">
                  <div className="aspect-square relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/80 via-transparent to-transparent z-10" />
                    <motion.img
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
                      src="/images/keychain-stand-lifestyle.jpg"
                      alt="Portable Keychain Phone Stand in Captain Teal"
                      className="w-full h-full object-cover"
                    />
                    {/* Product info overlay */}
                    <div className="absolute bottom-6 left-6 right-6 z-20">
                      <p className="text-[10px] uppercase tracking-[0.15em] text-[#14b8a6] mb-1">Captain Teal Edition</p>
                      <p className="text-white text-lg font-medium">₹449</p>
                    </div>
                  </div>
                </Link>
              </div>
            </div>

            {/* Floating badge with float animation */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{
                opacity: 1,
                x: 0,
                y: [0, -8, 0],
              }}
              transition={{
                x: { duration: 0.8, delay: 0.8, ease: [0.32, 0.72, 0, 1] },
                opacity: { duration: 0.8, delay: 0.8 },
                y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
              }}
              className="absolute -right-4 top-12 px-4 py-3 rounded-2xl bg-[#0f172a]/90 backdrop-blur-xl border border-white/[0.1] shadow-2xl shadow-black/30"
            >
              <p className="text-[10px] uppercase tracking-[0.15em] text-[#64748b]">3 Variants</p>
              <p className="text-white text-sm font-medium">Available</p>
            </motion.div>

            {/* Second floating badge */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{
                opacity: 1,
                x: 0,
                y: [0, 6, 0],
              }}
              transition={{
                x: { duration: 0.8, delay: 1, ease: [0.32, 0.72, 0, 1] },
                opacity: { duration: 0.8, delay: 1 },
                y: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 },
              }}
              className="absolute -left-4 bottom-20 px-4 py-3 rounded-2xl bg-[#0f172a]/90 backdrop-blur-xl border border-[#14b8a6]/20 shadow-xl"
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#14b8a6] animate-pulse" />
                <span className="text-[10px] uppercase tracking-[0.1em] text-[#94a3b8]">In Stock</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.4, ease: [0.32, 0.72, 0, 1] }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2"
      >
        <div className="flex flex-col items-center gap-3">
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#475569]">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: [0.32, 0.72, 0, 1] }}
            className="w-5 h-9 rounded-full border border-white/10 flex items-start justify-center p-1.5"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-white/30" />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}